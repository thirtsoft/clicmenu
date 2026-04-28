import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../shared/data.service';
import { LigneCommande, Produit } from '../../../../core/models';

type Categorie = 'Tout' | 'Pain' | 'Viennoiserie' | 'Pâtisserie' | 'Snacking' | 'Boissons';
type ModePaiement = 'especes' | 'carte' | 'mobile';
type VueVendeur = 'caisse' | 'commandes' | 'stock' | 'historique';

type FiltreHisto  = 'tout' | 'ok' | 'annule';

interface VenteHisto {
  id: string; date: Date; articles: number;
  total: number; mode: ModePaiement; statut: 'ok' | 'annule';
}

//interface LigneCommande { produit: Produit; quantite: number; sousTotal: number; }
interface VenteHisto {
  id: string; date: Date; articles: number;
  total: number; mode: ModePaiement; statut: 'ok' | 'annule';
}

@Component({
  selector: 'app-dashboard-vendeur',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './dashboard-vendeur.html',
  styleUrl: './dashboard-vendeur.css',
})
export class DashboardVendeur {

  protected readonly Math = Math;
  ds = inject(DataService);

  // ── Navigation ──────────────────────────────────────────
  vue         = signal<VueVendeur>('caisse');
  sidebarOpen = signal(false);
  panierOpen  = signal(false);

  nav = [
    { id: 'caisse'     as VueVendeur, ico: '🏪', label: 'Caisse'    },
    { id: 'commandes'  as VueVendeur, ico: '📋', label: 'Commandes' },
    { id: 'stock'      as VueVendeur, ico: '📦', label: 'Stock'      },
    { id: 'historique' as VueVendeur, ico: '📊', label: 'Historique' },
  ];

  naviguer(id: VueVendeur) {
    this.vue.set(id);
    this.sidebarOpen.set(false);
  }

  // ── POS ─────────────────────────────────────────────────
  categories    = ['Tout','Pain','Viennoiserie','Pâtisserie','Snacking','Boissons'];
  modesPaiement = [
    { id: 'especes' as ModePaiement, label: 'Espèces', ico: '💵' },
    { id: 'carte'   as ModePaiement, label: 'Carte',   ico: '💳' },
    { id: 'mobile'  as ModePaiement, label: 'Mobile',  ico: '📱' },
  ];

  catActive   = signal('Tout');
  search      = signal('');
  panier      = signal<LigneCommande[]>([]);
  modePay     = signal<ModePaiement>('especes');
  showModal   = signal(false);
  flashSucces = signal(false);

  heure = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  produitsFiltres = computed(() =>
    this.ds.produits.filter(p =>
      (this.catActive() === 'Tout' || p.categorie === this.catActive()) &&
      p.nom.toLowerCase().includes(this.search().toLowerCase())
    )
  );

  total      = computed(() => this.panier().reduce((s, l) => s + l.sousTotal, 0));
  nbArticles = computed(() => this.panier().reduce((s, l) => s + l.quantite, 0));
  totalTTC   = computed(() => Math.round(this.total() * 1.18));

  // ── KPIs jour ───────────────────────────────────────────
  ventesJour    = signal(137500);
  commandesJour = signal(42);
  clientsJour   = signal(38);

  // ── Historique ──────────────────────────────────────────
  historique = signal<VenteHisto[]>([
    { id:'V001', date:new Date(Date.now()-3600000*1),   articles:4, total:3850,  mode:'especes', statut:'ok'     },
    { id:'V002', date:new Date(Date.now()-3600000*1.5), articles:2, total:1400,  mode:'carte',   statut:'ok'     },
    { id:'V003', date:new Date(Date.now()-3600000*2),   articles:7, total:6200,  mode:'mobile',  statut:'ok'     },
    { id:'V004', date:new Date(Date.now()-3600000*2.5), articles:1, total:350,   mode:'especes', statut:'annule' },
    { id:'V005', date:new Date(Date.now()-3600000*3),   articles:3, total:2750,  mode:'especes', statut:'ok'     },
    { id:'V006', date:new Date(Date.now()-3600000*3.5), articles:5, total:4100,  mode:'carte',   statut:'ok'     },
    { id:'V007', date:new Date(Date.now()-3600000*4),   articles:2, total:1800,  mode:'mobile',  statut:'ok'     },
    { id:'V008', date:new Date(Date.now()-3600000*4.5), articles:6, total:5400,  mode:'especes', statut:'ok'     },
    { id:'V009', date:new Date(Date.now()-3600000*5),   articles:1, total:700,   mode:'carte',   statut:'ok'     },
    { id:'V010', date:new Date(Date.now()-3600000*5.5), articles:3, total:2100,  mode:'especes', statut:'annule' },
    { id:'V011', date:new Date(Date.now()-3600000*6),   articles:8, total:9200,  mode:'mobile',  statut:'ok'     },
    { id:'V012', date:new Date(Date.now()-3600000*6.5), articles:4, total:3200,  mode:'carte',   statut:'ok'     },
  ]);

