import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Types (inchangés)
export type CommandeType = 'livreur' | 'fournisseur';
export type StatutCommande = 'en_attente' | 'validee' | 'livree' | 'annulee';

export interface ProduitVente {
  id: string;
  nom: string;
  categorie: 'pain' | 'viennoiserie' | 'patisserie' | 'sandwich';
  prixUnitaire: number;
  unite: string;
  icone: string;
  stock: number;
}

export interface MatierePremiere {
  id: string;
  nom: string;
  categorie: 'farine' | 'levure' | 'beurre' | 'oeufs' | 'sucre' | 'sel' | 'autre';
  prixUnitaire: number;
  unite: string;
  icone: string;
  seuilAlerte: number;
}

export interface LigneCommandeLivreur {
  produit: ProduitVente;
  quantite: number;
  total: number;
}

export interface LigneCommandeFournisseur {
  produit: MatierePremiere;
  quantite: number;
  total: number;
}

export interface CommandeLivreur {
  id: string;
  date: Date;
  livreurId: string;
  livreurNom: string;
  lignes: LigneCommandeLivreur[];
  total: number;
  statut: StatutCommande;
}

export interface CommandeFournisseur {
  id: string;
  date: Date;
  fournisseur: string;
  lignes: LigneCommandeFournisseur[];
  total: number;
  statut: StatutCommande;
}

export interface Livreur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  zone: string;
  statut: 'actif' | 'en_conge' | 'inactif';
  moto: string;
}

@Component({
  selector: 'app-passer-une-commande-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passer-une-commande-component.html',
  styleUrl: './passer-une-commande-component.css',
})
export class PasserUneCommandeComponent {
  // État de l'application
  typeCommande = signal<CommandeType>('livreur');
  searchTerm = signal('');
  
  // Mobile: contrôle l'affichage du panier drawer
  showPanierDrawer = signal(false);

  // Livreurs
  livreurs = signal<Livreur[]>([
    { id: 'L1', nom: 'Thiaw', prenom: 'Moussa', telephone: '+221 77 300 01 01', zone: 'Plateau', statut: 'actif', moto: 'Honda CB 125' },
    { id: 'L2', nom: 'Sow', prenom: 'Ibrahima', telephone: '+221 77 300 02 02', zone: 'Almadies', statut: 'actif', moto: 'Yamaha YBR' },
    { id: 'L3', nom: 'Faye', prenom: 'Omar', telephone: '+221 77 300 03 03', zone: 'Mermoz', statut: 'actif', moto: 'Bajaj Boxer' },
    { id: 'L4', nom: 'Ndiaye', prenom: 'Cheikh', telephone: '+221 77 300 04 04', zone: 'Ouakam', statut: 'en_conge', moto: 'TVS Star City' },
    { id: 'L5', nom: 'Diouf', prenom: 'Babacar', telephone: '+221 77 300 05 05', zone: 'Sacré-Cœur', statut: 'actif', moto: 'Honda CB 150' },
  ]);

  livreurSelectionne = signal<Livreur | undefined>(undefined);
  fournisseurSelectionne = signal('');

  // Produits de vente
  produitsVente = signal<ProduitVente[]>([
    { id: 'P1', nom: 'Baguette tradition', categorie: 'pain', prixUnitaire: 500, unite: 'pièce', icone: '🥖', stock: 150 },
    { id: 'P2', nom: 'Baguette complète', categorie: 'pain', prixUnitaire: 600, unite: 'pièce', icone: '🥖', stock: 80 },
    { id: 'P3', nom: 'Pain de campagne', categorie: 'pain', prixUnitaire: 800, unite: 'pièce', icone: '🍞', stock: 45 },
    { id: 'P4', nom: 'Croissant', categorie: 'viennoiserie', prixUnitaire: 450, unite: 'pièce', icone: '🥐', stock: 200 },
    { id: 'P5', nom: 'Pain au chocolat', categorie: 'viennoiserie', prixUnitaire: 500, unite: 'pièce', icone: '🍫', stock: 180 },
    { id: 'P6', nom: 'Palmier', categorie: 'viennoiserie', prixUnitaire: 400, unite: 'pièce', icone: '🥨', stock: 120 },
    { id: 'P7', nom: 'Éclair au chocolat', categorie: 'patisserie', prixUnitaire: 650, unite: 'pièce', icone: '🍰', stock: 60 },
    { id: 'P8', nom: 'Tartelette citron', categorie: 'patisserie', prixUnitaire: 550, unite: 'pièce', icone: '🍋', stock: 40 },
    { id: 'P9', nom: 'Pain jambon fromage', categorie: 'sandwich', prixUnitaire: 1200, unite: 'pièce', icone: '🥪', stock: 50 },
  ]);

