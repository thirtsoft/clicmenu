
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
      date: new Date(2024, 2, 15, 10, 30),
      type: 'livreur',
      destinataire: 'Moussa Thiaw',
      produits: [
        { nom: 'Baguette tradition', quantite: 50, prix: 500 },
        { nom: 'Croissant', quantite: 30, prix: 450 },
        { nom: 'Pain au chocolat', quantite: 20, prix: 500 }
      ],
      total: 48500,
      statut: 'en_attente',
      note: ''
    },
    {
      id: 'CMD002',
      date: new Date(2024, 2, 15, 9, 15),
      type: 'livreur',
      destinataire: 'Ibrahima Sow',
      produits: [
        { nom: 'Baguette complète', quantite: 40, prix: 600 },
        { nom: 'Palmier', quantite: 25, prix: 400 }
      ],
      total: 34000,
      statut: 'en_attente',
      note: ''
    },
    {
      id: 'CMD003',
      date: new Date(2024, 2, 14, 14, 0),
      type: 'fournisseur',
      destinataire: 'Grands Moulins de Dakar',
      produits: [
        { nom: 'Farine T55', quantite: 100, prix: 650 },
        { nom: 'Levure fraîche', quantite: 20, prix: 4500 }
      ],
      total: 155000,
      statut: 'validee',
      note: 'Livraison prévue le 20 mars'
    },
    {
      id: 'CMD004',
      date: new Date(2024, 2, 14, 11, 45),
      type: 'fournisseur',
      destinataire: 'Société Laitière du Sénégal',
      produits: [
        { nom: 'Beurre 84%', quantite: 30, prix: 5200 },
        { nom: 'Oeufs frais', quantite: 15, prix: 3500 }
      ],
      total: 208500,
      statut: 'livree',
      note: 'Livré avec succès'
    },
    {
      id: 'CMD005',
      date: new Date(2024, 2, 13, 8, 30),
      type: 'livreur',
      destinataire: 'Omar Faye',
      produits: [
        { nom: 'Pain de campagne', quantite: 25, prix: 800 },
        { nom: 'Éclair au chocolat', quantite: 15, prix: 650 }
      ],
      total: 29750,
      statut: 'annulee',
      note: 'Annulé sur demande du client'
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

