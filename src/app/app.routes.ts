import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'vendeur',
    loadChildren: () =>
      import('./features/vendeur/vendeur.routes').then(m => m.VENDEUR_ROUTES)
  },

  {
    path: 'gerant',
    loadChildren: () =>
      import('./features/gerant/gerant.routes')
        .then(m => m.GERANT_ROUTES)
  },

  {
    path: 'proprietaire',
    loadChildren: () =>
      import('./features/proprietaire/proprietaire.routes')
        .then(m => m.PROPRIETAIRE_ROUTES)
  },

  {
    path: 'referentiels',
    loadChildren: () =>
      import('./features/produit/produit.routes')
        .then(m => m.PRODUCT_ROUTES)
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES)
  },

];

export default routes;