  // Matières premières
  matieresPremieres = signal<MatierePremiere[]>([
    { id: 'M1', nom: 'Farine T55', categorie: 'farine', prixUnitaire: 650, unite: 'kg', icone: '🌾', seuilAlerte: 100 },
    { id: 'M2', nom: 'Farine T65', categorie: 'farine', prixUnitaire: 700, unite: 'kg', icone: '🌾', seuilAlerte: 80 },
    { id: 'M3', nom: 'Levure fraîche', categorie: 'levure', prixUnitaire: 4500, unite: 'kg', icone: '🧫', seuilAlerte: 10 },
    { id: 'M4', nom: 'Beurre 84%', categorie: 'beurre', prixUnitaire: 5200, unite: 'kg', icone: '🧈', seuilAlerte: 30 },
    { id: 'M5', nom: 'Oeufs frais', categorie: 'oeufs', prixUnitaire: 3500, unite: 'boîte (30)', icone: '🥚', seuilAlerte: 20 },
    { id: 'M6', nom: 'Sucre blanc', categorie: 'sucre', prixUnitaire: 700, unite: 'kg', icone: '🍬', seuilAlerte: 50 },
    { id: 'M7', nom: 'Sel fin', categorie: 'sel', prixUnitaire: 300, unite: 'kg', icone: '🧂', seuilAlerte: 40 },
    { id: 'M8', nom: 'Chocolat pâtissier', categorie: 'autre', prixUnitaire: 8000, unite: 'kg', icone: '🍫', seuilAlerte: 15 },
  ]);

  // Panier
  panierLivreur = signal<LigneCommandeLivreur[]>([]);
  panierFournisseur = signal<LigneCommandeFournisseur[]>([]);

  // Computed values
  totalPanier = computed(() => {
    if (this.typeCommande() === 'livreur') {
      return this.panierLivreur().reduce((sum, item) => sum + item.total, 0);
    }
    return this.panierFournisseur().reduce((sum, item) => sum + item.total, 0);
  });

  nbLignesPanier = computed(() => {
    if (this.typeCommande() === 'livreur') {
      return this.panierLivreur().length;
    }
    return this.panierFournisseur().length;
  });

  isPanierNonVide = computed(() => this.nbLignesPanier() > 0);

  // Filtres produits
  categorieProduit = signal<string>('Tout');
  categoriesProduitsVente = ['Tout', 'pain', 'viennoiserie', 'patisserie', 'sandwich'];
  categoriesMatiere = ['Tout', 'farine', 'levure', 'beurre', 'oeufs', 'sucre', 'sel', 'autre'];

  produitsFiltres = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const categorie = this.categorieProduit();

