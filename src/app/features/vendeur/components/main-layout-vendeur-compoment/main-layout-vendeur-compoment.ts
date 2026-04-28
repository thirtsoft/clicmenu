import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SideBarVendeurComponent } from '../side-bar-vendeur-component/side-bar-vendeur-component';


//export type VueVendeur = 'caisse' | 'commandes' | 'stock' | 'historique' | 'dashboard' | 'deconnexion';
export type VueVendeur = 'caisse' | 'commandes' | 'stock' | 'historique';


@Component({
  selector: 'app-main-layout-vendeur-compoment',
  standalone: true,
  imports: [CommonModule, RouterModule, SideBarVendeurComponent],
  templateUrl: './main-layout-vendeur-compoment.html',
  styleUrl: './main-layout-vendeur-compoment.css',
})
export class MainLayoutVendeurCompoment implements OnInit {


  private router = inject(Router);

  sidebarOpen = signal(false);
  vueActive = signal<VueVendeur>('caisse');
  ventesJour = signal(137500);
  commandesJour = signal(42);
  clientsJour = signal(38);
  heure = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  navMobilesItems = [
    { id: 'caisse', ico: '🏪', label: 'Caisse' },
    { id: 'commandes', ico: '📋', label: 'Commandes' },
    { id: 'stock', ico: '📦', label: 'Stock' },
    { id: 'historique', ico: '📊', label: 'Mes ventes' },
  ];


  ngOnInit() {
    // Synchroniser avec l'URL au chargement
    this.updateActiveVueFromUrl(this.router.url);

    // Écouter les changements d'URL
    this.router.events.subscribe(() => {
      this.updateActiveVueFromUrl(this.router.url);
    });
  }

  private updateActiveVueFromUrl(url: string) {
    if (url.includes('/caisse')) this.vueActive.set('caisse');
    //  else if (url.includes('/dashboard')) this.vueActive.set('dashboard');
    else if (url.includes('/commandes')) this.vueActive.set('commandes');
    else if (url.includes('/stock')) this.vueActive.set('stock');
    else if (url.includes('/historique')) this.vueActive.set('historique');
  }

  naviguer(id: any) {
    console.log("IDDD is", id);
    this.vueActive.set(id);
    this.sidebarOpen.set(false);
    this.router.navigate([`/vendeur/${id}`]);
  }

  fmtCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  deconnecter(): void {
    this.router.navigate(['/auth/login']);
  }



}
