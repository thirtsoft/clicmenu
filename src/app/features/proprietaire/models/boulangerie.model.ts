export type BoulangerieStatut = 'active' | 'ferme' | 'renovation';
export type TendanceType = 'hausse' | 'baisse' | 'stable';

export interface Boulangerie {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
  gerantNom: string;
  statut: BoulangerieStatut;
  dateOuverture: string;
  superficie: number;
  ventesJour: number;
  objectifJour: number;
  commandesJour: number;
  taux: number;
  tendance: TendanceType;
}

export interface BoulangerieStats {
  totalBoulangeries: number;
  actives: number;
  ventesTotales: number;
  tauxMoyen: number;
  meilleureBoulangerie: Boulangerie | null;
}

export interface BoulangerieFormData {
  nom: string;
  adresse: string;
  ville: string;
  telephone: string;
  gerantNom: string;
  superficie: number;
  objectifJour: number;
}