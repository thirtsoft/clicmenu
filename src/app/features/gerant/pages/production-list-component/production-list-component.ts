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
  selector: 'app-production-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-list-component.html',
  styleUrl: './production-list-component.css',
})
export class ProductionListComponent {

  protected readonly Math = Math;
  ds = inject(DataService);

  vue = signal<Vue>('production');

  showFormProduction = signal(false);

  naviguer(id: Vue) {
    this.vue.set(id);
  }

  prodsEnCours = computed(() => this.ds.productions.filter(p => p.statut === 'en_cours').length);


  livraisonSel = signal<Livraison | null>(null);

  statProd(p: Production) {
    const m: Record<string, { label: string; cls: string }> = {
      planifie: { label: 'Planifié', cls: 'info' },
      en_cours: { label: 'En cours', cls: 'warning' },
      termine: { label: 'Terminé', cls: 'success' },
      probleme: { label: 'Problème', cls: 'danger' },
    };
    return m[p.statut] ?? { label: p.statut, cls: 'info' };
  }

  pctProd(p: Production) { return Math.round(p.quantiteRealisee / p.quantitePlanifiee * 100); }

  newProduction = signal({ libelle: '', quantite: '', employees: '', description: '', dateEmbauche: '' });
  employees = ['Moussa Thiaw', 'Ibrahima Sow', 'Omar Faye', 'Cheikh Ndiaye', 'Babacar Diouf', 'Souley Diallo', 'Khady Diallo', 'Fatim Baary'];


  ajouterProduction() {
    const d = this.newProduction();
    if (!d.libelle || !d.quantite || !d.description || !d.employees) return;

    this.showFormProduction.set(false);
    this.newProduction.set({ libelle: '', quantite: '', employees: '', description: '', dateEmbauche: '' });
  }

  setLibelle(v: string) { this.newProduction.update(n => ({ ...n, prenom: v })); }
  setQuantite(v: string) { this.newProduction.update(n => ({ ...n, nom: v })); }
  setDescription(v: string) { this.newProduction.update(n => ({ ...n, telephone: v })); }
  setEmployees(v: string) { this.newProduction.update(n => ({ ...n, zone: v })); }
  setNouveauMoto(v: string) { this.newProduction.update(n => ({ ...n, moto: v })); }
  setDateProduction(v: string) { this.newProduction.update(n => ({ ...n, dateEmbauche: v })); }

}
