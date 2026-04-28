import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Periode = 'jour' | 'semaine' | 'mois' | 'annee';
type TypeTransaction = 'tous' | 'recette' | 'depense';

interface Transaction {
  id: string;
  date: string;
  description: string;
  categorie: string;
  type: 'recette' | 'depense';
  montant: number;
  modePaiement: string;
  reference: string;
}

interface ResumeFinancier {
  chiffreAffaires: number;
  depenses: number;
  benefice: number;
  marge: number;
  evolution: number;
  tendance: 'hausse' | 'baisse' | 'stable';
}

interface DepenseCategorie {
  categorie: string;
  icone: string;
  montant: number;
  pourcentage: number;
  budget: number;
}

interface RecetteCategorie {
  categorie: string;
  icone: string;
  montant: number;
  pourcentage: number;
}

@Component({
  selector: 'app-finances-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finances-list-component.html',
  styleUrl: './finances-list-component.css',

})
export class FinancesListComponent {

  protected readonly Math = Math;

  // ── Filtres ────────────────────────────────────────
  periode = signal<Periode>('mois');
  filtreType = signal<TypeTransaction>('tous');
  searchTransaction = signal('');

  // ── Résumé financier ──────────────────────────────
  resume = signal<ResumeFinancier>({
    chiffreAffaires: 4850000,
    depenses: 2150000,
    benefice: 2700000,
    marge: 55.7,
    evolution: 12.5,
    tendance: 'hausse'
  });

  // ── Transactions ───────────────────────────────────
  transactions = signal<Transaction[]>([
    { id: 'T1', date: '28/04/2026', description: 'Ventes restaurant - Service midi', categorie: 'Ventes salle', type: 'recette', montant: 245000, modePaiement: 'Espèces', reference: 'VEN-20260428-001' },
    { id: 'T2', date: '28/04/2026', description: 'Ventes restaurant - Service soir', categorie: 'Ventes salle', type: 'recette', montant: 213000, modePaiement: 'Mixte', reference: 'VEN-20260428-002' },
    { id: 'T3', date: '28/04/2026', description: 'Achat produits frais - Marché central', categorie: 'Matières premières', type: 'depense', montant: 85000, modePaiement: 'Espèces', reference: 'DEP-20260428-001' },
    { id: 'T4', date: '28/04/2026', description: 'Paiement électricité SENELEC', categorie: 'Énergie', type: 'depense', montant: 45000, modePaiement: 'Mobile', reference: 'DEP-20260428-002' },
    { id: 'T5', date: '27/04/2026', description: 'Ventes restaurant - Service midi', categorie: 'Ventes salle', type: 'recette', montant: 198000, modePaiement: 'Mixte', reference: 'VEN-20260427-001' },
    { id: 'T6', date: '27/04/2026', description: 'Ventes restaurant - Service soir', categorie: 'Ventes salle', type: 'recette', montant: 260000, modePaiement: 'Mixte', reference: 'VEN-20260427-002' },
    { id: 'T7', date: '27/04/2026', description: 'Salaire personnel - Avril 2026', categorie: 'Salaires', type: 'depense', montant: 680000, modePaiement: 'Virement', reference: 'SAL-202604-001' },
    { id: 'T8', date: '27/04/2026', description: 'Achat boissons - Grossiste', categorie: 'Matières premières', type: 'depense', montant: 120000, modePaiement: 'Carte', reference: 'DEP-20260427-003' },
    { id: 'T9', date: '26/04/2026', description: 'Location terrasse événement', categorie: 'Événements', type: 'recette', montant: 150000, modePaiement: 'Virement', reference: 'EVT-20260426-001' },
    { id: 'T10', date: '26/04/2026', description: 'Maintenance climatisation', categorie: 'Maintenance', type: 'depense', montant: 35000, modePaiement: 'Espèces', reference: 'DEP-20260426-004' },
    { id: 'T11', date: '25/04/2026', description: 'Achat vaisselle et couverts', categorie: 'Équipement', type: 'depense', montant: 75000, modePaiement: 'Carte', reference: 'DEP-20260425-005' },
    { id: 'T12', date: '25/04/2026', description: 'Ventes restaurant - Service midi', categorie: 'Ventes salle', type: 'recette', montant: 175000, modePaiement: 'Espèces', reference: 'VEN-20260425-001' },
  ]);

