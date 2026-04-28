import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';



export interface NavItem {
  id: string;
  route: string;
  label: string;
  icon: string;
  badge?: string;
}



@Component({
  selector: 'app-side-bar-proprietaire-component',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-bar-proprietaire-component.html',
  styleUrl: './side-bar-proprietaire-component.css',
})
export class SideBarProprietaireComponent {

  collapsed = input.required<boolean>();
  open = input.required<boolean>();

  toggleCollapse = output<void>();
  close = output<void>();

  readonly router = inject(Router);

  /*
  readonly navItems: NavItem[] = [
    { id: 'dashboard', route: '/proprietaire/dashboard', label: "Vue d'ensemble", icon: '📊' },
    { id: 'boulangeries', route: '/proprietaire/boulangeries', label: 'Mes boulangeries', icon: '🏪', badge: '4' },
    { id: 'comptes', route: '/proprietaire/comptes', label: 'Comptes gérants', icon: '👤', badge: '4' },
    { id: 'approvisionnements', route: '/proprietaire/approvisionnements', label: 'Approvisionnements', icon: '📦' },
    { id: 'commandes', route: '/proprietaire/commandes', label: 'Commandes', icon: '📦' },
  ];*/

  readonly navItems: NavItem[] = [
    { id: 'dashboard', route: '/proprietaire/dashboard', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'finances', route: '/proprietaire/finances', label: 'Finances', icon: '💰' },
    { id: 'ventes', route: '/proprietaire/ventes', label: 'Ventes', icon: '🧾' },
    { id: 'commandes', route: '/proprietaire/commandes', label: 'Commandes', icon: '📋' },
    { id: 'stocks', route: '/proprietaire/stocks', label: 'Stocks', icon: '📦' },
    { id: 'menu', route: '/proprietaire/menu', label: 'Menu', icon: '📖' },
    { id: 'personnel', route: '/proprietaire/personnel', label: 'Personnel', icon: '👥', badge: '8' },
    { id: 'tables', route: '/proprietaire/tables', label: 'Tables', icon: '🪑', badge: '8' },
    { id: 'depenses', route: '/proprietaire/depenses', label: 'Dépenses', icon: '💸' },
    { id: 'rapports', route: '/proprietaire/rapports', label: 'Rapports', icon: '📈' },
    { id: 'parametres', route: '/proprietaire/parametres', label: 'Paramètres', icon: '⚙️' },
  ];

  // Statistiques du restaurant
  nbEmployes = signal(8);
  nbTables = signal(8);



  deconnecter(): void {
    this.router.navigate(['/auth/login']);
  }


}
