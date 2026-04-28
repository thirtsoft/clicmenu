// src/app/shared/models/index.ts

export type UserRole = 'vendeur' | 'gerant' | 'proprietaire';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  role: UserRole;
  boulangerie?: string;
  avatar?: string;
}

export interface Produit {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  stock: number;
  icone: string;
  description?: string;
}

export interface LigneCommande {
  produit: Produit;
  quantite: number;
  sousTotal: number;
}

export interface Commande {
  id: string;
  date: Date;
  lignes: LigneCommande[];
  total: number;
  modePaiement: 'especes' | 'carte' | 'mobile';
  statut: 'en_attente' | 'encaisse' | 'livre' | 'annule';
  vendeurId: string;
  clientNom?: string;
}

export interface Livraison {
  id: string;
  livreurNom: string;
  zone: string;
  commandes: number;
  montant: number;
  statut: 'en_cours' | 'livre' | 'en_retard';
  heure: string;
  date: Date;
}

export interface Production {
  id: string;
  produit: string;
  quantitePlanifiee: number;
  quantiteRealisee: number;
  statut: 'planifie' | 'en_cours' | 'termine' | 'probleme';
  boulanger: string;
  dateProduction: Date;
}

export interface StatsBoulangerie {
  id: string;
  nom: string;
  adresse: string;
  vendeur: string;
  ventesJour: number;
  objectifJour: number;
  commandesJour: number;
  taux: number;
  tendance: 'hausse' | 'baisse' | 'stable';
}

export interface KPI {
  label: string;
  valeur: string | number;
  icone: string;
  variation: number;
  couleur: string;
}
