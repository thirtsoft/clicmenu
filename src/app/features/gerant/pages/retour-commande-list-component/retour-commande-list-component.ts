
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-retour-commande-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './retour-commande-list-component.html',
  styleUrl: './retour-commande-list-component.css',
})
export class RetourCommandeListComponent {


  protected readonly Math = Math;
  readonly router = inject(Router);

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


  PasserUnRetour() {
    this.router.navigate(['/gerant/enregistrer-un-retour']);
  }

}


