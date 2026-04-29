
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../../shared/data.service';

type Vue = 'apercu' | 'livreurs' | 'livraisons' | 'production' | 'ventes' | 'commandes';

export interface GerantCommande {
  id: string;
  date: Date;
  type: 'livreur' | 'fournisseur';
  destinataire: string;
  produits: { nom: string; quantite: number; prix: number }[];
  total: number;
  statut: 'en_attente' | 'validee' | 'livree' | 'annulee';
  note?: string;
}

@Component({
  selector: 'app-commande-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-list-component.html',
  styleUrl: './commande-list-component.css',
})
export class CommandeListComponent {

  protected readonly Math = Math;
  readonly router = inject(Router);
  ds = inject(DataService);

  vue = signal<Vue>('commandes');

  // État pour les modals
  showDetailsModal = signal(false);
  showEditModal = signal(false);
  selectedCommande = signal<GerantCommande | null>(null);

  // État pour la modification des quantités
  isEditingQuantities = signal(false);
  editedProduits = signal<{ nom: string; quantite: number; prix: number }[]>([]);

  // Filtres
  filtreStatut = signal<string>('tous');
  filtreType = signal<string>('tous');
  searchTerm = signal('');

  // Commandes du gérant (données mockées)
  commandes = signal<GerantCommande[]>([
    {
      id: 'CMD001',
      date: new Date(2024, 2, 15, 12, 30),
      type: 'livreur',
      destinataire: 'Moussa Thiaw',
      produits: [
        { nom: 'Burger Classique', quantite: 4, prix: 8500 },
        { nom: 'Frites Maison', quantite: 4, prix: 2500 },
        { nom: 'Soda 33cl', quantite: 4, prix: 1500 }
      ],
      total: 50000,
      statut: 'en_attente',
      note: 'Sans oignons pour un burger'
    },
    {
      id: 'CMD002',
      date: new Date(2024, 2, 15, 13, 15),
      type: 'livreur',
      destinataire: 'Ibrahima Sow',
      produits: [
        { nom: 'Salade César', quantite: 2, prix: 5500 },
        { nom: 'Vin Rouge (Verre)', quantite: 2, prix: 4000 }
      ],
      total: 19000,
      statut: 'en_attente',
      note: 'Sauce à part'
    },
    {
      id: 'CMD003',
      date: new Date(2024, 2, 14, 10, 0),
      type: 'fournisseur',
      destinataire: 'Boucherie du Littoral',
      produits: [
        { nom: 'Filet de bœuf', quantite: 15, prix: 15000 },
        { nom: 'Blanc de poulet', quantite: 10, prix: 5500 }
      ],
      total: 280000,
      statut: 'validee',
      note: 'Livraison prévue demain matin'
    },
    {
      id: 'CMD004',
      date: new Date(2024, 2, 14, 15, 45),
      type: 'fournisseur',
      destinataire: 'Grossiste Maraîcher',
      produits: [
        { nom: 'Pommes de terre', quantite: 100, prix: 800 },
        { nom: 'Tomates grappe', quantite: 20, prix: 1200 },
        { nom: 'Oignons jaunes', quantite: 10, prix: 600 }
      ],
      total: 110000,
      statut: 'livree',
      note: 'Vérifier la qualité des tomates à réception'
    },
    {
      id: 'CMD005',
      date: new Date(2024, 2, 13, 20, 30),
      type: 'livreur',
      destinataire: 'Omar Faye',
      produits: [
        { nom: 'Pâtes Carbonara', quantite: 3, prix: 7000 },
        { nom: 'Tiramisu', quantite: 3, prix: 3500 }
      ],
      total: 31500,
      statut: 'annulee',
      note: 'Annulé : erreur de zone de livraison'
    }
  ]);


