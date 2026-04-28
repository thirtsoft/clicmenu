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
    // Simulation de données - à remplacer par vos vraies données
    return [
      { nom: 'Baguette tradition', quantite: 245, montant: 122500, evolution: +12 },
      { nom: 'Croissant', quantite: 180, montant: 90000, evolution: +8 },
      { nom: 'Pain complet', quantite: 120, montant: 84000, evolution: -3 },
      { nom: 'Baguette aux céréales', quantite: 95, montant: 66500, evolution: +15 },
      { nom: 'Pain de mie', quantite: 82, montant: 57400, evolution: +5 },
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