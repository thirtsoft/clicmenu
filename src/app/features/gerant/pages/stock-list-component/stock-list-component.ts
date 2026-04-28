import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Vue = 'apercu' | 'tables' | 'commandes' | 'menu' | 'stocks' | 'ventes';

interface Ingredient {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  seuilAlerte: number;
  unite: string;
  prixUnitaire: number;
  icone: string;
  fournisseur: string;
  statut: 'ok' | 'bas' | 'rupture';
}

interface MouvementStock {
  id: string;
  date: string;
  ingredientId: string;
  ingredient: string;
  type: 'entree' | 'sortie';
  quantite: number;
  unite: string;
  motif: string;
  par: string;
  notes: string;
}

@Component({
  selector: 'app-stock-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-list-component.html',
  styleUrl: './stock-list-component.css',

})
export class StockListComponent {

  protected readonly Math = Math;

  vue = signal<Vue>('stocks');

  // ── Filtres ────────────────────────────────────────
  filtreStockCat = signal<string>('tous');
  filtreStockStatut = signal<'tous' | 'ok' | 'bas' | 'rupture'>('tous');
  searchStock = signal('');

  // ── Ingrédients ────────────────────────────────────
  ingredients = signal<Ingredient[]>([
    { id: 'I1', nom: 'Poulet entier', categorie: 'Viandes', quantite: 25, seuilAlerte: 10, unite: 'kg', prixUnitaire: 2500, icone: '🍗', fournisseur: 'Marché central', statut: 'ok' },
    { id: 'I2', nom: 'Poisson thiof', categorie: 'Poissons', quantite: 8, seuilAlerte: 10, unite: 'kg', prixUnitaire: 3500, icone: '🐟', fournisseur: 'Pêcheur Soumbédioune', statut: 'bas' },
    { id: 'I3', nom: 'Riz brisé', categorie: 'Féculents', quantite: 50, seuilAlerte: 20, unite: 'kg', prixUnitaire: 500, icone: '🍚', fournisseur: 'Grossiste alimentaire', statut: 'ok' },
    { id: 'I4', nom: 'Oignons', categorie: 'Légumes', quantite: 30, seuilAlerte: 15, unite: 'kg', prixUnitaire: 400, icone: '🧅', fournisseur: 'Marché central', statut: 'ok' },
    { id: 'I5', nom: 'Tomates', categorie: 'Légumes', quantite: 5, seuilAlerte: 10, unite: 'kg', prixUnitaire: 600, icone: '🍅', fournisseur: 'Maraîcher local', statut: 'bas' },
    { id: 'I6', nom: 'Huile végétale', categorie: 'Condiments', quantite: 0, seuilAlerte: 5, unite: 'L', prixUnitaire: 1200, icone: '🫒', fournisseur: 'Grossiste alimentaire', statut: 'rupture' },
    { id: 'I7', nom: 'Farine de blé', categorie: 'Féculents', quantite: 40, seuilAlerte: 15, unite: 'kg', prixUnitaire: 350, icone: '🌾', fournisseur: 'Minoterie Dakar', statut: 'ok' },
    { id: 'I8', nom: 'Pâtes alimentaires', categorie: 'Féculents', quantite: 20, seuilAlerte: 10, unite: 'kg', prixUnitaire: 800, icone: '🍝', fournisseur: 'Grossiste alimentaire', statut: 'ok' },
    { id: 'I9', nom: 'Citrons', categorie: 'Fruits', quantite: 12, seuilAlerte: 8, unite: 'kg', prixUnitaire: 500, icone: '🍋', fournisseur: 'Marché central', statut: 'ok' },
    { id: 'I10', nom: 'Beurre', categorie: 'Produits laitiers', quantite: 3, seuilAlerte: 5, unite: 'kg', prixUnitaire: 3000, icone: '🧈', fournisseur: 'Laiterie du Cap', statut: 'bas' },
  ]);

