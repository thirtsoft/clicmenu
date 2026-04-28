import { computed, Injectable, signal } from '@angular/core';
import { Investissement, InvestissementCategorie, InvestissementStats, InvestissementStatut } from '../models/investissement.model';

@Injectable({
  providedIn: 'root'
})
export class InvestissementService {

  private investissementsSignal = signal<Investissement[]>([
    {
      id: 'I1',
      titre: 'Four rotatif 16 plaques',
      categorie: 'Équipement',
      montant: 4500000,
      date: '2024-02-01',
      boulangerie: 'Rose — Mermoz',
      statut: 'realise',
      retourEstime: 18,
      description: 'Augmentation capacité production +40%'
    },
    {
      id: 'I2',
      titre: 'Rénovation façade Almadies',
      categorie: 'Infrastructure',
      montant: 2200000,
      date: '2024-04-15',
      boulangerie: 'Rose — Almadies',
      statut: 'en_cours',
      retourEstime: 24,
      description: 'Réfection façade et enseignes lumineuses'
    },
    {
      id: 'I3',
      titre: 'Système POS tactile x4',
      categorie: 'Technologie',
      montant: 1800000,
      date: '2025-01-10',
      boulangerie: 'Toutes',
      statut: 'realise',
      retourEstime: 12,
      description: 'Caisses tactiles dans les 4 boutiques'
    },
    {
      id: 'I4',
      titre: 'Ouverture 5e boutique',
      categorie: 'Expansion',
      montant: 18000000,
      date: '2025-09-01',
      boulangerie: 'Parcelles Assainies',
      statut: 'planifie',
      retourEstime: 36,
      description: 'Nouveau point de vente — Parcelles Assainies'
    },
    {
      id: 'I5',
      titre: 'Chambre froide Plateau',
      categorie: 'Équipement',
      montant: 3200000,
      date: '2024-11-20',
      boulangerie: 'Rose — Plateau',
      statut: 'realise',
      retourEstime: 20,
      description: 'Chambre froide 12m² pâtisserie et frais'
    },
    {
      id: 'I6',
      titre: 'Formation équipes HACCP',
      categorie: 'Formation',
      montant: 480000,
      date: '2025-03-05',
      boulangerie: 'Toutes',
      statut: 'en_cours',
      retourEstime: 0,
      description: 'Certification hygiène pour 20 employés'
    }
  ]);

  filtreCategorie = signal<string>('Tout');
  filtreStatut = signal<string>('Tout');

  readonly investissements = this.investissementsSignal.asReadonly();

  // Statistiques calculées
  readonly stats = computed<InvestissementStats>(() => {
    const investissements = this.investissementsSignal();
    const totalInvesti = investissements
      .filter(i => i.statut !== 'planifie')
      .reduce((sum, i) => sum + i.montant, 0);
    const totalPlanifie = investissements
      .filter(i => i.statut === 'planifie')
      .reduce((sum, i) => sum + i.montant, 0);
    const realise = investissements.filter(i => i.statut === 'realise').length;
    const enCours = investissements.filter(i => i.statut === 'en_cours').length;

    return {
      totalInvesti,
      totalPlanifie,
      realise,
      enCours
    };
  });

  // Investissements filtrés
  readonly investissementsFiltres = computed(() => {
    const investissements = this.investissementsSignal();
    const categorie = this.filtreCategorie();
    const statut = this.filtreStatut();

    return investissements.filter(i =>
      (categorie === 'Tout' || i.categorie === categorie) &&
      (statut === 'Tout' || i.statut === statut)
    );
  });

  // Liste des catégories uniques pour les filtres
  readonly categories = computed(() => {
    const investissements = this.investissementsSignal();
    const cats = new Set(investissements.map(i => i.categorie));
    return ['Tout', ...Array.from(cats)];
  });

  // Liste des statuts pour les filtres
  readonly statuts: string[] = ['Tout', 'planifie', 'en_cours', 'realise'];

  // Méthodes CRUD
  ajouterInvestissement(investissement: Omit<Investissement, 'id'>): void {
    const nouvelInvestissement: Investissement = {
      ...investissement,
      id: 'I' + Date.now()
    };
    this.investissementsSignal.update(list => [...list, nouvelInvestissement]);
  }

  modifierInvestissement(id: string, data: Partial<Investissement>): void {
    this.investissementsSignal.update(list =>
      list.map(i => i.id === id ? { ...i, ...data } : i)
    );
  }

  supprimerInvestissement(id: string): void {
    this.investissementsSignal.update(list => list.filter(i => i.id !== id));
  }

  // Méthodes de filtrage
  setFiltreCategorie(categorie: string): void {
    this.filtreCategorie.set(categorie);
  }

  setFiltreStatut(statut: string): void {
    this.filtreStatut.set(statut);
  }

  resetFiltres(): void {
    this.filtreCategorie.set('Tout');
    this.filtreStatut.set('Tout');
  }

  // Helpers pour l'affichage
  getStatutInfo(statut: InvestissementStatut): { label: string; class: string } {
    const map: Record<InvestissementStatut, { label: string; class: string }> = {
      planifie: { label: 'Planifié', class: 'info' },
      en_cours: { label: 'En cours', class: 'warning' },
      realise: { label: 'Réalisé', class: 'success' }
    };
    return map[statut];
  }

  getCategorieIcon(categorie: InvestissementCategorie | string): string {
    const map: Record<string, string> = {
      Équipement: '⚙️',
      Infrastructure: '🏗️',
      Technologie: '💻',
      Expansion: '📍',
      Formation: '🎓'
    };
    return map[categorie] || '💼';
  }

  formatMontant(montant: number): string {
    if (montant >= 1_000_000) {
      return (montant / 1_000_000).toFixed(1) + 'M FCFA';
    } else if (montant >= 1_000) {
      return (montant / 1_000).toFixed(0) + 'k FCFA';
    }
    return montant + ' FCFA';
  }

}