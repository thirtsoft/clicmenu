import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type PeriodeRapport = 'jour' | 'semaine' | 'mois' | 'trimestre' | 'annee';
type TypeRapport = 'ventes' | 'finances' | 'performance' | 'stocks';

interface RapportGenere {
  id: string;
  titre: string;
  type: TypeRapport;
  dateGeneration: string;
  periode: string;
  format: 'PDF' | 'Excel' | 'CSV';
  taille: string;
  icone: string;
}

interface IndicateurPerformance {
  nom: string;
  icone: string;
  valeur: string;
  evolution: number;
  tendance: 'hausse' | 'baisse' | 'stable';
  objectif: string;
  tauxAtteinte: number;
}

interface VenteParHeure {
  heure: string;
  ventes: number;
  commandes: number;
}

interface TopProduit {
  nom: string;
  icone: string;
  categorie: string;
  ventes: number;
  montant: number;
  evolution: number;
}

interface ComparaisonPeriode {
  indicateur: string;
  icone: string;
  periodeActuelle: number;
  periodePrecedente: number;
  evolution: number;
}

@Component({
  selector: 'app-rapport-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rapport-list-component.html',
  styleUrl: './rapport-list-component.css',
})
export class RapportListComponent {

  protected readonly Math = Math;

  // ── Filtres ────────────────────────────────────────
  periode = signal<PeriodeRapport>('mois');
  typeRapport = signal<TypeRapport>('ventes');

  // ── Indicateurs de performance ────────────────────
  indicateurs = signal<IndicateurPerformance[]>([
    {
      nom: 'Chiffre d\'affaires', icone: '💰',
      valeur: '4 850 000 FCFA', evolution: 12.5, tendance: 'hausse',
      objectif: '5 000 000 FCFA', tauxAtteinte: 97
    },
    {
      nom: 'Nombre de couverts', icone: '👥',
      valeur: '1 240', evolution: 8.3, tendance: 'hausse',
      objectif: '1 500', tauxAtteinte: 83
    },
    {
      nom: 'Panier moyen', icone: '🛒',
      valeur: '3 900 FCFA', evolution: -2.1, tendance: 'baisse',
      objectif: '4 500 FCFA', tauxAtteinte: 87
    },
    {
      nom: 'Taux d\'occupation', icone: '🪑',
      valeur: '72%', evolution: 5.0, tendance: 'hausse',
      objectif: '80%', tauxAtteinte: 90
    },
    {
      nom: 'Marge brute', icone: '📊',
      valeur: '55.7%', evolution: 1.8, tendance: 'hausse',
      objectif: '60%', tauxAtteinte: 93
    },
    {
      nom: 'Commandes jour', icone: '📋',
      valeur: '42', evolution: 15.2, tendance: 'hausse',
      objectif: '50', tauxAtteinte: 84
    },
  ]);

  // ── Ventes par heure ──────────────────────────────
  ventesParHeure = signal<VenteParHeure[]>([
    { heure: '08h', ventes: 15000, commandes: 2 },
    { heure: '09h', ventes: 28000, commandes: 4 },
    { heure: '10h', ventes: 45000, commandes: 6 },
    { heure: '11h', ventes: 85000, commandes: 10 },
    { heure: '12h', ventes: 145000, commandes: 18 },
    { heure: '13h', ventes: 168000, commandes: 20 },
    { heure: '14h', ventes: 95000, commandes: 12 },
    { heure: '15h', ventes: 35000, commandes: 5 },
    { heure: '16h', ventes: 18000, commandes: 3 },
    { heure: '17h', ventes: 12000, commandes: 2 },
    { heure: '18h', ventes: 25000, commandes: 4 },
    { heure: '19h', ventes: 85000, commandes: 10 },
    { heure: '20h', ventes: 125000, commandes: 15 },
    { heure: '21h', ventes: 98000, commandes: 12 },
    { heure: '22h', ventes: 45000, commandes: 6 },
    { heure: '23h', ventes: 18000, commandes: 3 },
  ]);

  // ── Top produits ──────────────────────────────────
  topProduits = signal<TopProduit[]>([
    { nom: 'Poulet Yassa', icone: '🍗', categorie: 'Plats', ventes: 125, montant: 437500, evolution: 15 },
    { nom: 'Thieboudienne', icone: '🍚', categorie: 'Plats', ventes: 98, montant: 392000, evolution: 8 },
    { nom: 'Nems Poulet', icone: '🥟', categorie: 'Entrées', ventes: 210, montant: 420000, evolution: 22 },
    { nom: 'Jus Bissap', icone: '🍷', categorie: 'Boissons', ventes: 350, montant: 280000, evolution: 30 },
    { nom: 'Mafé Poulet', icone: '🍛', categorie: 'Plats', ventes: 85, montant: 297500, evolution: -5 },
    { nom: 'Tiramisu', icone: '🍰', categorie: 'Desserts', ventes: 145, montant: 290000, evolution: 12 },
    { nom: 'Salade César', icone: '🥗', categorie: 'Entrées', ventes: 180, montant: 450000, evolution: 18 },
    { nom: 'Poisson Grillé', icone: '🐟', categorie: 'Plats', ventes: 65, montant: 292500, evolution: -10 },
  ]);

