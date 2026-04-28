
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../shared/data.service';

type PeriodeType = 'jour' | 'semaine' | 'mois';

export type SectionType = 'apercu' | 'boulangeries' | 'gerants' | 'approvisionnement' | 'investissements';

export interface Boulangerie {
  id: string; nom: string; adresse: string; ville: string; telephone: string;
  gerantNom: string; statut: 'active' | 'ferme' | 'renovation'; dateOuverture: string;
  superficie: number; ventesJour: number; objectifJour: number; commandesJour: number;
  taux: number; tendance: 'hausse' | 'baisse' | 'stable';
}

export interface Gerant {
  id: string; nom: string; prenom: string; email: string; telephone: string;
  boulangerie: string; boulangerieId: string; dateEmbauche: string;
  statut: 'actif' | 'conge' | 'inactif'; photo: string;
}

export interface ProduitAppro {
  id: string; nom: string; categorie: string; unite: string; icone: string; prixUnitaire: number;
}

export interface LigneAppro {
  produit: ProduitAppro; boulangerieId: string; quantite: number; total: number;
}

export interface CommandeAppro {
  id: string; date: Date; fournisseur: string; lignes: LigneAppro[]; total: number;
  statut: 'en_attente' | 'livree' | 'partielle';
}

export interface Investissement {
  id: string; titre: string; categorie: string; montant: number; date: string;
  boulangerie: string; statut: 'planifie' | 'en_cours' | 'realise';
  retourEstime: number; description: string;
}


@Component({
  selector: 'app-investissement-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investissement-list-component.html',
  styleUrl: './investissement-list-component.css',
})
export class InvestissementListComponent {

  private dataService = inject(DataService);

  sectionActive = signal<SectionType>('investissements');
  sidebarCollapsed = signal(false);

  nav: { id: SectionType; label: string; icone: string; badge?: string }[] = [
    { id: 'apercu', label: "Vue d'ensemble", icone: '📊' },
    { id: 'boulangeries', label: 'Mes boulangeries', icone: '🏪', badge: '4' },
    { id: 'gerants', label: 'Comptes gérants', icone: '👤', badge: '4' },
    { id: 'approvisionnement', label: 'Approvisionnement', icone: '📦' },
    { id: 'investissements', label: 'Investissements', icone: '💼' },
  ];

  periode = signal<'jour' | 'semaine' | 'mois'>('jour');
  periodes = [
    { id: 'jour' as const, label: "Aujourd'hui" },
    { id: 'semaine' as const, label: 'Cette semaine' },
    { id: 'mois' as const, label: 'Ce mois' },
  ];

  // ── Boulangeries ──
  boulangeries = signal<Boulangerie[]>([
    { id: 'B1', nom: 'Rose — Plateau', adresse: 'Av. Pompidou', ville: 'Dakar', telephone: '+221 77 100 00 01', gerantNom: 'Moussa Diop', statut: 'active', dateOuverture: '2018-03-15', superficie: 120, ventesJour: 285000, objectifJour: 300000, commandesJour: 147, taux: 95, tendance: 'hausse' },
    { id: 'B2', nom: 'Rose — Almadies', adresse: 'Route des Almadies', ville: 'Dakar', telephone: '+221 77 100 00 02', gerantNom: 'Aminata Koné', statut: 'active', dateOuverture: '2019-07-01', superficie: 95, ventesJour: 198000, objectifJour: 250000, commandesJour: 98, taux: 79, tendance: 'stable' },
    { id: 'B3', nom: 'Rose — Mermoz', adresse: 'Rue 10, Mermoz', ville: 'Dakar', telephone: '+221 77 100 00 03', gerantNom: 'Oumar Thiaw', statut: 'active', dateOuverture: '2020-01-20', superficie: 110, ventesJour: 312000, objectifJour: 300000, commandesJour: 162, taux: 104, tendance: 'hausse' },
    { id: 'B4', nom: 'Rose — Ouakam', adresse: 'Av. des Mamelles', ville: 'Dakar', telephone: '+221 77 100 00 04', gerantNom: 'Fatou Ndiaye', statut: 'active', dateOuverture: '2022-05-10', superficie: 80, ventesJour: 142000, objectifJour: 200000, commandesJour: 73, taux: 71, tendance: 'baisse' },
  ]);

  activeBoulangeriesCount = computed(() => {
    return this.boulangeries().filter(i => i.statut === 'active').length;
  });


  showFormBoulangerie = signal(false);
  nouveauBoulangerie = signal({ nom: '', adresse: '', ville: 'Dakar', telephone: '', gerantNom: '', superficie: 0, objectifJour: 0 });

