import { Component, computed, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
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
  selector: 'app-compte-agent-local-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compte-agent-local-list-component.html',
  styleUrl: './compte-agent-local-list-component.css',
})
export class CompteAgentLocalListComponent {

  protected readonly Math = Math;
  ds = inject(DataService);

  vue = signal<Vue>('livreurs');
  sidebarOpen = signal(false);
  sidebarCollapsed = signal(false);


  naviguer(id: Vue) {
    this.vue.set(id);
    this.sidebarOpen.set(false);
  }

  // ── Livreurs ─────────────────────────────────────────
  livreurs = signal<Livreur[]>([
    { id: 'L1', prenom: 'Moussa', nom: 'Thiaw', telephone: '+221 77 300 01 01', zone: 'Plateau', statut: 'actif', commandesToday: 12, montantToday: 48500, moto: 'Honda CB 125', dateEmbauche: '2021-03-10' },
    { id: 'L2', prenom: 'Ibrahima', nom: 'Sow', telephone: '+221 77 300 02 02', zone: 'Almadies', statut: 'actif', commandesToday: 9, montantToday: 36200, moto: 'Yamaha YBR', dateEmbauche: '2020-06-15' },
    { id: 'L3', prenom: 'Omar', nom: 'Faye', telephone: '+221 77 300 03 03', zone: 'Mermoz', statut: 'actif', commandesToday: 15, montantToday: 62000, moto: 'Bajaj Boxer', dateEmbauche: '2019-11-01' },
    { id: 'L4', prenom: 'Cheikh', nom: 'Ndiaye', telephone: '+221 77 300 04 04', zone: 'Ouakam', statut: 'en_conge', commandesToday: 0, montantToday: 0, moto: 'TVS Star City', dateEmbauche: '2022-01-20' },
    { id: 'L5', prenom: 'Babacar', nom: 'Diouf', telephone: '+221 77 300 05 05', zone: 'Sacré-Cœur', statut: 'actif', commandesToday: 11, montantToday: 44000, moto: 'Honda CB 150', dateEmbauche: '2021-08-05' },
  ]);

  showFormLivreur = signal(false);
  newLivreur = signal({ prenom: '', nom: '', telephone: '', zone: '', moto: '', dateEmbauche: '' });
  filtreStatut = signal<'tous' | 'actif' | 'en_conge' | 'inactif'>('tous');
  zones = ['Plateau', 'Almadies', 'Mermoz', 'Ouakam', 'Sacré-Cœur', 'Point E', 'Fann', 'Liberté'];

  livreursFiltres = computed(() => {
    const f = this.filtreStatut();
    return f === 'tous' ? this.livreurs() : this.livreurs().filter(l => l.statut === f);
  });
  totalCmdEquipe = computed(() => this.livreurs().reduce((s, l) => s + l.commandesToday, 0));
  totalMontantEquipe = computed(() => this.livreurs().reduce((s, l) => s + l.montantToday, 0));
  livreursActifs = computed(() => this.livreurs().filter(l => l.statut === 'actif').length);

  ajouterLivreur() {
    const d = this.newLivreur();
    if (!d.prenom || !d.nom || !d.telephone) return;
    this.livreurs.update(list => [...list, {
      id: 'L' + Date.now(), ...d, statut: 'actif' as const,
      commandesToday: 0, montantToday: 0
    }]);
    this.showFormLivreur.set(false);
    this.newLivreur.set({ prenom: '', nom: '', telephone: '', zone: '', moto: '', dateEmbauche: '' });
  }

  supprimerLivreur(id: string) { this.livreurs.update(l => l.filter(lr => lr.id !== id)); }

  toggleStatut(lr: Livreur) {
    const next: Record<string, 'actif' | 'en_conge' | 'inactif'> = {
      actif: 'en_conge', en_conge: 'actif', inactif: 'actif'
    };
    this.livreurs.update(list =>
      list.map(l => l.id === lr.id ? { ...l, statut: next[l.statut] } : l)
    );
  }

  setFiltreStatut(val: 'tous' | 'actif' | 'en_conge' | 'inactif') {
    this.filtreStatut.set(val);
  }

  initiales(lr: Livreur) { return (lr.prenom[0] + lr.nom[0]).toUpperCase(); }

  statLiv(l: Livraison) {
    const m: Record<string, { label: string; cls: string }> = {
      en_cours: { label: 'En cours', cls: 'warning' },
      livre: { label: 'Livré', cls: 'success' },
      en_retard: { label: 'En retard', cls: 'danger' },
    };
    return m[l.statut] ?? { label: l.statut, cls: 'info' };
  }

  statProd(p: Production) {
    const m: Record<string, { label: string; cls: string }> = {
      planifie: { label: 'Planifié', cls: 'info' },
      en_cours: { label: 'En cours', cls: 'warning' },
      termine: { label: 'Terminé', cls: 'success' },
      probleme: { label: 'Problème', cls: 'danger' },
    };
    return m[p.statut] ?? { label: p.statut, cls: 'info' };
  }

  statLivreur(s: string) {
    const m: Record<string, { label: string; cls: string }> = {
      actif: { label: 'Actif', cls: 'success' },
      en_conge: { label: 'En congé', cls: 'warning' },
      inactif: { label: 'Inactif', cls: 'danger' },
    };
    return m[s] ?? { label: s, cls: 'info' };
  }

  pctProd(p: Production) { return Math.round(p.quantiteRealisee / p.quantitePlanifiee * 100); }

  fmtCFA(n: number) { return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'; }


  // Méthodes de mise à jour du formulaire nouveau livreur
  setNouveauPrenom(v: string) { this.newLivreur.update(n => ({ ...n, prenom: v })); }
  setNouveauNom(v: string) { this.newLivreur.update(n => ({ ...n, nom: v })); }
  setNouveauTelephone(v: string) { this.newLivreur.update(n => ({ ...n, telephone: v })); }
  setNouveauZone(v: string) { this.newLivreur.update(n => ({ ...n, zone: v })); }
  setNouveauMoto(v: string) { this.newLivreur.update(n => ({ ...n, moto: v })); }
  setNouveauDateEmbauche(v: string) { this.newLivreur.update(n => ({ ...n, dateEmbauche: v })); }

}