  // ── Comparaison périodes ──────────────────────────
  comparaison = signal<ComparaisonPeriode[]>([
    { indicateur: 'CA Ventes', icone: '💰', periodeActuelle: 4850000, periodePrecedente: 4200000, evolution: 15.5 },
    { indicateur: 'Nombre clients', icone: '👥', periodeActuelle: 1240, periodePrecedente: 1100, evolution: 12.7 },
    { indicateur: 'Commandes', icone: '📋', periodeActuelle: 890, periodePrecedente: 780, evolution: 14.1 },
    { indicateur: 'Dépenses', icone: '📤', periodeActuelle: 2150000, periodePrecedente: 1980000, evolution: 8.6 },
    { indicateur: 'Bénéfice', icone: '📈', periodeActuelle: 2700000, periodePrecedente: 2220000, evolution: 21.6 },
  ]);

  // ── Rapports générés ──────────────────────────────
  rapports = signal<RapportGenere[]>([
    { id: 'R1', titre: 'Rapport ventes quotidien', type: 'ventes', dateGeneration: '28/04/2026 22:00', periode: '28/04/2026', format: 'PDF', taille: '245 KB', icone: '📄' },
    { id: 'R2', titre: 'Rapport financier mensuel', type: 'finances', dateGeneration: '01/05/2026 08:00', periode: 'Avril 2026', format: 'Excel', taille: '1.2 MB', icone: '📊' },
    { id: 'R3', titre: 'Performance du personnel', type: 'performance', dateGeneration: '01/05/2026 09:00', periode: 'Avril 2026', format: 'PDF', taille: '380 KB', icone: '👥' },
    { id: 'R4', titre: 'État des stocks', type: 'stocks', dateGeneration: '28/04/2026 20:00', periode: '28/04/2026', format: 'CSV', taille: '125 KB', icone: '📦' },
    { id: 'R5', titre: 'Rapport ventes hebdo', type: 'ventes', dateGeneration: '27/04/2026 22:00', periode: 'Semaine 17', format: 'PDF', taille: '410 KB', icone: '📄' },
  ]);

  // ── Computed ───────────────────────────────────────
  ventesMax = computed(() =>
    Math.max(...this.ventesParHeure().map(v => v.ventes))
  );

  rapportsFiltres = computed(() => {
    if (this.typeRapport() === 'ventes') {
      return this.rapports().filter(r => r.type === this.typeRapport());
    }
    return this.rapports();
  });

  topVentes = computed(() =>
    Math.max(...this.topProduits().map(p => p.ventes))
  );

  topMontant = computed(() =>
    Math.max(...this.topProduits().map(p => p.montant))
  );

  // ── Méthodes ───────────────────────────────────────
  setPeriode(p: PeriodeRapport) { this.periode.set(p); }
  setTypeRapport(type: TypeRapport) { this.typeRapport.set(type); }

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

  getEvolutionCls(evolution: number): string {
    if (evolution > 0) return 'success';
    if (evolution < 0) return 'danger';
    return 'info';
  }

  getEvolutionIco(evolution: number): string {
    if (evolution > 0) return '↑';
    if (evolution < 0) return '↓';
    return '→';
  }

  getTauxCls(taux: number): string {
    return taux >= 100 ? 'success' : taux >= 80 ? 'warning' : 'danger';
  }

  getFormatIco(format: string): string {
    const icons: Record<string, string> = {
      'PDF': '📄',
      'Excel': '📊',
      'CSV': '📋'
    };
    return icons[format] || '📁';
  }

  getTypeRapportIco(type: TypeRapport): string {
    const icons: Record<string, string> = {
      ventes: '💰',
      finances: '📈',
      performance: '👥',
      stocks: '📦'
    };
    return icons[type] || '📄';
  }

  telechargerRapport(rapport: RapportGenere): void {
    console.log('Téléchargement du rapport:', rapport.titre);
    // Logique de téléchargement
  }

  genererRapport(): void {
    console.log('Génération d\'un nouveau rapport...');
    // Logique de génération
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

  formatNombre(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n);
  }
}