  // ── Gérants ──
  gerants = signal<Gerant[]>([
    { id: 'G1', nom: 'Diop', prenom: 'Moussa', email: 'moussa.diop@rose.sn', telephone: '+221 77 200 01 01', boulangerie: 'Rose — Plateau', boulangerieId: 'B1', dateEmbauche: '2018-03-15', statut: 'actif', photo: 'MD' },
    { id: 'G2', nom: 'Koné', prenom: 'Aminata', email: 'aminata.kone@rose.sn', telephone: '+221 77 200 02 02', boulangerie: 'Rose — Almadies', boulangerieId: 'B2', dateEmbauche: '2019-07-01', statut: 'actif', photo: 'AK' },
    { id: 'G3', nom: 'Thiaw', prenom: 'Oumar', email: 'oumar.thiaw@rose.sn', telephone: '+221 77 200 03 03', boulangerie: 'Rose — Mermoz', boulangerieId: 'B3', dateEmbauche: '2020-01-20', statut: 'conge', photo: 'OT' },
    { id: 'G4', nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou.ndiaye@rose.sn', telephone: '+221 77 200 04 04', boulangerie: 'Rose — Ouakam', boulangerieId: 'B4', dateEmbauche: '2022-05-10', statut: 'actif', photo: 'FN' },
  ]);

  actifGerantsCount = computed(() => {
    return this.gerants().filter(i => i.statut === 'actif').length;
  });

  congeGerantsCount = computed(() => {
    return this.gerants().filter(i => i.statut === 'conge').length;
  });

  showFormGerant = signal(false);

  nouveauGerant = signal({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    boulangerieId: '',
    dateEmbauche: ''
  });

  // Add this method
  updateGerantBoulangerieId(event: any) {
    if (this.nouveauGerant) {
      this.nouveauGerant.update(v => ({ ...v, boulangerieId: event }));
    }
  }

  // ── Appro ──
  produitsAppro: ProduitAppro[] = [
    { id: 'A1', nom: 'Farine T55', categorie: 'Matières premières', unite: 'kg', icone: '🌾', prixUnitaire: 650 },
    { id: 'A2', nom: 'Levure fraîche', categorie: 'Matières premières', unite: 'kg', icone: '🧫', prixUnitaire: 4500 },
    { id: 'A3', nom: 'Sel fin', categorie: 'Matières premières', unite: 'kg', icone: '🧂', prixUnitaire: 300 },
    { id: 'A4', nom: 'Sucre blanc', categorie: 'Matières premières', unite: 'kg', icone: '🍬', prixUnitaire: 700 },
    { id: 'A5', nom: 'Beurre 84%', categorie: 'Matières premières', unite: 'kg', icone: '🧈', prixUnitaire: 5200 },
    { id: 'A6', nom: 'Oeufs frais', categorie: 'Matières premières', unite: 'boîte', icone: '🥚', prixUnitaire: 3500 },
    { id: 'A7', nom: 'Lait entier', categorie: 'Matières premières', unite: 'L', icone: '🥛', prixUnitaire: 900 },
    { id: 'A8', nom: 'Chocolat pâtissier', categorie: 'Matières premières', unite: 'kg', icone: '🍫', prixUnitaire: 8000 },
    { id: 'A9', nom: 'Sacs kraft pain', categorie: 'Emballages', unite: 'lot', icone: '🛍️', prixUnitaire: 2500 },
    { id: 'A10', nom: 'Boîtes pâtisserie', categorie: 'Emballages', unite: 'lot', icone: '📦', prixUnitaire: 4000 },
    { id: 'A11', nom: 'Gaz butane 12kg', categorie: 'Énergie', unite: 'bout', icone: '🔥', prixUnitaire: 7500 },
    { id: 'A12', nom: 'Produit nettoyage', categorie: 'Hygiène', unite: 'L', icone: '🧹', prixUnitaire: 1200 },
  ];

  panierAppro = signal<LigneAppro[]>([]);
  boulangerieApproSelectee = signal('B1');
  categorieProduitAppro = signal('Tout');

  commandesAppro = signal<CommandeAppro[]>([
    { id: 'CA1', date: new Date(Date.now() - 86400000 * 2), fournisseur: 'Grands Moulins de Dakar', lignes: [], total: 385000, statut: 'livree' },
    { id: 'CA2', date: new Date(Date.now() - 86400000), fournisseur: 'Société Laitière du Sénégal', lignes: [], total: 148500, statut: 'partielle' },
    { id: 'CA3', date: new Date(), fournisseur: 'Fournisseur Beurre & Oeufs', lignes: [], total: 256000, statut: 'en_attente' },
  ]);

  categoriesFiltreAppro = computed(() =>
    ['Tout', ...new Set(this.produitsAppro.map(p => p.categorie))]
  );

  produitsFiltresAppro = computed(() => {
    const cat = this.categorieProduitAppro();
    return cat === 'Tout' ? this.produitsAppro : this.produitsAppro.filter(p => p.categorie === cat);
  });

  totalPanierAppro = computed(() => this.panierAppro().reduce((s, l) => s + l.total, 0));

  ajouterAppro(p: ProduitAppro) {
    const bid = this.boulangerieApproSelectee();
    const ex = this.panierAppro().find(l => l.produit.id === p.id && l.boulangerieId === bid);
    if (ex) {
      this.panierAppro.update(ls => ls.map(l => l.produit.id === p.id && l.boulangerieId === bid
        ? { ...l, quantite: l.quantite + 1, total: (l.quantite + 1) * p.prixUnitaire } : l));
    } else {
      this.panierAppro.update(ls => [...ls, { produit: p, boulangerieId: bid, quantite: 1, total: p.prixUnitaire }]);
    }
  }

  modifierQteAppro(pid: string, delta: number) {
    this.panierAppro.update(ls =>
      ls.map(l => l.produit.id === pid ? { ...l, quantite: l.quantite + delta, total: (l.quantite + delta) * l.produit.prixUnitaire } : l)
        .filter(l => l.quantite > 0)
    );
  }

  passerCommande() {
    if (!this.panierAppro().length) return;
    this.commandesAppro.update(list => [
      {
        id: 'CA' + Date.now(), date: new Date(), fournisseur: 'Commande manuelle',
        lignes: this.panierAppro(), total: this.totalPanierAppro(), statut: 'en_attente'
      },
      ...list
    ]);
    this.panierAppro.set([]);
  }

  getQteAppro(pid: string) { return this.panierAppro().find(l => l.produit.id === pid)?.quantite ?? 0; }
  nomBoulangerie(id: string) { return this.boulangeries().find(b => b.id === id)?.nom ?? id; }

  // ── Investissements ──
  investissements = signal<Investissement[]>([
    { id: 'I1', titre: 'Four rotatif 16 plaques', categorie: 'Équipement', montant: 4500000, date: '2024-02-01', boulangerie: 'Rose — Mermoz', statut: 'realise', retourEstime: 18, description: 'Augmentation capacité production +40%' },
    { id: 'I2', titre: 'Rénovation façade Almadies', categorie: 'Infrastructure', montant: 2200000, date: '2024-04-15', boulangerie: 'Rose — Almadies', statut: 'en_cours', retourEstime: 24, description: 'Réfection façade et enseignes lumineuses' },
    { id: 'I3', titre: 'Système POS tactile x4', categorie: 'Technologie', montant: 1800000, date: '2025-01-10', boulangerie: 'Toutes', statut: 'realise', retourEstime: 12, description: 'Caisses tactiles dans les 4 boutiques' },
    { id: 'I4', titre: 'Ouverture 5e boutique', categorie: 'Expansion', montant: 18000000, date: '2025-09-01', boulangerie: 'Parcelles Assainies', statut: 'planifie', retourEstime: 36, description: 'Nouveau point de vente — Parcelles Assainies' },
    { id: 'I5', titre: 'Chambre froide Plateau', categorie: 'Équipement', montant: 3200000, date: '2024-11-20', boulangerie: 'Rose — Plateau', statut: 'realise', retourEstime: 20, description: 'Chambre froide 12m² pâtisserie et frais' },
    { id: 'I6', titre: 'Formation équipes HACCP', categorie: 'Formation', montant: 480000, date: '2025-03-05', boulangerie: 'Toutes', statut: 'en_cours', retourEstime: 0, description: 'Certification hygiène pour 20 employés' },
  ]);

  realiseInvestissementsCount = computed(() => {
    return this.investissements().filter(i => i.statut === 'realise').length;
  });

  enCoursInvestissementsCount = computed(() => {
    return this.investissements().filter(i => i.statut === 'en_cours').length;
  });


  showFormInvest = signal(false);
  filtreCatInvest = signal('Tout');
  filtreStatutInvest = signal('Tout');
  categoriesInvest = ['Tout', 'Équipement', 'Infrastructure', 'Technologie', 'Expansion', 'Formation'];

  investsFiltres = computed(() =>
    this.investissements().filter(i =>
      (this.filtreCatInvest() === 'Tout' || i.categorie === this.filtreCatInvest()) &&
      (this.filtreStatutInvest() === 'Tout' || i.statut === this.filtreStatutInvest())
    )
  );

  totalInvesti = computed(() => this.investissements().filter(i => i.statut !== 'planifie').reduce((s, i) => s + i.montant, 0));
  totalPlanifie = computed(() => this.investissements().filter(i => i.statut === 'planifie').reduce((s, i) => s + i.montant, 0));

  // ── Aperçu ──
  totalCA = computed(() => {
    const mult = this.periode() === 'jour' ? 1 : this.periode() === 'semaine' ? 7 : 30;
    return this.boulangeries().reduce((s, b) => s + b.ventesJour, 0) * mult;
  });
  totalCommandes = computed(() => {
    const mult = this.periode() === 'jour' ? 1 : this.periode() === 'semaine' ? 7 : 30;
    return this.boulangeries().reduce((s, b) => s + b.commandesJour, 0) * mult;
  });
  meilleureBoulangerie = computed(() => [...this.boulangeries()].sort((a, b) => b.ventesJour - a.ventesJour)[0]);
  tauxMoyenObjectif = computed(() => Math.round(this.boulangeries().reduce((s, b) => s + b.taux, 0) / this.boulangeries().length));

  ventesHebdo = this.dataService.ventesHebdo;
  ventesMaxHebdo = computed(() => Math.max(...this.ventesHebdo.map(v => v.ventes)));
  getMaxVenteBoulangerie = computed(() => Math.max(...this.boulangeries().map(b => b.objectifJour)));

  // ── Forms ──
  ajouterBoulangerie() {
    const d = this.nouveauBoulangerie();
    if (!d.nom || !d.adresse) return;
    this.boulangeries.update(list => [...list, {
      id: 'B' + Date.now(), ...d, statut: 'active' as const,
      dateOuverture: new Date().toISOString().split('T')[0],
      ventesJour: 0, commandesJour: 0, taux: 0, tendance: 'stable' as const
    }]);
    this.showFormBoulangerie.set(false);
    this.nouveauBoulangerie.set({ nom: '', adresse: '', ville: 'Dakar', telephone: '', gerantNom: '', superficie: 0, objectifJour: 0 });
  }

  supprimerBoulangerie(id: string) { this.boulangeries.update(l => l.filter(b => b.id !== id)); }

  ajouterGerant() {
    const d = this.nouveauGerant();
    if (!d.nom || !d.prenom || !d.email) return;
    const b = this.boulangeries().find(b => b.id === d.boulangerieId);
    this.gerants.update(list => [...list, {
      id: 'G' + Date.now(), ...d,
      boulangerie: b?.nom ?? '',
      dateEmbauche: d.dateEmbauche || new Date().toISOString().split('T')[0],
      statut: 'actif' as const,
      photo: ((d.prenom[0] ?? '') + (d.nom[0] ?? '')).toUpperCase()
    }]);
    this.showFormGerant.set(false);
    this.nouveauGerant.set({ nom: '', prenom: '', email: '', telephone: '', boulangerieId: '', dateEmbauche: '' });
  }

  supprimerGerant(id: string) { this.gerants.update(l => l.filter(g => g.id !== id)); }

  // ── Helpers ──
  getStatutBoulangerie(s: string) { return ({ active: { label: 'Active', cls: 'success' }, ferme: { label: 'Fermée', cls: 'danger' }, renovation: { label: 'Rénovation', cls: 'warning' } } as any)[s] ?? { label: s, cls: 'info' }; }
  getStatutGerant(s: string) { return ({ actif: { label: 'Actif', cls: 'success' }, conge: { label: 'En congé', cls: 'warning' }, inactif: { label: 'Inactif', cls: 'danger' } } as any)[s] ?? { label: s, cls: 'info' }; }
  getStatutInvest(s: string) { return ({ planifie: { label: 'Planifié', cls: 'info' }, en_cours: { label: 'En cours', cls: 'warning' }, realise: { label: 'Réalisé', cls: 'success' } } as any)[s] ?? { label: s, cls: 'info' }; }
  getStatutAppro(s: string) { return ({ en_attente: { label: 'En attente', cls: 'warning' }, livree: { label: 'Livrée', cls: 'success' }, partielle: { label: 'Partielle', cls: 'info' } } as any)[s] ?? { label: s, cls: 'info' }; }
  getTendanceCls(t: string) { return ({ hausse: 'success', baisse: 'danger', stable: 'info' } as any)[t] ?? ''; }
  getTendanceIco(t: string) { return ({ hausse: '↑', baisse: '↓', stable: '→' } as any)[t] ?? ''; }
  getTauxCls(taux: number) { return taux >= 100 ? 'success' : taux >= 80 ? 'warning' : 'danger'; }
  getCatInvestIco(cat: string) { return ({ Équipement: '⚙️', Infrastructure: '🏗️', Technologie: '💻', Expansion: '📍', Formation: '🎓' } as any)[cat] ?? '💼'; }

  formatCFA(n: number) { return n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M FCFA' : n >= 1_000 ? (n / 1_000).toFixed(0) + 'k FCFA' : n + ' FCFA'; }
  formatCFAFull(n: number) { return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'; }

  protected readonly Math = Math;
  today = new Date();
  todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  getSectionLabel(id: SectionType): string {
    return this.nav.find(n => n.id === id)?.label ?? '';
  }

}

