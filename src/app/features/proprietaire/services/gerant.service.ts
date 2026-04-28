import { Injectable, signal, computed } from '@angular/core';
import { Gerant, GerantFormData, GerantStats } from '../models/gerant.model';
import { BoulangerieService } from './boulangerie.service';

@Injectable({
  providedIn: 'root'
})
export class GerantService {
  private gerantsSignal = signal<Gerant[]>([
    { id: 'G1', nom: 'Diop', prenom: 'Moussa', email: 'moussa.diop@rose.sn', telephone: '+221 77 200 01 01', boulangerie: 'Rose — Plateau', boulangerieId: 'B1', dateEmbauche: '2018-03-15', statut: 'actif', photo: 'MD' },
    { id: 'G2', nom: 'Koné', prenom: 'Aminata', email: 'aminata.kone@rose.sn', telephone: '+221 77 200 02 02', boulangerie: 'Rose — Almadies', boulangerieId: 'B2', dateEmbauche: '2019-07-01', statut: 'actif', photo: 'AK' },
    { id: 'G3', nom: 'Thiaw', prenom: 'Oumar', email: 'oumar.thiaw@rose.sn', telephone: '+221 77 200 03 03', boulangerie: 'Rose — Mermoz', boulangerieId: 'B3', dateEmbauche: '2020-01-20', statut: 'conge', photo: 'OT' },
    { id: 'G4', nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou.ndiaye@rose.sn', telephone: '+221 77 200 04 04', boulangerie: 'Rose — Ouakam', boulangerieId: 'B4', dateEmbauche: '2022-05-10', statut: 'actif', photo: 'FN' },
  ]);

  readonly gerants = this.gerantsSignal.asReadonly();

  constructor(private boulangerieService: BoulangerieService) {}

  readonly stats = computed<GerantStats>(() => {
    const gerants = this.gerantsSignal();
    return {
      total: gerants.length,
      actifs: gerants.filter(g => g.statut === 'actif').length,
      enConge: gerants.filter(g => g.statut === 'conge').length,
      inactifs: gerants.filter(g => g.statut === 'inactif').length
    };
  });

  ajouterGerant(data: GerantFormData): void {
    const boulangerie = this.boulangerieService.boulangeries().find(b => b.id === data.boulangerieId);
    
    const nouveauGerant: Gerant = {
      id: 'G' + Date.now(),
      ...data,
      boulangerie: boulangerie?.nom ?? '',
      dateEmbauche: data.dateEmbauche || new Date().toISOString().split('T')[0],
      statut: 'actif',
      photo: ((data.prenom[0] ?? '') + (data.nom[0] ?? '')).toUpperCase()
    };

    this.gerantsSignal.update(list => [...list, nouveauGerant]);
  }

  supprimerGerant(id: string): void {
    this.gerantsSignal.update(list => list.filter(g => g.id !== id));
  }
}