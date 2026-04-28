export type GerantStatut = 'actif' | 'conge' | 'inactif';

export interface Gerant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  boulangerie: string;
  boulangerieId: string;
  dateEmbauche: string;
  statut: GerantStatut;
  photo: string;
}

export interface GerantStats {
  total: number;
  actifs: number;
  enConge: number;
  inactifs: number;
}

export interface GerantFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  boulangerieId: string;
  dateEmbauche: string;
}