    if (this.typeCommande() === 'livreur') {
      let produits = this.produitsVente();
      if (categorie !== 'Tout') {
        produits = produits.filter(p => p.categorie === categorie);
      }
      if (search) {
        produits = produits.filter(p => p.nom.toLowerCase().includes(search));
      }
      return produits;
    } else {
      let produits = this.matieresPremieres();
      if (categorie !== 'Tout') {
        produits = produits.filter(p => p.categorie === categorie);
      }
      if (search) {
        produits = produits.filter(p => p.nom.toLowerCase().includes(search));
      }
      return produits;
    }
  });

  livreursActifs = computed(() => this.livreurs().filter(l => l.statut === 'actif'));

  // Méthodes
  setTypeCommande(type: CommandeType): void {
    this.typeCommande.set(type);
    this.categorieProduit.set('Tout');
    this.searchTerm.set('');
    // Réinitialiser le panier quand on change de type
    if (type === 'livreur') {
      this.panierFournisseur.set([]);
    } else {
      this.panierLivreur.set([]);
    }
    this.fournisseurSelectionne.set('');
    this.livreurSelectionne.set(undefined);
  }

  ajouterAuPanier(produit: ProduitVente | MatierePremiere): void {
    if (this.typeCommande() === 'livreur') {
      const p = produit as ProduitVente;
      const existing = this.panierLivreur().find(item => item.produit.id === p.id);
      if (existing) {
        this.panierLivreur.update(panier =>
          panier.map(item =>
            item.produit.id === p.id
              ? { ...item, quantite: item.quantite + 1, total: (item.quantite + 1) * p.prixUnitaire }
              : item
          )
        );
      } else {
        this.panierLivreur.update(panier => [
          ...panier,
          { produit: p, quantite: 1, total: p.prixUnitaire }
        ]);
      }
    } else {
      const p = produit as MatierePremiere;
      const existing = this.panierFournisseur().find(item => item.produit.id === p.id);
      if (existing) {
        this.panierFournisseur.update(panier =>
          panier.map(item =>
            item.produit.id === p.id
              ? { ...item, quantite: item.quantite + 1, total: (item.quantite + 1) * p.prixUnitaire }
              : item
          )
        );
      } else {
        this.panierFournisseur.update(panier => [
          ...panier,
          { produit: p, quantite: 1, total: p.prixUnitaire }
        ]);
      }
    }
  }

  modifierQuantite(produitId: string, delta: number): void {
    if (this.typeCommande() === 'livreur') {
      this.panierLivreur.update(panier =>
        panier
          .map(item =>
            item.produit.id === produitId
              ? { ...item, quantite: item.quantite + delta, total: (item.quantite + delta) * item.produit.prixUnitaire }
              : item
          )
          .filter(item => item.quantite > 0)
      );
    } else {
      this.panierFournisseur.update(panier =>
        panier
          .map(item =>
            item.produit.id === produitId
              ? { ...item, quantite: item.quantite + delta, total: (item.quantite + delta) * item.produit.prixUnitaire }
              : item
          )
          .filter(item => item.quantite > 0)
      );
    }
  }

  getQuantitePanier(produitId: string): number {
    if (this.typeCommande() === 'livreur') {
      return this.panierLivreur().find(item => item.produit.id === produitId)?.quantite ?? 0;
    }
    return this.panierFournisseur().find(item => item.produit.id === produitId)?.quantite ?? 0;
  }

  validerCommande(): void {
    if (this.typeCommande() === 'livreur') {
      if (!this.livreurSelectionne()) {
        alert('Veuillez sélectionner un livreur');
        return;
      }
      if (this.panierLivreur().length === 0) {
        alert('Veuillez ajouter des produits au panier');
        return;
      }

      alert(`Commande validée pour ${this.livreurSelectionne()!.prenom} ${this.livreurSelectionne()!.nom}`);
      this.panierLivreur.set([]);
      this.livreurSelectionne.set(undefined);
    } else {
      if (!this.fournisseurSelectionne()) {
        alert('Veuillez sélectionner un fournisseur');
        return;
      }
      if (this.panierFournisseur().length === 0) {
        alert('Veuillez ajouter des produits au panier');
        return;
      }

      alert(`Commande fournisseur validée pour ${this.fournisseurSelectionne()}`);
      this.panierFournisseur.set([]);
      this.fournisseurSelectionne.set('');
    }
    
    // Fermer le drawer sur mobile si ouvert
    this.showPanierDrawer.set(false);
  }

  annulerCommande(): void {
    if (this.typeCommande() === 'livreur') {
      this.panierLivreur.set([]);
      this.livreurSelectionne.set(undefined);
    } else {
      this.panierFournisseur.set([]);
      this.fournisseurSelectionne.set('');
    }
    this.showPanierDrawer.set(false);
  }

  selectLivreurById(id: string): void {
    const livreur = this.livreursActifs().find(l => l.id === id);
    this.livreurSelectionne.set(livreur);
  }

  isCommandeValid(): boolean {
    if (this.typeCommande() === 'livreur') {
      return !!this.livreurSelectionne() && this.panierLivreur().length > 0;
    }
    return !!this.fournisseurSelectionne() && this.panierFournisseur().length > 0;
  }

  // Mobile: toggle panier drawer
  togglePanierDrawer(): void {
    this.showPanierDrawer.update(val => !val);
  }

  // Formatage
  formatCFA(n: number): string {
    if (n === 0) return '0 FCFA';
    if (n >= 1_000_000) {
      return (n / 1_000_000).toFixed(1) + 'M FCFA';
    }
    if (n >= 1_000) {
      return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
    }
    return n + ' FCFA';
  }

  formatCFAFull(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}