  // ── Dépenses par catégorie ────────────────────────
  depensesCategories = signal<DepenseCategorie[]>([
    { categorie: 'Matières premières', icone: '🥬', montant: 520000, pourcentage: 24, budget: 600000 },
    { categorie: 'Salaires', icone: '👥', montant: 680000, pourcentage: 32, budget: 700000 },
    { categorie: 'Énergie', icone: '⚡', montant: 145000, pourcentage: 7, budget: 150000 },
    { categorie: 'Maintenance', icone: '🔧', montant: 95000, pourcentage: 4, budget: 100000 },
    { categorie: 'Équipement', icone: '🍽️', montant: 125000, pourcentage: 6, budget: 200000 },
    { categorie: 'Marketing', icone: '📢', montant: 45000, pourcentage: 2, budget: 80000 },
    { categorie: 'Divers', icone: '📦', montant: 540000, pourcentage: 25, budget: 500000 },
  ]);

  // ── Recettes par catégorie ────────────────────────
  recettesCategories = signal<RecetteCategorie[]>([
    { categorie: 'Ventes salle', icone: '🪑', montant: 3980000, pourcentage: 82 },
    { categorie: 'Ventes terrasse', icone: '🌿', montant: 520000, pourcentage: 11 },
    { categorie: 'Événements', icone: '🎉', montant: 250000, pourcentage: 5 },
    { categorie: 'Traiteur', icone: '📦', montant: 100000, pourcentage: 2 },
  ]);

  // ── Flux de trésorerie (30 derniers jours) ────────
  fluxTresorerie = signal([
    { jour: '01/04', recettes: 158000, depenses: 45000 },
    { jour: '05/04', recettes: 182000, depenses: 120000 },
    { jour: '10/04', recettes: 210000, depenses: 68000 },
    { jour: '15/04', recettes: 245000, depenses: 85000 },
    { jour: '20/04', recettes: 198000, depenses: 720000 },
    { jour: '25/04', recettes: 260000, depenses: 95000 },
    { jour: '28/04', recettes: 458000, depenses: 130000 },
  ]);

  // ── Computed ───────────────────────────────────────
  totalRecettes = computed(() => 
    this.transactions()
      .filter(t => t.type === 'recette')
      .reduce((s, t) => s + t.montant, 0)
  );

  totalDepenses = computed(() => 
    this.transactions()
      .filter(t => t.type === 'depense')
      .reduce((s, t) => s + t.montant, 0)
  );

  transactionsFiltrees = computed(() => {
    let list = this.transactions();
    
    if (this.filtreType() !== 'tous') {
      list = list.filter(t => t.type === this.filtreType());
    }
    
    if (this.searchTransaction()) {
      const search = this.searchTransaction().toLowerCase();
      list = list.filter(t => 
        t.description.toLowerCase().includes(search) ||
        t.categorie.toLowerCase().includes(search) ||
        t.reference.toLowerCase().includes(search)
      );
    }
    
    return list;
  });

  depensesMax = computed(() => 
    Math.max(...this.depensesCategories().map(d => d.montant))
  );

  // ── Méthodes ───────────────────────────────────────
  setPeriode(p: Periode) { this.periode.set(p); }
  setFiltreType(type: TypeTransaction) { this.filtreType.set(type); }

  getTendanceCls(tendance: string): string {
    const classes: Record<string, string> = {
      hausse: 'success',
      baisse: 'danger',
      stable: 'info'
    };
    return classes[tendance] || '';
  }

  getTendanceIco(tendance: string): string {
    const icons: Record<string, string> = {
      hausse: '↑',
      baisse: '↓',
      stable: '→'
    };
    return icons[tendance] || '';
  }

  getTypeCls(type: string): string {
    return type === 'recette' ? 'success' : 'danger';
  }

  getTypeIco(type: string): string {
    return type === 'recette' ? '📥' : '📤';
  }

  getBarColor(ratio: number): string {
    if (ratio > 1) return 'danger';
    if (ratio > 0.8) return 'warning';
    return 'success';
  }

  formatCFA(n: number): string {
    return n >= 1_000_000 
      ? (n / 1_000_000).toFixed(1) + 'M'
      : n >= 1_000 
        ? (n / 1_000).toFixed(0) + 'k'
        : n.toString();
  }

  formatCFAFull(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
