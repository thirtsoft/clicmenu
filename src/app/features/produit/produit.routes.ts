import { Routes } from '@angular/router';
import { CategorieList } from './pages/categorie-list/categorie-list';
import { ProduitList } from './pages/produit-list/produit-list';
import { Produit } from './pages/produit/produit';


export const PRODUCT_ROUTES: Routes = [

  {
    path: 'categories',
    component: CategorieList
  },
  {
    path: 'produits',
    component: ProduitList
  },
  {
    path: 'produit',
    component: Produit
  },

];
