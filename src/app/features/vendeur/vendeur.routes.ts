import { Routes } from '@angular/router';
import { MainLayoutVendeurCompoment } from './components/main-layout-vendeur-compoment/main-layout-vendeur-compoment';

export const VENDEUR_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutVendeurCompoment,  // ✅ Le layout est ici
    children: [
      {
        path: 'caisse',
        loadComponent: () => import('./pages/caisse-component/caisse-component').then(m => m.CaisseComponent),
        title: 'Caisse'
      },
      {
        path: 'commandes',
        loadComponent: () => import('./pages/commande-du-jour-component/commande-du-jour-component').then(m => m.CommandeDuJourComponent),
        title: 'Commandes'
      },

      {
        path: 'stock',
        loadComponent: () => import('./pages/stock-list-component/stock-list-component').then(m => m.StockListComponent),
        title: 'Stocks'
      },
      {
        path: 'historique',
        loadComponent: () => import('./pages/mes-ventes-component/mes-ventes-component').then(m => m.MesVentesComponent),
        title: 'historique'
      },
      /*
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard-vendeur/dashboard-vendeur').then(m => m.DashboardVendeur),
        title: 'Dashboard'
      }, */
      /* Autres routes commentées... */

      {
        path: '',
        redirectTo: 'caisse',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-vendeur/dashboard-vendeur').then(m => m.DashboardVendeur),
    title: 'Dashboard'
  },
];