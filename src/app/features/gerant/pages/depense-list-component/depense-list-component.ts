
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Livraison, Production } from '../../../../core/models';
import { DataService } from '../../../../shared/data.service';

type Vue = 'apercu' | 'livreurs' | 'livraisons' | 'production' | 'ventes' | 'commandes';

export interface Livreur {
  id: string; nom: string; prenom: string; telephone: string;
  zone: string; statut: 'actif' | 'en_conge' | 'inactif';
  commandesToday: number; montantToday: number;
  moto: string; dateEmbauche: string;
}


@Component({
  selector: 'app-depense-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './depense-list-component.html',
  styleUrl: './depense-list-component.css',
})
export class DepenseListComponent {

  protected readonly Math = Math;
  readonly router = inject(Router);

  ds = inject(DataService);

  vue = signal<Vue>('commandes');


  naviguer(id: Vue) {
    this.vue.set(id);
  }

  livsTerminees = computed(() => this.ds.livraisons.filter(l => l.statut === 'livre').length);
  livsEnCours = computed(() => this.ds.livraisons.filter(l => l.statut === 'en_cours').length);
  livsEnRetard = computed(() => this.ds.livraisons.filter(l => l.statut === 'en_retard').length);

  livraisonSel = signal<Livraison | null>(null);

  statLiv(l: Livraison) {
    const m: Record<string, { label: string; cls: string }> = {
      en_cours: { label: 'En cours', cls: 'warning' },
      livre: { label: 'Livré', cls: 'success' },
      en_retard: { label: 'En retard', cls: 'danger' },
    };
    return m[l.statut] ?? { label: l.statut, cls: 'info' };
  }


  pctProd(p: Production) { return Math.round(p.quantiteRealisee / p.quantitePlanifiee * 100); }
  selLiv(l: Livraison) { this.livraisonSel.set(this.livraisonSel()?.id === l.id ? null : l); }
  fmtCFA(n: number) { return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'; }


  PasserUneCommande() {
    this.router.navigate(['/gerant/passser-une-commande']);
  }

}


