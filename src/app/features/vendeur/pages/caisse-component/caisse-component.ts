import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LigneCommande, Produit } from '../../../../core/models';
import { DataService } from '../../../../shared/data.service';


type VueVendeur = 'caisse' | 'commandes' | 'stock' | 'historique';

type FiltreHisto = 'tout' | 'ok' | 'annule';

interface VenteHisto {
  id: string; date: Date; articles: number;
  total: number; mode: ModePaiement; statut: 'ok' | 'annule';
}

//interface LigneCommande { produit: Produit; quantite: number; sousTotal: number; }
interface VenteHisto {
  id: string; date: Date; articles: number;
  total: number; mode: ModePaiement; statut: 'ok' | 'annule';
}
type Categorie = 'Tout' | 'Entrées' | 'Plats' | 'Desserts' | 'Boissons' | 'Accompagnements';
type ModePaiement = 'especes' | 'carte' | 'mobile';

/*
interface VenteHisto {
  id: string; date: Date; articles: number;
  total: number; mode: ModePaiement; statut: 'ok' | 'annule';
}*/

type TypeVente = 'caisse' | 'table';

interface TableRestaurant {
  id: number;
  nom: string;
  active: boolean;
}

interface CommandeTable {
  tableId: number;
  lignes: LigneCommande[];
  nomClient: string;
  dateCreation: Date;
}

interface VenteHisto {
  id: string;
  date: Date;
  articles: number;
  total: number;
  mode: ModePaiement;
  statut: 'ok' | 'annule';
  typeVente: TypeVente;
  table?: number;
}


@Component({
  selector: 'app-caisse-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caisse-component.html',
  styleUrl: './caisse-component.css',
})
export class CaisseComponent {

  protected readonly Math = Math;
  ds = inject(DataService);

  panierOpen = signal(false);
  catActive = signal<Categorie>('Tout');
  search = signal('');
  panier = signal<LigneCommande[]>([]);
  modePay = signal<ModePaiement>('especes');
  showModal = signal(false);
  flashSucces = signal(false);

  typeVente = signal<TypeVente>('caisse');
  tableActive = signal<number | null>(null);
  nomClient = signal('');
  commandesTables = signal<CommandeTable[]>([]);
  //  commandesTables = signal<Record<number, CommandeTable>>({});

  categories: Categorie[] = ['Tout', 'Entrées', 'Plats', 'Desserts', 'Boissons', 'Accompagnements'];

  modesPaiement = [
    { id: 'especes' as ModePaiement, label: 'Espèces', ico: '💵' },
    { id: 'carte' as ModePaiement, label: 'Carte', ico: '💳' },
    { id: 'mobile' as ModePaiement, label: 'Mobile', ico: '📱' },
  ];

  // Tables disponibles dans le restaurant
  tables: TableRestaurant[] = [
    { id: 1, nom: 'Table 1', active: false },
    { id: 2, nom: 'Table 2', active: false },
    { id: 3, nom: 'Table 3', active: false },
    { id: 4, nom: 'Table 4', active: false },
    { id: 5, nom: 'Table 5', active: false },
    { id: 6, nom: 'Table 6', active: false },
    { id: 7, nom: 'Terrasse 1', active: false },
    { id: 8, nom: 'Terrasse 2', active: false },
  ];

  heure = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  produitsFiltres = computed(() =>
    this.ds.produits.filter(p =>
      (this.catActive() === 'Tout' || p.categorie === this.catActive()) &&
      p.nom.toLowerCase().includes(this.search().toLowerCase())
    )
  );

  total = computed(() => this.panier().reduce((s, l) => s + l.sousTotal, 0));
  nbArticles = computed(() => this.panier().reduce((s, l) => s + l.quantite, 0));
  totalTTC = computed(() => Math.round(this.total() * 1.18));

  historique = signal<VenteHisto[]>([]);

  // Tables actives (qui ont des commandes en cours)
  tablesActives = computed(() =>
    this.tables.map(t => ({
      ...t,
      active: this.commandesTables().some(ct => ct.tableId === t.id)
    }))
  );

  changerTypeVente(type: TypeVente) {
    this.sauvegarderPanierActuel();
    this.typeVente.set(type);
    if (type === 'caisse') {
      this.tableActive.set(null);
      const cmdDirecte = this.commandesTables()
        .find(ct => ct.tableId === 0);

      this.panier.set(cmdDirecte ? [...cmdDirecte.lignes] : []);
      return;
    }
  }

  selectTable(tableId: number) {
    this.sauvegarderPanierActuel();
    this.tableActive.set(tableId);
    const cmdExistante = this.commandesTables()
      .find(ct => ct.tableId === tableId);
    if (cmdExistante) {
      this.panier.set([...cmdExistante.lignes]);
      this.nomClient.set(cmdExistante.nomClient || '');
      return;
    }
    this.sauvegarderCommandeTable();
  }