  // ── Mouvements ─────────────────────────────────────
  mouvements = signal<MouvementStock[]>([
    { id: 'M1', date: '28/04/2026 14:30', ingredientId: 'I1', ingredient: 'Poulet entier', type: 'entree', quantite: 10, unite: 'kg', motif: 'Achat', par: 'Modou Seck', notes: 'Livraison hebdomadaire' },
    { id: 'M2', date: '28/04/2026 12:00', ingredientId: 'I3', ingredient: 'Riz brisé', type: 'sortie', quantite: 5, unite: 'kg', motif: 'Utilisation', par: 'Chef Moussa', notes: 'Service du midi' },
    { id: 'M3', date: '28/04/2026 10:15', ingredientId: 'I5', ingredient: 'Tomates', type: 'entree', quantite: 8, unite: 'kg', motif: 'Achat', par: 'Modou Seck', notes: '' },
    { id: 'M4', date: '27/04/2026 18:00', ingredientId: 'I6', ingredient: 'Huile végétale', type: 'sortie', quantite: 5, unite: 'L', motif: 'Utilisation', par: 'Chef Moussa', notes: 'Friture' },
    { id: 'M5', date: '27/04/2026 09:00', ingredientId: 'I2', ingredient: 'Poisson thiof', type: 'entree', quantite: 15, unite: 'kg', motif: 'Achat', par: 'Modou Seck', notes: 'Pêche du jour' },
  ]);

  // ── Formulaires ────────────────────────────────────
  showFormIngredient = signal(false);
  showFormMouvement = signal(false);
  editingIngredient = signal(false);
  editingIngredientId = signal<string | null>(null);

  newIngredient = signal({
    nom: '', categorie: '', quantite: 0, seuilAlerte: 10,
    unite: 'kg', prixUnitaire: 0, icone: '📦', fournisseur: ''
  });

  newMouvement = signal({
    type: 'entree' as 'entree' | 'sortie',
    ingredientId: '',
    quantite: 1,
    motif: 'Achat',
    notes: ''
  });

  // ── Catégories ─────────────────────────────────────
  categoriesStock = computed(() => {
    const cats = this.ingredients().map(i => i.categorie);
    return [...new Set(cats)].sort();
  });

