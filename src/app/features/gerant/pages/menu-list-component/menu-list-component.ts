import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface PlatMenu {
  id: string;
  nom: string;
  categorie: string;
  prix: number;
  description: string;
  icone: string;
  tempsPreparation: number;
  disponible: boolean;
  ingredients: string[];
  commandesJour: number;
}

@Component({
  selector: 'app-menu-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-list-component.html',
  styleUrl: './menu-list-component.css',
})
export class MenuListComponent {

  // ── Menu ────────────────────────────────────────────
  produits = signal<PlatMenu[]>([
    {
      id: 'P1', nom: 'Poulet Yassa', categorie: 'Plats', prix: 3500,
      description: 'Poulet mariné au citron et oignons caramélisés, riz blanc',
      icone: '🍗', tempsPreparation: 25, disponible: true,
      ingredients: ['Poulet', 'Oignon', 'Citron', 'Moutarde', 'Riz'],
      commandesJour: 15
    },
    {
      id: 'P2', nom: 'Thieboudienne', categorie: 'Plats', prix: 4000,
      description: 'Riz au poisson, légumes et sauce tomate épicée',
      icone: '🍚', tempsPreparation: 35, disponible: true,
      ingredients: ['Poisson', 'Riz', 'Tomate', 'Légumes', 'Épices'],
      commandesJour: 12
    },
    {
      id: 'P3', nom: 'Nems Poulet', categorie: 'Entrées', prix: 2000,
      description: 'Nems croustillants au poulet et légumes, sauce nuoc-mâm',
      icone: '🥟', tempsPreparation: 15, disponible: true,
      ingredients: ['Poulet', 'Galette de riz', 'Carotte', 'Champignon'],
      commandesJour: 20
    },
    {
      id: 'P4', nom: 'Salade César', categorie: 'Entrées', prix: 2500,
      description: 'Salade romaine, poulet grillé, parmesan et croûtons',
      icone: '🥗', tempsPreparation: 10, disponible: true,
      ingredients: ['Salade', 'Poulet', 'Parmesan', 'Croûtons', 'Sauce César'],
      commandesJour: 18
    },
    {
      id: 'P5', nom: 'Mafé Poulet', categorie: 'Plats', prix: 3500,
      description: 'Poulet mijoté dans une sauce arachide onctueuse',
      icone: '🍛', tempsPreparation: 30, disponible: true,
      ingredients: ['Poulet', 'Pâte d\'arachide', 'Tomate', 'Patate douce'],
      commandesJour: 10
    },
    {
      id: 'P6', nom: 'Poisson Grillé', categorie: 'Plats', prix: 4500,
      description: 'Poisson entier grillé, marinade aux herbes, légumes sautés',
      icone: '🐟', tempsPreparation: 25, disponible: false,
      ingredients: ['Poisson', 'Herbes', 'Citron', 'Légumes'],
      commandesJour: 8
    },
    {
      id: 'P7', nom: 'Tiramisu Maison', categorie: 'Desserts', prix: 2000,
      description: 'Tiramisu au café et mascarpone fait maison',
      icone: '🍰', tempsPreparation: 20, disponible: true,
      ingredients: ['Mascarpone', 'Café', 'Biscuit', 'Cacao'],
      commandesJour: 14
    },
    {
      id: 'P8', nom: 'Jus Bissap', categorie: 'Boissons', prix: 800,
      description: 'Jus de bissap frais fait maison',
      icone: '🍷', tempsPreparation: 5, disponible: true,
      ingredients: ['Fleurs d\'hibiscus', 'Sucre', 'Menthe'],
      commandesJour: 25
    },
  ]);

  categories = signal<string[]>(['Entrées', 'Plats', 'Desserts', 'Boissons', 'Accompagnements']);

  showFormPlat = signal(false);
  showFormCategorie = signal(false);
  filtreCategorie = signal<string>('Tout');
  newCategorie = signal('');
  newPlat = signal({
    nom: '', categorie: '', prix: 0, description: '',
    icone: '🍽️', tempsPreparation: 15, ingredientsInput: ''
  });

  // ── Computed Menu ───────────────────────────────────
  produitsFiltres = computed(() => {
    const cat = this.filtreCategorie();
    return cat === 'Tout'
      ? this.produits()
      : this.produits().filter(p => p.categorie === cat);
  });

  produitsDisponibles = computed(() =>
    this.produits().filter(p => p.disponible).length
  );

  setNewPlatField(field: string, value: any) {
    this.newPlat.update(current => ({
      ...current,
      [field]: value
    }));
  }

  platsPopulaires = computed(() =>
    this.produits().filter(p => p.commandesJour > 10).length
  );

  produitsParCategorie(cat: string): number {
    return this.produits().filter(p => p.categorie === cat).length;
  }

  // ── Méthodes Menu ───────────────────────────────────
  setFiltreCategorie(cat: string) {
    this.filtreCategorie.set(cat);
  }

  toggleDisponibilite(p: PlatMenu) {
    this.produits.update(list =>
      list.map(plat =>
        plat.id === p.id ? { ...plat, disponible: !plat.disponible } : plat
      )
    );
  }

  ajouterPlat() {
    const p = this.newPlat();
    if (!p.nom || !p.categorie || !p.prix) {
      alert('Veuillez remplir les champs obligatoires (*)');
      return;
    }

    const ingredients = p.ingredientsInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    this.produits.update(list => [...list, {
      id: 'P' + Date.now(),
      nom: p.nom,
      categorie: p.categorie,
      prix: p.prix,
      description: p.description,
      icone: p.icone || '🍽️',
      tempsPreparation: p.tempsPreparation || 15,
      disponible: true,
      ingredients: ingredients,
      commandesJour: 0
    }]);

    this.showFormPlat.set(false);
    this.newPlat.set({
      nom: '', categorie: '', prix: 0, description: '',
      icone: '🍽️', tempsPreparation: 15, ingredientsInput: ''
    });
  }

  ajouterCategorie() {
    const cat = this.newCategorie();
    if (!cat.trim()) return;

    this.categories.update(list => [...list, cat.trim()]);
    this.showFormCategorie.set(false);
    this.newCategorie.set('');
  }

  supprimerPlat(id: string) {
    if (confirm('Supprimer ce plat du menu ?')) {
      this.produits.update(list => list.filter(p => p.id !== id));
    }
  }

  fmtCFA(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}