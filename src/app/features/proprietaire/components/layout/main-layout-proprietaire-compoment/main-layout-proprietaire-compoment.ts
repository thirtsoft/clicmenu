import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideBarProprietaireComponent } from '../side-bar-proprietaire-component/side-bar-proprietaire-component';

interface NavItem {
  route: string;
  ico: string;
  label: string;
}

@Component({
  selector: 'app-main-layout-proprietaire-compoment',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideBarProprietaireComponent],
  templateUrl: './main-layout-proprietaire-compoment.html',
  styleUrl: './main-layout-proprietaire-compoment.css',
})
export class MainLayoutProprietaireCompoment {


  readonly router = inject(Router);

  sidebarCollapsed = signal(false);
  sidebarOpen = signal(false);
  today = new Date();

  readonly todayStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });


  nav: NavItem[] = [
    { route: '/proprietaire/dashboard', ico: '📊', label: "Vue d'ensemble" },
    { route: '/proprietaire/boulangeries', ico: '🏪', label: 'Mes boulangeries' },
    { route: '/proprietaire/comptes', ico: '👤', label: 'Comptes gérants' },
    { route: '/proprietaire/approvisionnements', ico: '📦', label: 'Approvisionnements' },
    { route: '/proprietaire/commandes', ico: '📦', label: 'Commandes' },
    { route: '/proprietaire/historique-commandes', ico: '📜', label: 'Historique commandes' },

  ];

  get sectionLabel(): string {
    const url = this.router.url;

    if (url.includes('historique-commandes')) return 'Historique commandes';


    if (url.includes('dashboard')) return 'Aperçu';
    if (url.includes('boulangeries')) return 'Mes boulangeries';
    if (url.includes('comptes')) return 'Comptes gérants';
    if (url.includes('approvisionnements')) return 'Approvisionnements';
    if (url.includes('commandes')) return 'Commandes';
    return "Vue d'ensemble";
  }

  /*

  getCurrentSection(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return "Vue d'ensemble";
    if (url.includes('boulangeries')) return 'Mes boulangeries';
    if (url.includes('comptes')) return 'Comptes gérants';
    if (url.includes('approvisionnements')) return 'Approvisionnement';
    if (url.includes('commandes')) return 'Commandes';
    if (url.includes('investissements')) return 'Investissements';
    if (url.includes('depenses')) return 'Depenses';
    return "Vue d'ensemble";
  }*/

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