  // ── Computed ───────────────────────────────────────
  ingredientsFiltres = computed(() => {
    let filtered = this.ingredients();
    
    // Filtre par catégorie
    if (this.filtreStockCat() !== 'tous') {
      filtered = filtered.filter(i => i.categorie === this.filtreStockCat());
    }
    
    // Filtre par statut
    if (this.filtreStockStatut() !== 'tous') {
      filtered = filtered.filter(i => i.statut === this.filtreStockStatut());
    }
    
    // Recherche
    if (this.searchStock()) {
      const search = this.searchStock().toLowerCase();
      filtered = filtered.filter(i => 
        i.nom.toLowerCase().includes(search) ||
        i.categorie.toLowerCase().includes(search) ||
        i.fournisseur.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  });

  ingredientsOk = computed(() => this.ingredients().filter(i => i.statut === 'ok').length);
  ingredientsBas = computed(() => this.ingredients().filter(i => i.statut === 'bas' || i.statut === 'rupture').length);

  valeurTotaleStock = computed(() => 
    this.ingredients().reduce((total, i) => total + (i.quantite * i.prixUnitaire), 0)
  );

  derniersMouvements = computed(() => 
    this.mouvements().slice(0, 10)
  );

  // ── Méthodes ───────────────────────────────────────
  setFiltreStockCat(cat: string) { this.filtreStockCat.set(cat); }
  setFiltreStockStatut(statut: 'tous' | 'ok' | 'bas' | 'rupture') { this.filtreStockStatut.set(statut); }

  ingredientsParCategorie(cat: string): number {
    return this.ingredients().filter(i => i.categorie === cat).length;
  }

  pourcentageStock(ing: Ingredient): number {
    const max = ing.seuilAlerte * 3;
    return Math.min((ing.quantite / max) * 100, 100);
  }

  statutStock(s: string) {
    const m: Record<string, { label: string; cls: string }> = {
      ok: { label: 'OK', cls: 'success' },
      bas: { label: 'Bas', cls: 'warning' },
      rupture: { label: 'Rupture', cls: 'danger' },
    };
    return m[s] ?? { label: s, cls: 'info' };
  }

  // ── Formulaire ingrédient ──────────────────────────
  setIngredientField(field: string, value: any) {
    this.newIngredient.update(current => ({ ...current, [field]: value }));
  }

  ouvrirFormIngredient() {
    this.editingIngredient.set(false);
    this.editingIngredientId.set(null);
    this.newIngredient.set({
      nom: '', categorie: '', quantite: 0, seuilAlerte: 10,
      unite: 'kg', prixUnitaire: 0, icone: '📦', fournisseur: ''
    });
    this.showFormIngredient.set(true);
  }

  modifierIngredient(ing: Ingredient) {
    this.editingIngredient.set(true);
    this.editingIngredientId.set(ing.id);
    this.newIngredient.set({
      nom: ing.nom, categorie: ing.categorie, quantite: ing.quantite,
      seuilAlerte: ing.seuilAlerte, unite: ing.unite,
      prixUnitaire: ing.prixUnitaire, icone: ing.icone, fournisseur: ing.fournisseur
    });
    this.showFormIngredient.set(true);
  }

  fermerFormIngredient() {
    this.showFormIngredient.set(false);
    this.editingIngredient.set(false);
    this.editingIngredientId.set(null);
  }

  sauvegarderIngredient() {
    const f = this.newIngredient();
    if (!f.nom || !f.categorie) return;

    if (this.editingIngredient() && this.editingIngredientId()) {
      // Modification
      this.ingredients.update(list =>
        list.map(ing => {
          if (ing.id === this.editingIngredientId()) {
            const statut = this.calculerStatut(f.quantite, f.seuilAlerte);
            return { ...ing, ...f, statut };
          }
          return ing;
        })
      );
    } else {
      // Création
      const statut = this.calculerStatut(f.quantite, f.seuilAlerte);
      this.ingredients.update(list => [...list, {
        id: 'I' + Date.now(),
        ...f,
        statut
      }]);
    }

    this.fermerFormIngredient();
  }

  supprimerIngredient(id: string) {
    if (confirm('Supprimer cet ingrédient du stock ?')) {
      this.ingredients.update(list => list.filter(i => i.id !== id));
    }
  }

  private calculerStatut(quantite: number, seuil: number): 'ok' | 'bas' | 'rupture' {
    if (quantite === 0) return 'rupture';
    if (quantite <= seuil) return 'bas';
    return 'ok';
  }

  // ── Formulaire mouvement ───────────────────────────
  setMouvementField(field: string, value: any) {
    this.newMouvement.update(current => ({ ...current, [field]: value }));
  }

  ouvrirMouvement(ing: Ingredient, type: 'entree' | 'sortie') {
    this.newMouvement.set({
      type,
      ingredientId: ing.id,
      quantite: 1,
      motif: type === 'entree' ? 'Achat' : 'Utilisation',
      notes: ''
    });
    this.showFormMouvement.set(true);
  }

  validerMouvement() {
    const m = this.newMouvement();
    if (!m.ingredientId || m.quantite <= 0) return;

    const ing = this.ingredients().find(i => i.id === m.ingredientId);
    if (!ing) return;

    // Mettre à jour la quantité
    const nouvelleQuantite = m.type === 'entree' 
      ? ing.quantite + m.quantite 
      : ing.quantite - m.quantite;

    if (nouvelleQuantite < 0) {
      alert('Stock insuffisant pour cette sortie !');
      return;
    }

    this.ingredients.update(list =>
      list.map(i => {
        if (i.id === m.ingredientId) {
          const statut = this.calculerStatut(nouvelleQuantite, i.seuilAlerte);
          return { ...i, quantite: nouvelleQuantite, statut };
        }
        return i;
      })
    );

    // Ajouter le mouvement à l'historique
    const now = new Date();
    this.mouvements.update(list => [{
      id: 'M' + Date.now(),
      date: now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      ingredientId: m.ingredientId,
      ingredient: ing.nom,
      type: m.type,
      quantite: m.quantite,
      unite: ing.unite,
      motif: m.motif,
      par: 'Gérant',
      notes: m.notes
    }, ...list]);

    this.showFormMouvement.set(false);
  }

  fmtCFA(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