  filtreHisto = signal<FiltreHisto>('tout');

  // ── Computed (jamais de .filter() dans le template) ─────
  histoFiltre    = computed(() => {
    const f = this.filtreHisto();
    return f === 'tout' ? this.historique() : this.historique().filter(v => v.statut === f);
  });
  totalEncaisse  = computed(() => this.historique().filter(v => v.statut==='ok').reduce((s,v) => s+v.total, 0));
  nbVentes       = computed(() => this.historique().filter(v => v.statut==='ok').length);
  nbAnnules      = computed(() => this.historique().filter(v => v.statut==='annule').length);
  panierMoyen    = computed(() => this.nbVentes() ? Math.round(this.totalEncaisse()/this.nbVentes()) : 0);
  nbAlerteStock  = computed(() => this.ds.produits.filter(p => p.stock < 10).length);
  nbEspeces      = computed(() => this.historique().filter(v => v.mode==='especes').length);
  nbCarte        = computed(() => this.historique().filter(v => v.mode==='carte').length);
  nbMobile       = computed(() => this.historique().filter(v => v.mode==='mobile').length);
  pctEspeces     = computed(() => Math.round(this.nbEspeces()  / this.historique().length * 100));
  pctCarte       = computed(() => Math.round(this.nbCarte()    / this.historique().length * 100));
  pctMobile      = computed(() => Math.round(this.nbMobile()   / this.historique().length * 100));
  cmdAnnulees    = computed(() => this.commandesJour() - this.nbAnnules());

  stockFiltre = computed(() =>
    this.ds.produits
      .filter(p => p.nom.toLowerCase().includes(this.stockSearch().toLowerCase()))
      .sort((a, b) => a.stock - b.stock)
  );

  stockSearch = signal('');

  // ── Helpers ─────────────────────────────────────────────
  setFiltreHisto(val: FiltreHisto) { this.filtreHisto.set(val); }

  addProduit(p: Produit) {
    if (p.stock === 0) return;
    this.panier.update(lines => {
      const ex = lines.find(l => l.produit.id === p.id);
      if (ex) return lines.map(l => l.produit.id === p.id
        ? { ...l, quantite: l.quantite+1, sousTotal: (l.quantite+1)*p.prix } : l);
      return [...lines, { produit: p, quantite: 1, sousTotal: p.prix }];
    });
  }

  changeQty(id: string, delta: number) {
    this.panier.update(lines => {
      const l = lines.find(l => l.produit.id === id);
      if (!l) return lines;
      const nq = l.quantite + delta;
      return nq <= 0
        ? lines.filter(l => l.produit.id !== id)
        : lines.map(l => l.produit.id === id ? { ...l, quantite: nq, sousTotal: nq*l.produit.prix } : l);
    });
  }

  viderPanier() { this.panier.set([]); this.panierOpen.set(false); }
  encaisser()   { if (this.panier().length) this.showModal.set(true); }
  fermerModal() { this.showModal.set(false); }

  valider() {
    const v: VenteHisto = {
      id: 'V' + String(this.historique().length+1).padStart(3,'0'),
      date: new Date(), articles: this.nbArticles(),
      total: this.total(), mode: this.modePay(), statut: 'ok'
    };
    this.historique.update(h => [v, ...h]);
    this.ventesJour.update(n => n + this.total());
    this.commandesJour.update(n => n + 1);
    this.panier.set([]);
    this.showModal.set(false);
    this.panierOpen.set(false);
    this.flashSucces.set(true);
    setTimeout(() => this.flashSucces.set(false), 3000);
  }

  qtyDansPanier(id: string)  { return this.panier().find(l => l.produit.id === id)?.quantite ?? 0; }
  stockCls(s: number)         { return s === 0 ? 'danger' : s < 10 ? 'warning' : 'ok'; }
  stockLabel(s: number)       { return s === 0 ? 'Rupture' : s < 10 ? 'Faible' : 'OK'; }
  modeIco(m: ModePaiement)    { return { especes:'💵', carte:'💳', mobile:'📱' }[m]; }
  modeLabel(m: ModePaiement)  { return { especes:'Espèces', carte:'Carte', mobile:'Mobile' }[m]; }
  fmtCFA(n: number) { return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'; }
}