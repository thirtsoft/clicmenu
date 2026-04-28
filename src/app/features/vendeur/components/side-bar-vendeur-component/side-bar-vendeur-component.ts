import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
//export type VueVendeur = 'caisse' | 'dashboard' | 'commandes' | 'stock' | 'historique' | 'deconnexion';
export type VueVendeur = 'caisse' | 'commandes' | 'stock' | 'historique';

export interface NavItem {
  id: VueVendeur;
  ico: string;
  label: string;
}

@Component({
  selector: 'app-side-bar-vendeur-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar-vendeur-component.html',
  styleUrl: './side-bar-vendeur-component.css',
})
export class SideBarVendeurComponent {

  readonly router = inject(Router);

  isOpen = input<boolean>(false);
  vueActive = input<VueVendeur>('caisse');
  navItems = input<NavItem[]>([
    { id: 'caisse', ico: '🏪', label: 'Caisse' },
    { id: 'commandes', ico: '📋', label: 'Commandes' },
    { id: 'stock', ico: '📖', label: 'Menu du jour' },
    { id: 'historique', ico: '📊', label: 'Mes ventes' },
  ]);

  // KPIs en entrée
  ventesJour = input<number>(0);
  commandesJour = input<number>(0);
  clientsJour = input<number>(0);

  close = output<void>();
  navigate = output<VueVendeur>();

  fmtCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  deconnecter(): void {
    console.log('Start')
    this.router.navigate(['/auth/login']);
  }


}
