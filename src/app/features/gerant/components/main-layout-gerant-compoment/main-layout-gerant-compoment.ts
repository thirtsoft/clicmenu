import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideBarGerantComponent } from '../side-bar-gerant-component/side-bar-gerant-component';

interface NavItem {
  route: string;
  ico: string;
  label: string;
}

@Component({
  selector: 'app-main-layout-gerant-compoment',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideBarGerantComponent],
  templateUrl: './main-layout-gerant-compoment.html',
  styleUrl: './main-layout-gerant-compoment.css',
})
export class MainLayoutGerantCompoment {


  sidebarCollapsed = signal(false);
  sidebarOpen = signal(false);

  readonly router = inject(Router);

  nav: NavItem[] = [
    { route: '/gerant/dashboard', ico: '📊', label: 'Aperçu' },
    { route: '/gerant/livreurs', ico: '👷', label: 'Livreurs' },
    { route: '/gerant/livraison', ico: '🚚', label: 'Livraisons' },
    { route: '/gerant/production', ico: '🏭', label: 'Production' },
    { route: '/gerant/ventes', ico: '💰', label: 'Ventes' },
    { route: '/gerant/commandes', ico: '📦', label: 'Commandes' },
    { route: '/gerant/passser-une-commande', ico: '🏪', label: 'Passser une ommandes' },
    { route: '/gerant/retours', ico: '🏪', label: 'Retours' },
    { route: '/gerant/enregistrer-un-retour', ico: '🏪', label: 'Enregistrer un retour' },
    { route: '/gerant/personnels', ico: '👤', label: 'Personnels' },
    { route: '/gerant/depenses', ico: '💼', label: 'Dépenses' },
    { route: '/gerant/historique-commandes', ico: '📜', label: 'Historique commandes' },

  ];

  dateAuj = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  get sectionLabel(): string {
    const url = this.router.url;

    if (url.includes('historique-commandes')) return 'Historique commandes';
    if (url.includes('passser-une-commande')) return 'Passer une commande';
    if (url.includes('enregistrer-un-retour')) return 'Enregistrer un retour';

    if (url.includes('dashboard')) return 'Aperçu';
    if (url.includes('livreurs')) return 'Livreurs';
    if (url.includes('livraison')) return 'Livraisons';
    if (url.includes('production')) return 'Production';
    if (url.includes('ventes')) return 'Ventes';
    if (url.includes('commandes')) return 'Commandes';
    if (url.includes('retours')) return 'Retours';
    if (url.includes('personnels')) return 'Personnels';
    if (url.includes('depenses')) return 'Dépenses';

    return 'Gérant';
  }

  isActive(route: string): boolean {
    const segment = route.split('/').pop() ?? '';
    return this.router.url.includes(segment);
  }

  naviguer(route: string): void {
    this.router.navigate([route]);
  }

  onToggleCollapse(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  onSidebarClose(): void {
    this.sidebarOpen.set(false);
  }
}

