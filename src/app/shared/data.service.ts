// src/app/shared/services/data.service.ts
import { Injectable, signal } from '@angular/core';
import { Livraison, Production, Produit, StatsBoulangerie, User } from '../core/models';


@Injectable({ providedIn: 'root' })
export class DataService {

  readonly currentUser = signal<User>({
    id: '1',
    nom: 'Diallo',
    prenom: 'Aminata',
    role: 'proprietaire',
    boulangerie: 'Groupe Boulangerie Rose'
  });

  /*
  readonly produits: Produit[] = [
    { id: '1', nom: 'Baguette Tradition', prix: 350, categorie: 'Pain', stock: 48, icone: '🥖' },
    { id: '2', nom: 'Croissant Beurre', prix: 450, categorie: 'Viennoiserie', stock: 32, icone: '🥐' },
    { id: '3', nom: 'Pain de Mie', prix: 800, categorie: 'Pain', stock: 15, icone: '🍞' },
    { id: '4', nom: 'Macaron Rose', prix: 600, categorie: 'Pâtisserie', stock: 24, icone: '🍬' },
    { id: '5', nom: 'Tarte aux Fraises', prix: 2500, categorie: 'Pâtisserie', stock: 8, icone: '🍰' },
    { id: '6', nom: 'Éclair Chocolat', prix: 700, categorie: 'Pâtisserie', stock: 18, icone: '🎂' },
    { id: '7', nom: 'Sandwich Jambon', prix: 1200, categorie: 'Snacking', stock: 22, icone: '🥪' },
    { id: '8', nom: 'Pain Complet', prix: 500, categorie: 'Pain', stock: 30, icone: '🫓' },
    { id: '9', nom: 'Brioche', prix: 1500, categorie: 'Viennoiserie', stock: 12, icone: '🍞' },
    { id: '10', nom: 'Mille-feuille', prix: 1800, categorie: 'Pâtisserie', stock: 6, icone: '🍮' },
    { id: '11', nom: 'Café', prix: 400, categorie: 'Boissons', stock: 99, icone: '☕' },
    { id: '12', nom: 'Jus d\'orange', prix: 700, categorie: 'Boissons', stock: 20, icone: '🍊' },
  ]; */

  readonly produits: Produit[] = [
    // Entrées
    { id: '1', nom: 'Salade César', prix: 2500, categorie: 'Entrées', stock: 25, icone: '🥗' },
    { id: '2', nom: 'Nems Poulet', prix: 2000, categorie: 'Entrées', stock: 30, icone: '🥟' },
    { id: '3', nom: 'Soupe du jour', prix: 1500, categorie: 'Entrées', stock: 20, icone: '🍜' },

    // Plats
    { id: '4', nom: 'Poulet Yassa', prix: 3500, categorie: 'Plats', stock: 15, icone: '🍗' },
    { id: '5', nom: 'Thieboudienne', prix: 4000, categorie: 'Plats', stock: 12, icone: '🍚' },
    { id: '6', nom: 'Mafé Poulet', prix: 3500, categorie: 'Plats', stock: 18, icone: '🍛' },
    { id: '7', nom: 'Poisson Grillé', prix: 4500, categorie: 'Plats', stock: 10, icone: '🐟' },
    { id: '8', nom: 'Brochettes Bœuf', prix: 4000, categorie: 'Plats', stock: 14, icone: '🥩' },

    // Desserts
    { id: '9', nom: 'Tiramisu Maison', prix: 2000, categorie: 'Desserts', stock: 16, icone: '🍰' },
    { id: '10', nom: 'Mousse Chocolat', prix: 1800, categorie: 'Desserts', stock: 20, icone: '🍫' },
    { id: '11', nom: 'Salade de Fruits', prix: 1500, categorie: 'Desserts', stock: 22, icone: '🍓' },

    // Boissons
    { id: '12', nom: 'Jus Bissap', prix: 800, categorie: 'Boissons', stock: 50, icone: '🍷' },
    { id: '13', nom: 'Jus Gingembre', prix: 800, categorie: 'Boissons', stock: 45, icone: '🥤' },
    { id: '14', nom: 'Coca-Cola', prix: 600, categorie: 'Boissons', stock: 99, icone: '🥤' },
    { id: '15', nom: 'Eau Minérale', prix: 500, categorie: 'Boissons', stock: 100, icone: '💧' },
    { id: '16', nom: 'Café Touba', prix: 400, categorie: 'Boissons', stock: 99, icone: '☕' },

    // Accompagnements
    { id: '17', nom: 'Frites Maison', prix: 1200, categorie: 'Accompagnements', stock: 35, icone: '🍟' },
    { id: '18', nom: 'Riz Blanc', prix: 1000, categorie: 'Accompagnements', stock: 40, icone: '🍚' },
    { id: '19', nom: 'Légumes Sautés', prix: 1500, categorie: 'Accompagnements', stock: 28, icone: '🥦' },
    { id: '20', nom: 'Bananes Plantain', prix: 1200, categorie: 'Accompagnements', stock: 20, icone: '🍌' },
  ];

