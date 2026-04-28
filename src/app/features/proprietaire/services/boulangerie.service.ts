import { computed, Injectable, signal } from '@angular/core';
import { Boulangerie, BoulangerieFormData, BoulangerieStats } from '../models/boulangerie.model';

@Injectable({
  providedIn: 'root'
})
export class BoulangerieService {

  private boulangeriesSignal = signal<Boulangerie[]>([
    { id: 'B1', nom: 'Rose — Plateau', adresse: 'Av. Pompidou', ville: 'Dakar', telephone: '+221 77 100 00 01', gerantNom: 'Moussa Diop', statut: 'active', dateOuverture: '2018-03-15', superficie: 120, ventesJour: 285000, objectifJour: 300000, commandesJour: 147, taux: 95, tendance: 'hausse' },
    { id: 'B2', nom: 'Rose — Almadies', adresse: 'Route des Almadies', ville: 'Dakar', telephone: '+221 77 100 00 02', gerantNom: 'Aminata Koné', statut: 'active', dateOuverture: '2019-07-01', superficie: 95, ventesJour: 198000, objectifJour: 250000, commandesJour: 98, taux: 79, tendance: 'stable' },
    { id: 'B3', nom: 'Rose — Mermoz', adresse: 'Rue 10, Mermoz', ville: 'Dakar', telephone: '+221 77 100 00 03', gerantNom: 'Oumar Thiaw', statut: 'active', dateOuverture: '2020-01-20', superficie: 110, ventesJour: 312000, objectifJour: 300000, commandesJour: 162, taux: 104, tendance: 'hausse' },
    { id: 'B4', nom: 'Rose — Ouakam', adresse: 'Av. des Mamelles', ville: 'Dakar', telephone: '+221 77 100 00 04', gerantNom: 'Fatou Ndiaye', statut: 'active', dateOuverture: '2022-05-10', superficie: 80, ventesJour: 142000, objectifJour: 200000, commandesJour: 73, taux: 71, tendance: 'baisse' },
  ]);

  readonly boulangeries = this.boulangeriesSignal.asReadonly();

  getStats(): BoulangerieStats {
    const boulangeries = this.boulangeriesSignal();
    const actives = boulangeries.filter(b => b.statut === 'active').length;
    const ventesTotales = boulangeries.reduce((acc, b) => acc + b.ventesJour, 0);
    const tauxMoyen = Math.round(boulangeries.reduce((acc, b) => acc + b.taux, 0) / boulangeries.length);
    const meilleureBoulangerie = [...boulangeries].sort((a, b) => b.ventesJour - a.ventesJour)[0];

    return {
      totalBoulangeries: boulangeries.length,
      actives,
      ventesTotales,
      tauxMoyen,
      meilleureBoulangerie
    };
  }

  ajouterBoulangerie(data: BoulangerieFormData): void {
    const nouvelleBoulangerie: Boulangerie = {
      id: 'B' + Date.now(),
      ...data,
      statut: 'active',
      dateOuverture: new Date().toISOString().split('T')[0],
      ventesJour: 0,
      commandesJour: 0,
      taux: 0,
      tendance: 'stable'
    };

    this.boulangeriesSignal.update(list => [...list, nouvelleBoulangerie]);
  }

  modifierBoulangerie(id: string, data: Partial<Boulangerie>): void {
    this.boulangeriesSignal.update(list =>
      list.map(b => b.id === id ? { ...b, ...data } : b)
    );
  }

  supprimerBoulangerie(id: string): void {
    this.boulangeriesSignal.update(list => list.filter(b => b.id !== id));
  }
}