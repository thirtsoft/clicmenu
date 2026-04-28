export interface ProduitAppro {
  id: string;
  nom: string;
  categorie: string;
  unite: string;
  icone: string;
  prixUnitaire: number;
}

export interface LigneAppro {
  produit: ProduitAppro;
  boulangerieId: string;
  quantite: number;
  total: number;
}

export type CommandeApproStatut = 'en_attente' | 'livree' | 'partielle';

export interface CommandeAppro {
  id: string;
  date: Date;
  fournisseur: string;
  lignes: LigneAppro[];
  total: number;
  statut: CommandeApproStatut;
}