
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Livraison, Production } from '../../../../core/models';
import { DataService } from '../../../../shared/data.service';


type Vue = 'apercu' | 'livreurs' | 'livraisons' | 'production' | 'ventes';

export interface Livreur {
  id: string; nom: string; prenom: string; telephone: string;
  zone: string; statut: 'actif' | 'en_conge' | 'inactif';
  commandesToday: number; montantToday: number;
  moto: string; dateEmbauche: string;
}

@Component({
  selector: 'app-livraison-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livraison-list-component.html',
  styleUrl: './livraison-list-component.css',
})
export class LivraisonListComponent {

  protected readonly Math = Math;
  ds = inject(DataService);

  vue = signal<Vue>('livraisons');


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


}

