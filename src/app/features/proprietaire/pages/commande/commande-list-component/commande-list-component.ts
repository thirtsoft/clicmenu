import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type PeriodeType = 'jour' | 'semaine' | 'mois';
export type SectionType = 'apercu' | 'boulangeries' | 'gerants' | 'approvisionnements' | 'commandes' | 'investissements' | 'depenses';

// Interface pour les commandes du propriétaire
export interface CommandeBoulangerie {
  id: string;
  date: Date;
  boulangerie: string;
  boulangerieId: string;
  gerantNom: string;
  type: 'matieres_premieres' | 'fournitures' | 'equipements';
  produits: { nom: string; quantite: number; prix: number; unite: string }[];
  total: number;
  statut: 'en_attente' | 'validee' | 'livree' | 'annulee';
  note?: string;
  fournisseur: string;
}

@Component({
  selector: 'app-commande-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-list-component.html',
  styleUrl: './commande-list-component.css',
})
export class CommandeListComponent {

  router = inject(Router);

  protected readonly Math = Math;

  // État pour le modal
  showDetailsModal = signal(false);
  showEditModal = signal(false);
  selectedCommande = signal<CommandeBoulangerie | null>(null);

  // État pour la modification
  editedStatut = signal<string>('');
  editedNote = signal<string>('');
  editedProduits = signal<{ nom: string; quantite: number; prix: number; unite: string }[]>([]);

  // État des filtres
  filtreNumero = signal('');
  filtreBoulangerie = signal<string>('toutes');
  filtreType = signal<string>('tous');
  filtreDate = signal<string>('');
  searchTerm = signal('');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(5);
  itemsPerPageOptions = [5, 10, 20, 50];

  // Boulangeries
  boulangeries = signal([
    { id: 'B1', nom: 'Rose — Plateau' },
    { id: 'B2', nom: 'Rose — Almadies' },
    { id: 'B3', nom: 'Rose — Mermoz' },
    { id: 'B4', nom: 'Rose — Ouakam' },
  ]);