  ajouterProduit(p: Produit) {
    if (p.stock === 0) return;

    if (this.typeVente() === 'table' && !this.tableActive()) {
      alert('Veuillez d\'abord sélectionner une table');
      return;
    }
    this.panier.update(lines => {
      const ex = lines.find(l => l.produit.id === p.id);
      if (ex) {
        return lines.map(l => l.produit.id === p.id
          ? { ...l, quantite: l.quantite + 1, sousTotal: (l.quantite + 1) * p.prix }
          : l);
      }
      return [...lines, { produit: p, quantite: 1, sousTotal: p.prix }];
    });
    this.sauvegarderCommandeTable();
  }

  changeQty(id: string, delta: number) {
    this.panier.update(lines => {
      const l = lines.find(l => l.produit.id === id);
      if (!l) return lines;
      const nq = l.quantite + delta;
      if (nq <= 0) {
        const newLines = lines.filter(l => l.produit.id !== id);
        this.panier.set(newLines);
        return newLines;
      }
      const newLines = lines.map(l => l.produit.id === id
        ? { ...l, quantite: nq, sousTotal: nq * l.produit.prix }
        : l);
      return newLines;
    });

    this.sauvegarderCommandeTable();
  }

  private sauvegarderCommandeTable() {
    if (this.typeVente() === 'table' && this.tableActive()) {
      this.commandesTables.update(cts => {
        const existante = cts.findIndex(ct => ct.tableId === this.tableActive());
        const nouvelleCommande: CommandeTable = {
          tableId: this.tableActive()!,
          lignes: [...this.panier()],
          nomClient: this.nomClient(),
          dateCreation: new Date()
        };

        if (existante >= 0) {
          const copy = [...cts];
          copy[existante] = nouvelleCommande;
          return copy;
        }
        return [...cts, nouvelleCommande];
      });
    }
  }

  viderPanier() {
    this.panier.set([]);
    this.panierOpen.set(false);
    if (this.typeVente() === 'table' && this.tableActive()) {
      this.commandesTables.update(cts =>
        cts.filter(ct => ct.tableId !== this.tableActive())
      );
    }
  }

  valider() {
    const v: VenteHisto = {
      id: 'V' + String(this.historique().length + 1).padStart(3, '0'),
      date: new Date(),
      articles: this.nbArticles(),
      total: this.total(),
      mode: this.modePay(),
      statut: 'ok',
      typeVente: this.typeVente(),
      table: this.typeVente() === 'table' ? this.tableActive()! : undefined
    };

    this.historique.update(h => [v, ...h]);

    // Nettoyer la commande table si c'est une vente table
    if (this.typeVente() === 'table' && this.tableActive()) {
      this.commandesTables.update(cts =>
        cts.filter(ct => ct.tableId !== this.tableActive())
      );
      this.tableActive.set(null);
      this.nomClient.set('');
    }

    this.panier.set([]);
    this.showModal.set(false);
    this.panierOpen.set(false);
    this.flashSucces.set(true);
    setTimeout(() => this.flashSucces.set(false), 3000);
  }


  //
  sauvegarderPanierActuel(): void {
    const tableId = this.typeVente() === 'caisse' ? 0 : this.tableActive();

    // Si pas de table sélectionnée, ne rien faire
    if (tableId === null || tableId === undefined) return;

    // Si le panier est vide, supprimer la commande
    if (this.panier().length === 0) {
      this.commandesTables.update(cts =>
        cts.filter(ct => ct.tableId !== tableId)
      );
      return;
    }

    // Sauvegarder ou mettre à jour
    this.commandesTables.update(cts => {
      const index = cts.findIndex(ct => ct.tableId === tableId);
      const commande: CommandeTable = {
        tableId: tableId,
        lignes: [...this.panier()],
        nomClient: this.nomClient(),
        dateCreation: new Date()
      };

      if (index >= 0) {
        const newCts = [...cts];
        newCts[index] = commande;
        return newCts;
      }
      return [...cts, commande];
    });
  }

  addProduit(p: Produit) {
    if (p.stock === 0) return;
    this.panier.update(lines => {
      const ex = lines.find(l => l.produit.id === p.id);
      if (ex) {
        return lines.map(l => l.produit.id === p.id
          ? { ...l, quantite: l.quantite + 1, sousTotal: (l.quantite + 1) * p.prix }
          : l);
      }
      return [...lines, { produit: p, quantite: 1, sousTotal: p.prix }];
    });
  }

  getTableNom(tableId: number): string {
    const table = this.tablesActives().find(t => t.id === tableId);
    return table ? table.nom : `Table ${tableId}`;
  }

  //  viderPanier() { this.panier.set([]); this.panierOpen.set(false); }
  encaisser() { if (this.panier().length) this.showModal.set(true); }
  fermerModal() { this.showModal.set(false); }

  qtyDansPanier(id: string) {
    return this.panier().find(l => l.produit.id === id)?.quantite ?? 0;
  }

  fmtCFA(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
