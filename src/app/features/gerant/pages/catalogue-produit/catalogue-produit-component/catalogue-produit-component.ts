import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogue-produit-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogue-produit-component.html',
  styleUrl: './catalogue-produit-component.css',
})
export class CatalogueProduitComponent {


  produits = input.required<any[]>();
  categories = input.required<string[]>();
  categorieActive = input.required<string>();
  searchTerm = input.required<string>();
  
  categorieChange = output<string>();
  searchChange = output<string>();
  ajouterAuPanier = output<any>();
  getQuantitePanier = input.required<(id: string) => number>();

  formatCFA(prix: number): string {
    if (prix >= 1_000_000) {
      return (prix / 1_000_000).toFixed(1) + 'M FCFA';
    } else if (prix >= 1_000) {
      return (prix / 1_000).toFixed(0) + 'k FCFA';
    }
    return prix + ' FCFA';
  }
}
