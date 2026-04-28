import { Component, computed, inject, input, signal } from '@angular/core';
import { DataService } from '../../../../shared/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-list-component.html',
  styleUrl: './stock-list-component.css',
})
export class StockListComponent {


  protected readonly Math = Math;
  ds = inject(DataService);

  // Données reçues du parent ou d'un service
  produits = input<any[]>([]);
  nbAlerteStock = input<number>(0);

  // Recherche
  stockSearch = signal('');

  // Produits filtrés


  stockFiltre = computed(() =>
    this.ds.produits
      .filter(p => p.nom.toLowerCase().includes(this.stockSearch().toLowerCase()))
      .sort((a, b) => a.stock - b.stock)
  );


  // Helpers
  stockCls(s: number): string {
    return s === 0 ? 'danger' : s < 10 ? 'warning' : 'ok';
  }

  stockLabel(s: number): string {
    return s === 0 ? 'Rupture' : s < 10 ? 'Faible' : 'OK';
  }

  fmtCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
