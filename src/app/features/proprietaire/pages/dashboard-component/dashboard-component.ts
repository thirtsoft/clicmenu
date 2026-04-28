import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DataService } from '../../../../shared/data.service';
import { KpiCardComponent } from '../../components/shared/kpi-card-component/kpi-card-component';
import { Periode, PeriodeSelectorComponent } from '../../components/shared/periode-selector-component/periode-selector-component';
import { BoulangerieService } from '../../services/boulangerie.service';
import { GerantService } from '../../services/gerant.service';
import { InvestissementService } from '../../services/investissement.service';


type PeriodeType = 'jour' | 'semaine' | 'mois';

interface StatsRestaurant {
  ventesJour: number;
  commandesJour: number;
  clientsJour: number;
  panierMoyen: number;
  tablesOccupees: number;
  tauxOccupation: number;
  tendance: 'hausse' | 'baisse' | 'stable';
  evolution: number;
}

interface PerformanceSection {
  nom: string;
  icone: string;
  ventesJour: number;
  objectifJour: number;
  taux: number;
  tendance: string;
  items?: number;
}

interface TopPlat {
  nom: string;
  icone: string;
  ventes: number;
  montant: number;
  quantite: number;
}

interface AlerteStock {
  nom: string;
  icone: string;
  quantite: number;
  seuil: number;
}

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule, KpiCardComponent, PeriodeSelectorComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {

  private boulangerieService = inject(BoulangerieService);
  private gerantService = inject(GerantService);
  private investissementService = inject(InvestissementService);
  private dataService = inject(DataService);

  periode = signal<Periode>('jour');
  protected readonly Math = Math;

  // Données - on garde les signaux
  readonly boulangeries = this.boulangerieService.boulangeries;
  readonly statsBoulangeries = this.boulangerieService.getStats();
  readonly statsGerants = this.gerantService.stats; // C'est un Signal<GerantStats>
  readonly statsInvestissements = this.investissementService.stats; // C'est un Signal<InvestissementStats>
  readonly ventesHebdo = this.dataService.ventesHebdo;

  // Computed
  readonly ventesMaxHebdo = () => Math.max(...this.ventesHebdo.map(v => v.ventes));
  readonly getMaxVenteBoulangerie = () => Math.max(...this.boulangeries().map(b => b.objectifJour));

  // ── Stats principales ────────────────────────────
  stats = signal<StatsRestaurant>({
    ventesJour: 458000,
    commandesJour: 42,
    clientsJour: 68,
    panierMoyen: 6750,
    tablesOccupees: 6,
    tauxOccupation: 75,
    tendance: 'hausse',
    evolution: 12.5
  });

  // ── Performance par section ──────────────────────
  sections = signal<PerformanceSection[]>([
    { nom: 'Salle', icone: '🪑', ventesJour: 245000, objectifJour: 300000, taux: 82, tendance: 'hausse', items: 28 },
    { nom: 'Terrasse', icone: '🌿', ventesJour: 138000, objectifJour: 150000, taux: 92, tendance: 'stable', items: 14 },
    { nom: 'VIP', icone: '⭐', ventesJour: 75000, objectifJour: 50000, taux: 150, tendance: 'hausse', items: 6 },
  ]);

  // ── Top plats du jour ────────────────────────────
  topPlats = signal<TopPlat[]>([
    { nom: 'Poulet Yassa', icone: '🍗', ventes: 12, montant: 42000, quantite: 15 },
    { nom: 'Thieboudienne', icone: '🍚', ventes: 10, montant: 40000, quantite: 10 },
    { nom: 'Nems Poulet', icone: '🥟', ventes: 8, montant: 16000, quantite: 20 },
    { nom: 'Jus Bissap', icone: '🍷', ventes: 7, montant: 5600, quantite: 25 },
  ]);

  // ── Alertes stock ────────────────────────────────
  alertesStock = signal<AlerteStock[]>([
    { nom: 'Huile végétale', icone: '🫒', quantite: 0, seuil: 5 },
    { nom: 'Beurre', icone: '🧈', quantite: 3, seuil: 5 },
    { nom: 'Tomates', icone: '🍅', quantite: 5, seuil: 10 },
  ]);


  // ── Ventes de la semaine ─────────────────────────
  ventesSemaine = signal([
    { jour: 'Lun', ventes: 380000 },
    { jour: 'Mar', ventes: 420000 },
    { jour: 'Mer', ventes: 395000 },
    { jour: 'Jeu', ventes: 458000 },
    { jour: 'Ven', ventes: 520000 },
    { jour: 'Sam', ventes: 610000 },
    { jour: 'Dim', jours: 'Auj', ventes: 245000 },
  ]);


  // ── Commandes récentes ───────────────────────────
  commandesRecent = signal([
    { table: 'Table 1', serveur: 'Aminata', plats: 3, montant: 12500, temps: '5 min', statut: 'En cours' },
    { table: 'Table 3', serveur: 'Moussa', plats: 2, montant: 8000, temps: '12 min', statut: 'Prêt' },
    { table: 'VIP 1', serveur: 'Fatou', plats: 4, montant: 18500, temps: '3 min', statut: 'En cours' },
    { table: 'Table 4', serveur: 'Aminata', plats: 1, montant: 2000, temps: '20 min', statut: 'Servi' },
  ]);

  // ── Computed ─────────────────────────────────────
  readonly ventesMax = () => Math.max(...this.ventesSemaine().map(v => v.ventes));

  readonly totalPlatsVendus = () => this.topPlats().reduce((s, p) => s + p.quantite, 0);

  // ── Méthodes utilitaires ─────────────────────────
  getTauxCls(taux: number): string {
    return taux >= 100 ? 'success' : taux >= 75 ? 'warning' : 'danger';
  }

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

  getStatutCommandeCls(statut: string): string {
    const classes: Record<string, string> = {
      'En cours': 'warning',
      'Prêt': 'success',
      'Servi': 'info',
      'En attente': 'danger'
    };
    return classes[statut] || 'info';
  }

  formatCFA(n: number): string {
    return n >= 1_000_000
      ? (n / 1_000_000).toFixed(1) + 'M FCFA'
      : n >= 1_000
        ? (n / 1_000).toFixed(0) + 'k FCFA'
        : n + ' FCFA';
  }

  formatCFAFull(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  onPeriodeChange(periode: Periode): void {
    console.log('Période changée:', periode);
    // Charger les données selon la période
  }

}
