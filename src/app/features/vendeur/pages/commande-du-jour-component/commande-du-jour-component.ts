import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LigneCommande, Produit } from '../../../../core/models';
import { DataService } from '../../../../shared/data.service';


type Categorie = 'Tout' | 'Pain' | 'Viennoiserie' | 'Pâtisserie' | 'Snacking' | 'Boissons';
type ModePaiement = 'especes' | 'carte' | 'mobile';
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


interface VenteHisto {
  id: string;
  date: Date;
  articles: number;
  total: number;
  mode: ModePaiement;
  statut: 'ok' | 'annule';
}


@Component({
  selector: 'app-commande-du-jour-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-du-jour-component.html',
  styleUrl: './commande-du-jour-component.css',
})
export class CommandeDuJourComponent {


  ds = inject(DataService);

  // Données reçues du parent ou d'un service
  commandesJour = input<number>(42);
  ventesJour = input<number>(137500);
  //  historique = input<VenteHisto[]>([]);
  flashSucces = input<boolean>(false);

  // ── Historique ──────────────────────────────────────────
  historique = signal<VenteHisto[]>([
    { id: 'V001', date: new Date(Date.now() - 3600000 * 1), articles: 4, total: 3850, mode: 'especes', statut: 'ok' },
    { id: 'V002', date: new Date(Date.now() - 3600000 * 1.5), articles: 2, total: 1400, mode: 'carte', statut: 'ok' },
    { id: 'V003', date: new Date(Date.now() - 3600000 * 2), articles: 7, total: 6200, mode: 'mobile', statut: 'ok' },
    { id: 'V004', date: new Date(Date.now() - 3600000 * 2.5), articles: 1, total: 350, mode: 'especes', statut: 'annule' },
    { id: 'V005', date: new Date(Date.now() - 3600000 * 3), articles: 3, total: 2750, mode: 'especes', statut: 'ok' },
    { id: 'V006', date: new Date(Date.now() - 3600000 * 3.5), articles: 5, total: 4100, mode: 'carte', statut: 'ok' },
    { id: 'V007', date: new Date(Date.now() - 3600000 * 4), articles: 2, total: 1800, mode: 'mobile', statut: 'ok' },
    { id: 'V008', date: new Date(Date.now() - 3600000 * 4.5), articles: 6, total: 5400, mode: 'especes', statut: 'ok' },
    { id: 'V009', date: new Date(Date.now() - 3600000 * 5), articles: 1, total: 700, mode: 'carte', statut: 'ok' },
    { id: 'V010', date: new Date(Date.now() - 3600000 * 5.5), articles: 3, total: 2100, mode: 'especes', statut: 'annule' },
    { id: 'V011', date: new Date(Date.now() - 3600000 * 6), articles: 8, total: 9200, mode: 'mobile', statut: 'ok' },
    { id: 'V012', date: new Date(Date.now() - 3600000 * 6.5), articles: 4, total: 3200, mode: 'carte', statut: 'ok' },
  ]);

  filtreHisto = signal<FiltreHisto>('tout');


  // Calculs
  nbAnnules = computed(() =>
    this.historique().filter(v => v.statut === 'annule').length
  );

  cmdAnnulees = computed(() =>
    this.commandesJour() - this.nbAnnules()
  );

  // Helpers
  modeIco(m: ModePaiement): string {
    return { especes: '💵', carte: '💳', mobile: '📱' }[m];
  }

  fmtCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

}