  // Commandes filtrées
  commandesFiltrees = computed(() => {
    let result = this.commandes();

    if (this.filtreStatut() !== 'tous') {
      result = result.filter(c => c.statut === this.filtreStatut());
    }

    if (this.filtreType() !== 'tous') {
      result = result.filter(c => c.type === this.filtreType());
    }

    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(c =>
        c.id.toLowerCase().includes(search) ||
        c.destinataire.toLowerCase().includes(search)
      );
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Statistiques
  stats = computed(() => {
    const commandes = this.commandes();
    const total = commandes.length;
    const enAttente = commandes.filter(c => c.statut === 'en_attente').length;
    const validees = commandes.filter(c => c.statut === 'validee').length;
    const livrees = commandes.filter(c => c.statut === 'livree').length;
    const annulees = commandes.filter(c => c.statut === 'annulee').length;
    const totalMontant = commandes.reduce((sum, c) => sum + c.total, 0);

    return { total, enAttente, validees, livrees, annulees, totalMontant };
  });

  // Calcul du nouveau total des produits édités
  nouveauTotal = computed(() => {
    return this.editedProduits().reduce((sum, p) => sum + (p.quantite * p.prix), 0);
  });

  // Vérifier si la commande est modifiable
  isModifiable(commande: GerantCommande): boolean {
    return commande.statut !== 'livree' && commande.statut !== 'annulee';
  }

  // Vérifier si on peut modifier les quantités (uniquement pour les commandes en attente)
  canEditQuantities(commande: GerantCommande): boolean {
    return commande.statut === 'en_attente';
  }

  // Ouvrir le modal de modification
  modifierCommande(commande: GerantCommande): void {
    this.selectedCommande.set(commande);

    if (this.canEditQuantities(commande)) {
      this.isEditingQuantities.set(true);
      this.editedProduits.set([...commande.produits]);
    } else {
      this.isEditingQuantities.set(false);
      this.editedProduits.set([]);
    }

    this.showEditModal.set(true);
  }

  // Modifier la quantité d'un produit
  modifierQuantiteProduit(index: number, nouvelleQuantite: number): void {
    if (nouvelleQuantite <= 0) {
      this.editedProduits.update(produits =>
        produits.filter((_, i) => i !== index)
      );
    } else {
      this.editedProduits.update(produits =>
        produits.map((p, i) =>
          i === index ? { ...p, quantite: nouvelleQuantite } : p
        )
      );
    }
  }

  // Sauvegarder les modifications
  sauvegarderModification(): void {
    const commande = this.selectedCommande();
    if (!commande) return;

    let updatedCommande = { ...commande };

    if (this.isEditingQuantities()) {
      const produitsModifies = this.editedProduits();
      const nouveauTotal = this.nouveauTotal();

      updatedCommande = {
        ...updatedCommande,
        produits: produitsModifies,
        total: nouveauTotal
      };
    }

    const statutSelect = document.getElementById('commande-statut') as HTMLSelectElement;
    const noteTextarea = document.getElementById('commande-note') as HTMLTextAreaElement;

    if (statutSelect) {
      updatedCommande.statut = statutSelect.value as GerantCommande['statut'];
    }

    if (noteTextarea) {
      updatedCommande.note = noteTextarea.value;
    }

    this.commandes.update(list =>
      list.map(c => c.id === updatedCommande.id ? updatedCommande : c)
    );

    this.fermerModal();
    alert('Commande modifiée avec succès !');
  }

  // Annuler la commande
  annulerCommande(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.commandes.update(list =>
        list.map(c => c.id === id ? { ...c, statut: 'annulee' } : c)
      );
      alert('Commande annulée avec succès');
    }
  }

  // Voir les détails
  voirDetails(commande: GerantCommande): void {
    this.selectedCommande.set(commande);
    this.showDetailsModal.set(true);
  }

  // Fermer les modals
  fermerModal(): void {
    this.showDetailsModal.set(false);
    this.showEditModal.set(false);
    this.selectedCommande.set(null);
    this.isEditingQuantities.set(false);
    this.editedProduits.set([]);
  }

  // Filtres
  resetFiltres(): void {
    this.filtreStatut.set('tous');
    this.filtreType.set('tous');
    this.searchTerm.set('');
  }

  // Redirection vers la page d'historique
  voirHistorique(): void {
    this.router.navigate(['/gerant/historique-commandes']);
  }

  // Helpers
  getStatutInfo(statut: string): { label: string; class: string; icon: string } {
    const map: Record<string, { label: string; class: string; icon: string }> = {
      en_attente: { label: 'En attente', class: 'warning', icon: '⏳' },
      validee: { label: 'Validée', class: 'info', icon: '✓' },
      livree: { label: 'Livrée', class: 'success', icon: '✅' },
      annulee: { label: 'Annulée', class: 'danger', icon: '❌' }
    };
    return map[statut] || { label: statut, class: 'info', icon: '📦' };
  }

  getTypeInfo(type: string): { label: string; icon: string } {
    return type === 'livreur'
      ? { label: 'Livreur', icon: '🏍️' }
      : { label: 'Fournisseur', icon: '🏭' };
  }

  formatDate(date: Date): string {
    if (!date) return 'Date inconnue';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  PasserUneCommande() {
    this.router.navigate(['/gerant/passser-une-commande']);
  }

}

