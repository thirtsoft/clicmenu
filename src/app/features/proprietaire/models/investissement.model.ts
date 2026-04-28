export type InvestissementStatut = 'planifie' | 'en_cours' | 'realise';
export type InvestissementCategorie = 'Équipement' | 'Infrastructure' | 'Technologie' | 'Expansion' | 'Formation';

export interface Investissement {
  id: string;
  titre: string;
  categorie: InvestissementCategorie;
  montant: number;
  date: string;
  boulangerie: string;
  statut: InvestissementStatut;
  retourEstime: number;
  description: string;
}

export interface InvestissementStats {
  totalInvesti: number;
  totalPlanifie: number;
  realise: number;
  enCours: number;
}