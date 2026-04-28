import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface HistoriqueCommande {
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
  selector: 'app-historique-commandes-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-commandes-component.html',
  styleUrl: './historique-commandes-component.css',
})
export class HistoriqueCommandesComponent implements AfterViewInit {

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  router = inject(Router);
  protected readonly Math = Math;

  showDetailsModal = signal(false);
  selectedCommande = signal<HistoriqueCommande | null>(null);

  filtreNumero = signal('');
  filtreStatut = signal<string>('tous');
  filtreType = signal<string>('tous');
  filtreMois = signal<string>('tous');
  filtreAnnee = signal<string>('toutes');

  currentPage = signal(1);
  itemsPerPage = signal(5);
  itemsPerPageOptions = [5, 10, 20, 50];

  allCommandes = signal<HistoriqueCommande[]>([
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
      statut: 'livree',
      note: 'Livraison effectuée avec succès'
    },
    {
      id: 'CMD002',
      date: new Date(2024, 2, 14, 9, 15),
      type: 'livreur',
      destinataire: 'Ibrahima Sow',
      produits: [
        { nom: 'Baguette complète', quantite: 40, prix: 600 },
        { nom: 'Palmier', quantite: 25, prix: 400 }
      ],
      total: 34000,
      statut: 'livree',
      note: ''
    },
    {
      id: 'CMD003',
      date: new Date(2024, 2, 10, 14, 0),
      type: 'fournisseur',
      destinataire: 'Grands Moulins de Dakar',
      produits: [
        { nom: 'Farine T55', quantite: 100, prix: 650 },
        { nom: 'Levure fraîche', quantite: 20, prix: 4500 }
      ],
      total: 155000,
      statut: 'livree',
      note: 'Commande reçue en bon état'
    },
    {
      id: 'CMD004',
      date: new Date(2024, 2, 5, 11, 45),
      type: 'fournisseur',
      destinataire: 'Société Laitière du Sénégal',
      produits: [
        { nom: 'Beurre 84%', quantite: 30, prix: 5200 },
        { nom: 'Oeufs frais', quantite: 15, prix: 3500 }
      ],
      total: 208500,
      statut: 'annulee',
      note: 'Annulé pour rupture de stock'
    },
    {
      id: 'CMD005',
      date: new Date(2024, 1, 20, 8, 30),
      type: 'livreur',
      destinataire: 'Omar Faye',
      produits: [
        { nom: 'Pain de campagne', quantite: 25, prix: 800 },
        { nom: 'Éclair au chocolat', quantite: 15, prix: 650 }
      ],
      total: 29750,
      statut: 'livree',
      note: ''
    },
    {
      id: 'CMD006',
      date: new Date(2024, 1, 15, 10, 0),
      type: 'fournisseur',
      destinataire: 'Société Laitière du Sénégal',
      produits: [
        { nom: 'Beurre 84%', quantite: 20, prix: 5200 }
      ],
      total: 104000,
      statut: 'validee',
      note: ''
    },
    {
      id: 'CMD007',
      date: new Date(2024, 0, 25, 9, 0),
      type: 'livreur',
      destinataire: 'Babacar Diouf',
      produits: [
        { nom: 'Baguette tradition', quantite: 30, prix: 500 }
      ],
      total: 15000,
      statut: 'en_attente',
      note: ''
    },
    {
      id: 'CMD008',
      date: new Date(2023, 11, 10, 14, 0),
      type: 'fournisseur',
      destinataire: 'Grands Moulins de Dakar',
      produits: [
        { nom: 'Farine T55', quantite: 200, prix: 600 }
      ],
      total: 120000,
      statut: 'livree',
      note: ''
    }
  ]);

  anneesDisponibles = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 2023; i--) years.push(i.toString());
    return years;
  });

  moisDisponibles = [
    { value: 'tous', label: 'Tous' },
    { value: '1', label: 'Janvier' }, { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' }, { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' }, { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' }, { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' }, { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' }, { value: '12', label: 'Décembre' }
  ];

  statutsDisponibles = [
    { value: 'tous', label: 'Tous' },
    { value: 'en_attente', label: '⏳ En attente' },
    { value: 'validee', label: '✓ Validée' },
    { value: 'livree', label: '✅ Livrée' },
    { value: 'annulee', label: '❌ Annulée' }
  ];

  typesDisponibles = [
    { value: 'tous', label: 'Tous' },
    { value: 'livreur', label: '🏍️ Livreur' },
    { value: 'fournisseur', label: '🏭 Fournisseur' }
  ];

  commandesFiltrees = computed(() => {
    let result = this.allCommandes();

    const numero = this.filtreNumero().toLowerCase();
    if (numero) result = result.filter(c => c.id.toLowerCase().includes(numero));

    if (this.filtreStatut() !== 'tous') {
      result = result.filter(c => c.statut === this.filtreStatut());
    }

    if (this.filtreType() !== 'tous') {
      result = result.filter(c => c.type === this.filtreType());
    }

    if (this.filtreAnnee() !== 'toutes') {
      result = result.filter(c => c.date.getFullYear().toString() === this.filtreAnnee());
    }

    if (this.filtreMois() !== 'tous' && this.filtreAnnee() !== 'toutes') {
      result = result.filter(c => (c.date.getMonth() + 1).toString() === this.filtreMois());
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  totalAffiche = computed(() => {
    return this.commandesPaginees().reduce((sum, cmd) => sum + cmd.total, 0);
  });

  totalPages = computed(() => {
    return Math.ceil(this.commandesFiltrees().length / this.itemsPerPage());
  });

  commandesPaginees = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.commandesFiltrees().slice(start, start + this.itemsPerPage());
  });

  constructor() {
    effect(() => {
      this.filtreNumero();
      this.filtreStatut();
      this.filtreType();
      this.filtreMois();
      this.filtreAnnee();
      this.itemsPerPage();
      this.currentPage.set(1);
    });
  }

  ngAfterViewInit() {
    // Force le recalcule de la hauteur
    setTimeout(() => {
      if (this.tableContainer) {
        const container = this.tableContainer.nativeElement;
        container.style.maxHeight = '100%';
      }
    });
  }

  resetFiltres(): void {
    this.filtreNumero.set('');
    this.filtreStatut.set('tous');
    this.filtreType.set('tous');
    this.filtreMois.set('tous');
    this.filtreAnnee.set('toutes');
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
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
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) range.push(i);
    if (current - delta > 2) range.unshift(-1);
    if (current + delta < total - 1) range.push(-1);
    range.unshift(1);
    if (total !== 1) range.push(total);
    return range;
  }

  voirDetails(commande: HistoriqueCommande): void {
    this.selectedCommande.set(commande);
    this.showDetailsModal.set(true);
  }

  fermerModal(): void {
    this.showDetailsModal.set(false);
    this.selectedCommande.set(null);
  }

  imprimerPDF(): void {
    const commande = this.selectedCommande();
    if (!commande) return;
    alert('Impression PDF - Fonctionnalité à implémenter');
  }

  exporterExcel(): void {
    const commandes = this.commandesPaginees();
    if (commandes.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }
    alert(`Export Excel de ${commandes.length} commandes`);
  }

  exporterPDF(): void {
    const commandes = this.commandesPaginees();
    if (commandes.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }
    alert(`Export PDF de ${commandes.length} commandes`);
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
    return type === 'livreur' ? { label: 'Livreur', icon: '🏍️' } : { label: 'Fournisseur', icon: '🏭' };
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  formatDateLong(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  formatCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  retourListeCommandes(): void {
    this.router.navigate(['/gerant/commandes']);
  }


}