  readonly livraisons: Livraison[] = [
    { id: 'L1', livreurNom: 'Moussa Thiaw', zone: 'Plateau', commandes: 12, montant: 48500, statut: 'en_cours', heure: '08:30', date: new Date() },
    { id: 'L2', livreurNom: 'Ibrahima Sow', zone: 'Almadies', commandes: 9, montant: 36200, statut: 'livre', heure: '07:45', date: new Date() },
    { id: 'L3', livreurNom: 'Omar Faye', zone: 'Mermoz', commandes: 15, montant: 62000, statut: 'en_cours', heure: '09:00', date: new Date() },
    { id: 'L4', livreurNom: 'Cheikh Ndiaye', zone: 'Ouakam', commandes: 7, montant: 28800, statut: 'en_retard', heure: '08:00', date: new Date() },
    { id: 'L5', livreurNom: 'Babacar Diouf', zone: 'Sacré-Cœur', commandes: 11, montant: 44000, statut: 'livre', heure: '07:30', date: new Date() },
  ];

  readonly productions: Production[] = [
    { id: 'P1', produit: 'Baguette Tradition', quantitePlanifiee: 200, quantiteRealisee: 180, statut: 'en_cours', boulanger: 'Amadou Ba', dateProduction: new Date() },
    { id: 'P2', produit: 'Croissant Beurre', quantitePlanifiee: 150, quantiteRealisee: 150, statut: 'termine', boulanger: 'Fatou Diop', dateProduction: new Date() },
    { id: 'P3', produit: 'Pain de Mie', quantitePlanifiee: 60, quantiteRealisee: 45, statut: 'en_cours', boulanger: 'Amadou Ba', dateProduction: new Date() },
    { id: 'P4', produit: 'Éclair Chocolat', quantitePlanifiee: 80, quantiteRealisee: 0, statut: 'planifie', boulanger: 'Aïssatou Mbaye', dateProduction: new Date() },
    { id: 'P5', produit: 'Brioche', quantitePlanifiee: 40, quantiteRealisee: 38, statut: 'termine', boulanger: 'Fatou Diop', dateProduction: new Date() },
    { id: 'P6', produit: 'Tarte aux Fraises', quantitePlanifiee: 20, quantiteRealisee: 5, statut: 'probleme', boulanger: 'Aïssatou Mbaye', dateProduction: new Date() },
  ];

  readonly statsBoulangeries: StatsBoulangerie[] = [
    { id: 'B1', nom: 'Rose — Plateau', adresse: 'Av. Pompidou, Dakar', vendeur: 'Ndèye Sarr', ventesJour: 285000, objectifJour: 300000, commandesJour: 147, taux: 95, tendance: 'hausse' },
    { id: 'B2', nom: 'Rose — Almadies', adresse: 'Route des Almadies', vendeur: 'Mariama Koné', ventesJour: 198000, objectifJour: 250000, commandesJour: 98, taux: 79, tendance: 'stable' },
    { id: 'B3', nom: 'Rose — Mermoz', adresse: 'Rue 10, Mermoz', vendeur: 'Dieynaba Fall', ventesJour: 312000, objectifJour: 300000, commandesJour: 162, taux: 104, tendance: 'hausse' },
    { id: 'B4', nom: 'Rose — Ouakam', adresse: 'Av. des Mamelles', vendeur: 'Rokhaya Gaye', ventesJour: 142000, objectifJour: 200000, commandesJour: 73, taux: 71, tendance: 'baisse' },
  ];

  readonly ventesHeure = [
    { heure: '06h', ventes: 18000 },
    { heure: '07h', ventes: 42000 },
    { heure: '08h', ventes: 78000 },
    { heure: '09h', ventes: 95000 },
    { heure: '10h', ventes: 62000 },
    { heure: '11h', ventes: 48000 },
    { heure: '12h', ventes: 55000 },
    { heure: '13h', ventes: 35000 },
    { heure: '14h', ventes: 28000 },
    { heure: '15h', ventes: 20000 },
  ];

  readonly ventesHebdo = [
    { jour: 'Lun', ventes: 820000 },
    { jour: 'Mar', ventes: 760000 },
    { jour: 'Mer', ventes: 890000 },
    { jour: 'Jeu', ventes: 940000 },
    { jour: 'Ven', ventes: 1100000 },
    { jour: 'Sam', ventes: 1350000 },
    { jour: 'Dim', ventes: 975000 },
  ];
}
