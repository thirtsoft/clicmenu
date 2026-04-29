import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  route: string;
  ico: string;
  label: string;
}

@Component({
  selector: 'app-side-bar-gerant-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar-gerant-component.html',
  styleUrl: './side-bar-gerant-component.css',
})
export class SideBarGerantComponent {


  // ── Inputs depuis MainLayoutGerant ────────────────────
  collapsed = input<boolean>(false);
  open = input<boolean>(false);

  // ── Outputs vers MainLayoutGerant ────────────────────
  toggleCollapse = output<void>();
  close = output<void>();

  readonly router = inject(Router);

  /*
    nav: NavItem[] = [
      { route: '/gerant/dashboard', ico: '📊', label: 'Aperçu' },
      { route: '/gerant/livreurs', ico: '👷', label: 'Livreurs' },
      { route: '/gerant/livraisons', ico: '🚚', label: 'Livraisons' },
      { route: '/gerant/productions', ico: '🏭', label: 'Production' },
      { route: '/gerant/ventes', ico: '💰', label: 'Ventes' },
      { route: '/gerant/commandes', ico: '📦', label: 'Commandes' },
      { route: '/gerant/retours', ico: '🏪', label: 'Retours' },
      { route: '/gerant/personnels', ico: '👤', label: 'Personnels' },
      { route: '/gerant/depenses', ico: '💼', label: 'Dépenses' },
    ];*/

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

  isActive(route: string): boolean {
    const segment = route.split('/').pop() ?? '';
    return this.router.url.includes(segment);
  }

  naviguer(route: string): void {
    this.router.navigate([route]);
    this.close.emit();
  }

  deconnecter(): void {
    this.router.navigate(['/auth/login']);
  }

}