  // Commandes en attente des boulangeries
  commandesEnAttente = signal<CommandeBoulangerie[]>([
    {
      id: 'CMD001',
      date: new Date(2024, 2, 23, 10, 30),
      boulangerie: 'Rose — Plateau',
      boulangerieId: 'B1',
      gerantNom: 'Moussa Diop',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Farine T55', quantite: 100, prix: 650, unite: 'kg' },
        { nom: 'Levure fraîche', quantite: 20, prix: 4500, unite: 'kg' },
        { nom: 'Sel fin', quantite: 30, prix: 300, unite: 'kg' }
      ],
      total: 159500,
      statut: 'en_attente',
      fournisseur: 'Grands Moulins de Dakar',
      note: 'Urgent - Stock faible'
    },
    {
      id: 'CMD002',
      date: new Date(2024, 2, 23, 9, 15),
      boulangerie: 'Rose — Almadies',
      boulangerieId: 'B2',
      gerantNom: 'Aminata Koné',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Beurre 84%', quantite: 30, prix: 5200, unite: 'kg' },
        { nom: 'Sucre blanc', quantite: 50, prix: 700, unite: 'kg' }
      ],
      total: 191000,
      statut: 'en_attente',
      fournisseur: 'Société Laitière du Sénégal',
      note: 'Livraison souhaitée demain'
    },
    {
      id: 'CMD003',
      date: new Date(2024, 2, 22, 14, 0),
      boulangerie: 'Rose — Mermoz',
      boulangerieId: 'B3',
      gerantNom: 'Oumar Thiaw',
      type: 'fournitures',
      produits: [
        { nom: 'Sacs kraft pain', quantite: 200, prix: 2500, unite: 'lot' },
        { nom: 'Boîtes pâtisserie', quantite: 100, prix: 4000, unite: 'lot' }
      ],
      total: 900000,
      statut: 'en_attente',
      fournisseur: 'Emballages du Sénégal',
      note: ''
    },
    {
      id: 'CMD004',
      date: new Date(2024, 2, 22, 11, 45),
      boulangerie: 'Rose — Ouakam',
      boulangerieId: 'B4',
      gerantNom: 'Fatou Ndiaye',
      type: 'equipements',
      produits: [
        { nom: 'Fournisseur Gaz butane', quantite: 5, prix: 7500, unite: 'bouteille' }
      ],
      total: 37500,
      statut: 'en_attente',
      fournisseur: 'Gaz du Sénégal',
      note: ''
    },
    {
      id: 'CMD005',
      date: new Date(2024, 2, 21, 8, 30),
      boulangerie: 'Rose — Plateau',
      boulangerieId: 'B1',
      gerantNom: 'Moussa Diop',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Chocolat pâtissier', quantite: 15, prix: 8000, unite: 'kg' },
        { nom: 'Oeufs frais', quantite: 30, prix: 3500, unite: 'boîte' }
      ],
      total: 225000,
      statut: 'en_attente',
      fournisseur: 'Fournisseur Beurre & Oeufs',
      note: 'Pour les pâtisseries'
    },
    {
      id: 'CMD006',
      date: new Date(2024, 2, 21, 14, 30),
      boulangerie: 'Rose — Mermoz',
      boulangerieId: 'B3',
      gerantNom: 'Oumar Thiaw',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Farine T55', quantite: 150, prix: 650, unite: 'kg' }
      ],
      total: 97500,
      statut: 'en_attente',
      fournisseur: 'Grands Moulins de Dakar',
      note: ''
    }
  ]);

  // Commandes validées (historique)
  commandesValidees = signal<CommandeBoulangerie[]>([
    {
      id: 'CMD101',
      date: new Date(2024, 2, 20, 10, 0),
      boulangerie: 'Rose — Plateau',
      boulangerieId: 'B1',
      gerantNom: 'Moussa Diop',
      type: 'matieres_premieres',
      produits: [{ nom: 'Farine T55', quantite: 200, prix: 650, unite: 'kg' }],
      total: 130000,
      statut: 'validee',
      fournisseur: 'Grands Moulins de Dakar',
      note: 'Validée le 20/03/2024'
    },
    {
      id: 'CMD102',
      date: new Date(2024, 2, 19, 9, 30),
      boulangerie: 'Rose — Almadies',
      boulangerieId: 'B2',
      gerantNom: 'Aminata Koné',
      type: 'fournitures',
      produits: [{ nom: 'Sacs kraft pain', quantite: 100, prix: 2500, unite: 'lot' }],
      total: 250000,
      statut: 'livree',
      fournisseur: 'Emballages du Sénégal',
      note: 'Livrée le 21/03/2024'
    }
  ]);

  // Toutes les commandes = en attente + validées
  toutesCommandes = computed(() => {
    return [...this.commandesEnAttente(), ...this.commandesValidees()];
  });

  // Options pour les filtres
  boulangeriesOptions = computed(() => {
    const boulangeriesSet = new Set(this.toutesCommandes().map(c => c.boulangerie));
    return ['toutes', ...Array.from(boulangeriesSet)];
  });

  typesDisponibles = [
    { value: 'tous', label: 'Tous' },
    { value: 'matieres_premieres', label: '🌾 Matières premières' },
    { value: 'fournitures', label: '📦 Fournitures' },
    { value: 'equipements', label: '⚙️ Équipements' }
  ];

  // Commandes filtrées
  commandesFiltrees = computed(() => {
    let result = this.toutesCommandes();

    const numero = this.filtreNumero().toLowerCase();
    if (numero) {
      result = result.filter(c => c.id.toLowerCase().includes(numero));
    }

    if (this.filtreBoulangerie() !== 'toutes') {
      result = result.filter(c => c.boulangerie === this.filtreBoulangerie());
    }

    if (this.filtreType() !== 'tous') {
      result = result.filter(c => c.type === this.filtreType());
    }

    if (this.filtreDate()) {
      const dateFilter = new Date(this.filtreDate());
      result = result.filter(c =>
        c.date.toDateString() === dateFilter.toDateString()
      );
    }

    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(c =>
        c.id.toLowerCase().includes(search) ||
        c.boulangerie.toLowerCase().includes(search) ||
        c.gerantNom.toLowerCase().includes(search)
      );
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Commandes en attente uniquement
  commandesEnAttenteFiltrees = computed(() => {
    return this.commandesFiltrees().filter(c => c.statut === 'en_attente');
  });

  // Total des commandes en attente
  totalEnAttente = computed(() => {
    return this.commandesEnAttenteFiltrees().reduce((sum, cmd) => sum + cmd.total, 0);
  });

  // Pagination
  totalPages = computed(() => {
    return Math.ceil(this.commandesFiltrees().length / this.itemsPerPage());
  });

  commandesPaginees = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.commandesFiltrees().slice(start, end);
  });

  constructor() {
    effect(() => {
      this.filtreNumero();
      this.filtreBoulangerie();
      this.filtreType();
      this.filtreDate();
      this.searchTerm();
      this.itemsPerPage();
      this.currentPage.set(1);
    });
  }

  resetFiltres(): void {
    this.filtreNumero.set('');
    this.filtreBoulangerie.set('toutes');
    this.filtreType.set('tous');
    this.filtreDate.set('');
    this.searchTerm.set('');
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage.set(items);
    this.currentPage.set(1);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1);
    }
    if (current + delta < total - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (total !== 1) {
      range.push(total);
    }

    return range;
  }

  voirDetails(commande: CommandeBoulangerie): void {
    this.selectedCommande.set(commande);
    this.showDetailsModal.set(true);
  }

  ouvrirModification(commande: CommandeBoulangerie): void {
    this.selectedCommande.set(commande);
    this.editedStatut.set(commande.statut);
    this.editedNote.set(commande.note || '');
    this.editedProduits.set([...commande.produits]);
    this.showEditModal.set(true);
  }

  fermerModal(): void {
    this.showDetailsModal.set(false);
    this.showEditModal.set(false);
    this.selectedCommande.set(null);
    this.editedStatut.set('');
    this.editedNote.set('');
    this.editedProduits.set([]);
  }

  validerCommande(): void {
    const commande = this.selectedCommande();
    if (!commande) return;

    // Mettre à jour le statut de la commande
    const commandeValidee = {
      ...commande,
      statut: 'validee' as const,
      note: this.editedNote() || 'Validée par le propriétaire'
    };

    // Retirer de la liste des commandes en attente
    this.commandesEnAttente.update(list =>
      list.filter(c => c.id !== commande.id)
    );

    // Ajouter à la liste des commandes validées
    this.commandesValidees.update(list =>
      [commandeValidee, ...list]
    );

    this.fermerModal();
    alert(`Commande ${commande.id} validée avec succès !`);
  }

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

  nouveauTotal = computed(() => {
    return this.editedProduits().reduce((sum, p) => sum + (p.quantite * p.prix), 0);
  });

  sauvegarderModifications(): void {
    const commande = this.selectedCommande();
    if (!commande) return;

    const commandeModifiee = {
      ...commande,
      produits: this.editedProduits(),
      total: this.nouveauTotal(),
      statut: this.editedStatut() as CommandeBoulangerie['statut'],
      note: this.editedNote()
    };

    // Mettre à jour la liste selon le statut
    if (commandeModifiee.statut === 'en_attente') {
      this.commandesEnAttente.update(list =>
        list.map(c => c.id === commande.id ? commandeModifiee : c)
      );
    } else {
      this.commandesValidees.update(list =>
        list.map(c => c.id === commande.id ? commandeModifiee : c)
      );
    }

    this.fermerModal();
    alert(`Commande ${commande.id} modifiée avec succès !`);
  }

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
    const map: Record<string, { label: string; icon: string }> = {
      matieres_premieres: { label: 'Matières premières', icon: '🌾' },
      fournitures: { label: 'Fournitures', icon: '📦' },
      equipements: { label: 'Équipements', icon: '⚙️' }
    };
    return map[type] || { label: type, icon: '📦' };
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatDateLong(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  voirHistorique(): void {
    this.router.navigate(['/proprietaire/historique-commandes']);
  }

}
