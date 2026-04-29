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
    { route: '/gerant/commandes', ico: '📋', label: 'Commandes' },
    { route: '/gerant/tables', ico: '🍽️', label: 'Tables' },
    { route: '/gerant/menu', ico: '📖', label: 'Menu' },
    { route: '/gerant/cuisine', ico: '👨‍🍳', label: 'Cuisine' },
    { route: '/gerant/stocks', ico: '📦', label: 'Stocks' },
    { route: '/gerant/ventes', ico: '💰', label: 'Ventes' },
    { route: '/gerant/livreurs', ico: '👷', label: 'Livreurs' },
    { route: '/gerant/personnels', ico: '👥', label: 'Personnel' },
    //  { route: '/gerant/depenses', ico: '💼', label: 'Dépenses' },
    //  { route: '/gerant/fournisseurs', ico: '🚛', label: 'Fournisseurs' },
  ];


  dateAuj = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  get sectionLabel(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Aperçu';
    if (url.includes('tables')) return 'Tables';
    if (url.includes('menu')) return 'Menu';
    if (url.includes('stocks')) return 'Stock';
    if (url.includes('ventes')) return 'Ventes';
    if (url.includes('commandes')) return 'Commandes';
    if (url.includes('cuisine')) return 'Cuisine';
    if (url.includes('livreurs')) return 'Livreurs';
    if (url.includes('personnels')) return 'Personnels';

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

