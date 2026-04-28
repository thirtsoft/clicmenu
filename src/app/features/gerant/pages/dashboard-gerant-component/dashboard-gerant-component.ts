import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../../../shared/data.service';
import { Livraison, Production } from '../../../../core/models';

@Component({
  selector: 'app-dashboard-gerant-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-gerant-component.html',
  styleUrl: './dashboard-gerant-component.css',
})
export class DashboardGerantComponent {


  ds = inject(DataService);
  constructor(private router: Router) { }

  // ── KPIs ──────────────────────────────────────────────
  kpis = computed(() => [
    { label: 'Chiffre du jour', val: this.fmtCFA(this.totalVentes()), ico: '💰', var: +12, cls: 'rose' },
    { label: 'Livraisons terminées', val: `${this.livsTerminees()}/${this.ds.livraisons.length}`, ico: '🚚', var: +5, cls: 'vert' },
    { label: 'Production en cours', val: `${this.prodsEnCours()} lignes`, ico: '🏭', var: 0, cls: 'or' },
    { label: 'Stock critique', val: `${this.stockCrit()} produits`, ico: '⚠️', var: -2, cls: 'rouge' },
  ]);

  totalVentes = computed(() => this.ds.livraisons.reduce((s, l) => s + l.montant, 0) + 85000);
  livsTerminees = computed(() => this.ds.livraisons.filter(l => l.statut === 'livre').length);
  prodsEnCours = computed(() => this.ds.productions.filter(p => p.statut === 'en_cours').length);
  stockCrit = computed(() => this.ds.produits.filter(p => p.stock < 10).length);

  maxVentes(): number {
    return Math.max(...this.ds.ventesHeure.map(v => v.ventes));
  }

  barHeight(ventes: number): number {
    return Math.round((ventes / this.maxVentes()) * 100);
  }

  // ── Statuts ────────────────────────────────────────────
  statLiv(l: Livraison): { label: string; cls: string } {
    const m: Record<string, { label: string; cls: string }> = {
      en_cours: { label: 'En cours', cls: 'warning' },
      livre: { label: 'Livré', cls: 'success' },
      en_retard: { label: 'En retard', cls: 'danger' },
    };
    return m[l.statut] ?? { label: l.statut, cls: 'info' };
  }

  statProd(p: Production): { label: string; cls: string } {
    const m: Record<string, { label: string; cls: string }> = {
      planifie: { label: 'Planifié', cls: 'info' },
      en_cours: { label: 'En cours', cls: 'warning' },
      termine: { label: 'Terminé', cls: 'success' },
      probleme: { label: 'Problème', cls: 'danger' },
    };
    return m[p.statut] ?? { label: p.statut, cls: 'info' };
  }

  pctProd(p: Production): number {
    return Math.round((p.quantiteRealisee / p.quantitePlanifiee) * 100);
  }

  voirProduction(): void {
    this.router.navigate(['/gerant/production']);
  }

  fmtCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  fmtK(n: number): string {
    return (n / 1000).toFixed(0) + 'k';
  }
}

