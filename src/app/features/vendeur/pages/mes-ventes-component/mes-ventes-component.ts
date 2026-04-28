import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ModePaiement = 'especes' | 'carte' | 'mobile';
type FiltreHisto = 'tout' | 'ok' | 'annule';

interface VenteHisto {
  id: string;
  date: Date;
  articles: number;
  total: number;
  mode: ModePaiement;
  statut: 'ok' | 'annule';
}

@Component({
  selector: 'app-mes-ventes-component',
   imports: [CommonModule, FormsModule],
  templateUrl: './mes-ventes-component.html',
  styleUrl: './mes-ventes-component.css',
})
export class MesVentesComponent {

 // historique = input<VenteHisto[]>([]);

  // Filtre actif
//  filtreHisto = signal<FiltreHisto>('tout');

  //

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

  nbEspeces      = computed(() => this.historique().filter(v => v.mode==='especes').length);
  nbCarte        = computed(() => this.historique().filter(v => v.mode==='carte').length);
  nbMobile       = computed(() => this.historique().filter(v => v.mode==='mobile').length);
  pctEspeces     = computed(() => Math.round(this.nbEspeces()  / this.historique().length * 100));
  pctCarte       = computed(() => Math.round(this.nbCarte()    / this.historique().length * 100));
  pctMobile      = computed(() => Math.round(this.nbMobile()   / this.historique().length * 100));

  //

  // Computed values

  // Méthodes
  setFiltreHisto(val: FiltreHisto) {
    this.filtreHisto.set(val);
  }

  modeIco(m: ModePaiement): string {
    return { especes: '💵', carte: '💳', mobile: '📱' }[m];
  }

  modeLabel(m: ModePaiement): string {
    return { especes: 'Espèces', carte: 'Carte', mobile: 'Mobile' }[m];
  }

  fmtCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
