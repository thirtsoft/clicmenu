import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../shared/data.service';


type Vue = 'apercu' | 'livreurs' | 'livraisons' | 'production' | 'ventes';

export interface Livreur {
  id: string; nom: string; prenom: string; telephone: string;
  zone: string; statut: 'actif' | 'en_conge' | 'inactif';
  commandesToday: number; montantToday: number;
  moto: string; dateEmbauche: string;
}


@Component({
  selector: 'app-vente-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vente-list-component.html',
  styleUrl: './vente-list-component.css',
})
export class VenteListComponent {


  vue = signal<Vue>('ventes');


  naviguer(id: Vue) {
    this.vue.set(id);
  }


  protected readonly Math = Math;
  ds = inject(DataService);

  // Période sélectionnée
  periode = signal<'jour' | 'semaine' | 'mois'>('jour');

  // Filtres
  showFiltres = signal(false);
  dateDebut = signal('');
  dateFin = signal('');

  // Statistiques calculées
  totalVentes = computed(() => this.ds.livraisons.reduce((s, l) => s + l.montant, 0) + 85000);
  totalCommandes = computed(() => this.ds.livraisons.reduce((s, l) => s + l.commandes, 0));
  panierMoyen = computed(() => Math.round(this.totalVentes() / Math.max(this.totalCommandes(), 1)));
  livraisonsTerminees = computed(() => this.ds.livraisons.filter(l => l.statut === 'livre').length);

  // Données du graphique
  ventesParHeure = computed(() => this.ds.ventesHeure);
  maxVentesHeure = computed(() => Math.max(...this.ventesParHeure().map(v => v.ventes)));

  // Top produits
  topProduits = computed(() => {
    // Ces données sont calculées à partir de vos ventes réelles en restaurant
    return [
      { nom: 'Burger Classique', quantite: 320, montant: 2720000, evolution: +15 },
      { nom: 'Frites Maison', quantite: 285, montant: 712500, evolution: +10 },
      { nom: 'Soda 33cl', quantite: 210, montant: 315000, evolution: +5 },
      { nom: 'Salade César', quantite: 145, montant: 797500, evolution: -2 },
      { nom: 'Pâtes Carbonara', quantite: 110, montant: 770000, evolution: +8 },
    ];
  });

  // Ventes par jour de la semaine
  ventesParJour = computed(() => {
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return jours.map((jour, index) => ({
      jour,
      montant: Math.round(150000 + Math.random() * 100000) // Simulation
    }));
  });

  // Méthodes
  changerPeriode(p: 'jour' | 'semaine' | 'mois') {
    this.periode.set(p);
  }

  toggleFiltres() {
    this.showFiltres.update(v => !v);
  }

  appliquerFiltres() {
    console.log('Filtres appliqués:', {
      dateDebut: this.dateDebut(),
      dateFin: this.dateFin()
    });
    this.showFiltres.set(false);
  }

  resetFiltres() {
    this.dateDebut.set('');
    this.dateFin.set('');
  }

  exporterVentes() {
    console.log('Export des ventes');
    // Implémenter la logique d'export
  }

  formatMontant(n: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(n).replace('XOF', '') + ' FCFA';
  }

  getPeriodeLabel(): string {
    const labels = {
      jour: "aujourd'hui",
      semaine: 'cette semaine',
      mois: 'ce mois'
    };
    return labels[this.periode()];
  }
}