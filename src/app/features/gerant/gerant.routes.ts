
import { Routes } from '@angular/router';
import { MainLayoutGerantCompoment } from './components/main-layout-gerant-compoment/main-layout-gerant-compoment';
import { DashboardGerant } from './pages/dashboard-gerant/dashboard-gerant';

export const GERANT_ROUTES: Routes = [
  {
    path: 'dashboard-gerant',
    component: DashboardGerant
  },
  {
    path: '',
    component: MainLayoutGerantCompoment,
    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard-gerant-component/dashboard-gerant-component')
            .then(m => m.DashboardGerantComponent),
        title: 'Aperçu — Gérant',
      },

      {
        path: 'livreurs',
        loadComponent: () =>
          import('./pages/livreur-list-component/livreur-list-component')
            .then(m => m.LivreurListComponent),
        title: 'Livreurs',
      },

      {
        path: 'livraisons',
        loadComponent: () =>
          import('./pages/livraison-list-component/livraison-list-component')
            .then(m => m.LivraisonListComponent),
        title: 'Livraisons',
      },

      {
        path: 'tables',
        loadComponent: () =>
          import('./pages/tables-list-component/tables-list-component')
            .then(m => m.TablesListComponent),
        title: 'Tables',
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./pages/menu-list-component/menu-list-component')
            .then(m => m.MenuListComponent),
        title: 'Menu',
      },

      {
        path: 'cuisine',
        loadComponent: () =>
          import('./pages/cuisine-list-component/cuisine-list-component')
            .then(m => m.CuisineListComponent),
        title: 'Cuisine',
      },

      {
        path: 'stocks',
        loadComponent: () =>
          import('./pages/stock-list-component/stock-list-component')
            .then(m => m.StockListComponent),
        title: 'Stock',
      },

      {
        path: 'productions',
        loadComponent: () =>
          import('./pages/production-list-component/production-list-component')
            .then(m => m.ProductionListComponent),
        title: 'Production',
      },

      {
        path: 'ventes',
        loadComponent: () =>
          import('./pages/vente-list-component/vente-list-component')
            .then(m => m.VenteListComponent),
        title: 'Ventes',
      },

      {
        path: 'commandes',
        loadComponent: () =>
          import('./pages/commande-list-component/commande-list-component')
            .then(m => m.CommandeListComponent),
        title: 'Commandes',
      },

      {
        path: 'passser-une-commande',
        loadComponent: () =>
          import('./pages/passer-une-commande-component/passer-une-commande-component')
            .then(m => m.PasserUneCommandeComponent),
        title: 'Passer une commande',
      },

      {
        path: 'historique-commandes',
        loadComponent: () =>
          import('./pages/commande/historique-commandes-component/historique-commandes-component')
            .then(m => m.HistoriqueCommandesComponent),
        title: 'Historique des commandes',
      },

      {
        path: 'retours',
        loadComponent: () =>
          import('./pages/retour-commande-list-component/retour-commande-list-component')
            .then(m => m.RetourCommandeListComponent),
        title: 'Retours',
      },

      {
        path: 'enregistrer-un-retour',
        loadComponent: () =>
          import('./pages/enregistrer-un-retour-component/enregistrer-un-retour-component')
            .then(m => m.EnregistrerUnRetourComponent),
        title: 'Retours',
      },


      {
        path: 'personnels',
        loadComponent: () =>
          import('./pages/compte-agent-local-list-component/compte-agent-local-list-component')
            .then(m => m.CompteAgentLocalListComponent),
        title: 'Personnels',
      },

      {
        path: 'depenses',
        loadComponent: () =>
          import('./pages/depense-list-component/depense-list-component')
            .then(m => m.DepenseListComponent),
        title: 'Dépenses',
      },

      // ── Redirection par défaut ────────────────────────
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

