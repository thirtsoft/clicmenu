import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../../../shared/data.service';

type PeriodeType = 'jour' | 'semaine' | 'mois';
export type SectionType = 'apercu' | 'boulangeries' | 'gerants' | 'approvisionnements' | 'commandes' | 'investissements' | 'depenses';

// Interface pour les commandes du propriétaire
export interface CommandeProprietaire {
  id: string;
  date: Date;
  boulangerie: string;
  boulangerieId: string;
  gerantNom: string;
  type: 'matieres_premieres' | 'fournitures' | 'equipements';
  produits: { nom: string; quantite: number; prix: number; unite: string }[];
  total: number;
  statut: 'en_attente' | 'validee' | 'livree' | 'annulee';
  note?: string;
  fournisseur: string;
}


@Component({
  selector: 'app-historique-commande-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-commande-component.html',
  styleUrl: './historique-commande-component.css',
})
export class HistoriqueCommandeComponent {

  private readonly dataService = inject(DataService);
  router = inject(Router);

  protected readonly Math = Math;

  sectionActive = signal<SectionType>('commandes');
  sidebarCollapsed = signal(false);

  // État pour le modal
  showDetailsModal = signal(false);
  selectedCommande = signal<CommandeProprietaire | null>(null);

  // État des filtres
  filtreNumero = signal('');
  filtreBoulangerie = signal<string>('toutes');
  filtreStatut = signal<string>('tous');
  filtreType = signal<string>('tous');
  filtreMois = signal<string>('tous');
  filtreAnnee = signal<string>('toutes');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(5);
  itemsPerPageOptions = [5, 10, 20, 50, 100];

  nav: { id: SectionType; label: string; icone: string; badge?: string }[] = [
    { id: 'apercu', label: "Vue d'ensemble", icone: '📊' },
    { id: 'boulangeries', label: 'Mes boulangeries', icone: '🏪', badge: '4' },
    { id: 'gerants', label: 'Comptes gérants', icone: '👤', badge: '4' },
    { id: 'approvisionnements', label: 'Approvisionnement', icone: '📦' },
    { id: 'commandes', label: 'Commandes', icone: '📦' },
    { id: 'investissements', label: 'Investissements', icone: '💼' },
    { id: 'depenses', label: 'Dépenses', icone: '📊' },
  ];

  // Boulangeries
  boulangeries = signal([
    { id: 'B1', nom: 'Rose — Plateau' },
    { id: 'B2', nom: 'Rose — Almadies' },
    { id: 'B3', nom: 'Rose — Mermoz' },
    { id: 'B4', nom: 'Rose — Ouakam' },
  ]);

  // Commandes des gérants (données mockées)
  toutesCommandes = signal<CommandeProprietaire[]>([
    {
      id: 'CMD001',
      date: new Date(2024, 2, 15, 10, 30),
      boulangerie: 'Rose — Plateau',
      boulangerieId: 'B1',
      gerantNom: 'Moussa Diop',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Farine T55', quantite: 100, prix: 650, unite: 'kg' },
        { nom: 'Levure fraîche', quantite: 20, prix: 4500, unite: 'kg' },
        { nom: 'Sel fin', quantite: 30, prix: 300, unite: 'kg' }
      ],
      total: 159500,
      statut: 'livree',
      fournisseur: 'Grands Moulins de Dakar',
      note: 'Commande livrée avec succès'
    },
    {
      id: 'CMD002',
      date: new Date(2024, 2, 14, 9, 15),
      boulangerie: 'Rose — Almadies',
      boulangerieId: 'B2',
      gerantNom: 'Aminata Koné',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Beurre 84%', quantite: 30, prix: 5200, unite: 'kg' },
        { nom: 'Sucre blanc', quantite: 50, prix: 700, unite: 'kg' }
      ],
      total: 191000,
      statut: 'en_attente',
      fournisseur: 'Société Laitière du Sénégal',
      note: 'En attente de validation'
    },
    {
      id: 'CMD003',
      date: new Date(2024, 2, 10, 14, 0),
      boulangerie: 'Rose — Mermoz',
      boulangerieId: 'B3',
      gerantNom: 'Oumar Thiaw',
      type: 'fournitures',
      produits: [
        { nom: 'Sacs kraft pain', quantite: 200, prix: 2500, unite: 'lot' },
        { nom: 'Boîtes pâtisserie', quantite: 100, prix: 4000, unite: 'lot' }
      ],
      total: 900000,
      statut: 'validee',
      fournisseur: 'Emballages du Sénégal',
      note: 'Validation en cours'
    },
    {
      id: 'CMD004',
      date: new Date(2024, 2, 5, 11, 45),
      boulangerie: 'Rose — Ouakam',
      boulangerieId: 'B4',
      gerantNom: 'Fatou Ndiaye',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Chocolat pâtissier', quantite: 15, prix: 8000, unite: 'kg' },
        { nom: 'Oeufs frais', quantite: 30, prix: 3500, unite: 'boîte' }
      ],
      total: 225000,
      statut: 'annulee',
      fournisseur: 'Fournisseur Beurre & Oeufs',
      note: 'Annulé pour rupture de stock'
    },
    {
      id: 'CMD005',
      date: new Date(2024, 1, 20, 8, 30),
      boulangerie: 'Rose — Plateau',
      boulangerieId: 'B1',
      gerantNom: 'Moussa Diop',
      type: 'equipements',
      produits: [
        { nom: 'Fournisseur Gaz butane', quantite: 5, prix: 7500, unite: 'bouteille' }
      ],
      total: 37500,
      statut: 'livree',
      fournisseur: 'Gaz du Sénégal',
      note: ''
    },
    {
      id: 'CMD006',
      date: new Date(2024, 1, 15, 10, 0),
      boulangerie: 'Rose — Almadies',
      boulangerieId: 'B2',
      gerantNom: 'Aminata Koné',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Farine T55', quantite: 150, prix: 650, unite: 'kg' }
      ],
      total: 97500,
      statut: 'livree',
      fournisseur: 'Grands Moulins de Dakar',
      note: ''
    },
    {
      id: 'CMD007',
      date: new Date(2024, 1, 10, 14, 30),
      boulangerie: 'Rose — Mermoz',
      boulangerieId: 'B3',
      gerantNom: 'Oumar Thiaw',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Levure fraîche', quantite: 25, prix: 4500, unite: 'kg' }
      ],
      total: 112500,
      statut: 'validee',
      fournisseur: 'Grands Moulins de Dakar',
      note: 'En cours de livraison'
    },
    {
      id: 'CMD008',
      date: new Date(2024, 0, 25, 9, 0),
      boulangerie: 'Rose — Plateau',
      boulangerieId: 'B1',
      gerantNom: 'Moussa Diop',
      type: 'fournitures',
      produits: [
        { nom: 'Produit nettoyage', quantite: 20, prix: 1200, unite: 'L' }
      ],
      total: 24000,
      statut: 'livree',
      fournisseur: 'Hygiène Pro',
      note: ''
    },
    {
      id: 'CMD009',
      date: new Date(2024, 0, 18, 11, 30),
      boulangerie: 'Rose — Ouakam',
      boulangerieId: 'B4',
      gerantNom: 'Fatou Ndiaye',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Beurre 84%', quantite: 25, prix: 5200, unite: 'kg' }
      ],
      total: 130000,
      statut: 'annulee',
      fournisseur: 'Société Laitière du Sénégal',
      note: 'Commande annulée par le fournisseur'
    },
    {
      id: 'CMD010',
      date: new Date(2024, 0, 10, 8, 15),
      boulangerie: 'Rose — Mermoz',
      boulangerieId: 'B3',
      gerantNom: 'Oumar Thiaw',
      type: 'matieres_premieres',
      produits: [
        { nom: 'Sucre blanc', quantite: 40, prix: 700, unite: 'kg' }
      ],
      total: 28000,
      statut: 'en_attente',
      fournisseur: 'Sucre du Sénégal',
      note: 'En attente de validation'
    }
  ]);

  // Options pour les filtres
  boulangeriesOptions = computed(() => {
    const boulangeriesSet = new Set(this.toutesCommandes().map(c => c.boulangerie));
    return ['toutes', ...Array.from(boulangeriesSet)];
  });

  anneesDisponibles = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 2023; i--) {
      years.push(i.toString());
    }
    return years;
  });

  moisDisponibles = [
    { value: 'tous', label: 'Tous les mois' },
    { value: '1', label: 'Janvier' }, { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' }, { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' }, { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' }, { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' }, { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' }, { value: '12', label: 'Décembre' }
  ];

  statutsDisponibles = [
    { value: 'tous', label: 'Tous' },
    { value: 'en_attente', label: '⏳ En attente' },
    { value: 'validee', label: '✓ Validée' },
    { value: 'livree', label: '✅ Livrée' },
    { value: 'annulee', label: '❌ Annulée' }
  ];

  typesDisponibles = [
    { value: 'tous', label: 'Tous' },
    { value: 'matieres_premieres', label: '🌾 Matières premières' },
    { value: 'fournitures', label: '📦 Fournitures' },
    { value: 'equipements', label: '⚙️ Équipements' }
  ];

  // Commandes filtrées
  commandesFiltrees = computed(() => {
    let result = this.toutesCommandes();

    const numero = this.filtreNumero().toLowerCase();
    if (numero) {
      result = result.filter(c => c.id.toLowerCase().includes(numero));
    }

    if (this.filtreBoulangerie() !== 'toutes') {
      result = result.filter(c => c.boulangerie === this.filtreBoulangerie());
    }

    if (this.filtreStatut() !== 'tous') {
      result = result.filter(c => c.statut === this.filtreStatut());
    }

    if (this.filtreType() !== 'tous') {
      result = result.filter(c => c.type === this.filtreType());
    }

    if (this.filtreAnnee() !== 'toutes') {
      result = result.filter(c => c.date.getFullYear().toString() === this.filtreAnnee());
    }

    if (this.filtreMois() !== 'tous' && this.filtreAnnee() !== 'toutes') {
      result = result.filter(c => (c.date.getMonth() + 1).toString() === this.filtreMois());
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Total des commandes affichées
  totalAffiche = computed(() => {
    return this.commandesPaginees().reduce((sum, cmd) => sum + cmd.total, 0);
  });

  // Pagination
  totalPages = computed(() => {
    return Math.ceil(this.commandesFiltrees().length / this.itemsPerPage());
  });

  commandesPaginees = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.commandesFiltrees().slice(start, end);
  });

  constructor() {
    effect(() => {
      this.filtreNumero();
      this.filtreBoulangerie();
      this.filtreStatut();
      this.filtreType();
      this.filtreMois();
      this.filtreAnnee();
      this.itemsPerPage();
      this.currentPage.set(1);
    });
  }

  resetFiltres(): void {
    this.filtreNumero.set('');
    this.filtreBoulangerie.set('toutes');
    this.filtreStatut.set('tous');
    this.filtreType.set('tous');
    this.filtreMois.set('tous');
    this.filtreAnnee.set('toutes');
    this.currentPage.set(1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage.set(items);
    this.currentPage.set(1);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1);
    }
    if (current + delta < total - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (total !== 1) {
      range.push(total);
    }

    return range;
  }

  voirDetails(commande: CommandeProprietaire): void {
    this.selectedCommande.set(commande);
    this.showDetailsModal.set(true);
  }

  fermerModal(): void {
    this.showDetailsModal.set(false);
    this.selectedCommande.set(null);
  }

  getStatutInfo(statut: string): { label: string; class: string; icon: string } {
    const map: Record<string, { label: string; class: string; icon: string }> = {
      en_attente: { label: 'En attente', class: 'warning', icon: '⏳' },
      validee: { label: 'Validée', class: 'info', icon: '✓' },
      livree: { label: 'Livrée', class: 'success', icon: '✅' },
      annulee: { label: 'Annulée', class: 'danger', icon: '❌' }
    };
    return map[statut] || { label: statut, class: 'info', icon: '📦' };
  }

  getTypeInfo(type: string): { label: string; icon: string } {
    const map: Record<string, { label: string; icon: string }> = {
      matieres_premieres: { label: 'Matières premières', icon: '🌾' },
      fournitures: { label: 'Fournitures', icon: '📦' },
      equipements: { label: 'Équipements', icon: '⚙️' }
    };
    return map[type] || { label: type, icon: '📦' };
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatDateLong(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatCFA(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  getSectionLabel(id: SectionType): string {
    return this.nav.find(n => n.id === id)?.label ?? '';
  }

    // Export Excel
  exporterExcel(): void {
    const commandes = this.commandesPaginees();
    if (commandes.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    // Préparer les données pour Excel
    const data = commandes.map(cmd => ({
      'N° Commande': cmd.id,
      'Date': this.formatDate(cmd.date),
      'Type': cmd.type === 'matieres_premieres' ? 'Matière première' : 'Fournisseur',
      'Boulangerie': cmd.boulangerie,
      'Statut': this.getStatutInfo(cmd.statut).label,
      'Produits': cmd.produits.map(p => `${p.quantite}x ${p.nom}`).join(', '),
      'Observations': cmd.note || '-',
      'Montant (FCFA)': cmd.total
    }));

    // Ajouter la ligne de total
    data.push({
      'N° Commande': '',
      'Date': '',
      'Type': '',
      'Boulangerie': '',
      'Statut': '',
      'Produits': '',
      'Observations': 'TOTAL GÉNÉRAL',
      'Montant (FCFA)': this.totalAffiche()
    });

    // Convertir en CSV
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(';'));

    for (const row of data) {
      const values = headers.map(header => {
        let value = row[header as keyof typeof row]?.toString() || '';
        value = value.replace(/"/g, '""');
        return `"${value}"`;
      });
      csvRows.push(values.join(';'));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export PDF
  exporterPDF(): void {
    const commandes = this.commandesPaginees();
    if (commandes.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    const printContent = document.createElement('div');
    printContent.className = 'print-container';

    const dateExport = new Date().toLocaleDateString('fr-FR');
    const heureExport = new Date().toLocaleTimeString('fr-FR');

    printContent.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Export_Commandes_${dateExport}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'DM Sans', Arial, sans-serif;
            padding: 30px;
            background: white;
            color: #3D3028;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #C1654A;
          }
          .logo { font-size: 48px; margin-bottom: 10px; }
          .title { font-size: 24px; font-weight: bold; color: #C1654A; font-family: 'Playfair Display', serif; }
          .subtitle { font-size: 12px; color: #8C7B72; margin-top: 5px; }
          .filters-info {
            background: #F5F0EE;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 12px;
          }
          th {
            background: #F5E6DC;
            padding: 10px 8px;
            text-align: left;
            font-weight: bold;
            border-bottom: 2px solid #C1654A;
          }
          td {
            padding: 8px;
            border-bottom: 1px solid #F5E6DC;
          }
          .total-row {
            background: #FDF4F1;
            font-weight: bold;
          }
          .total-row td {
            border-top: 2px solid #C1654A;
          }
          .grand-total {
            font-size: 14px;
            color: #C1654A;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #8C7B72;
            border-top: 1px solid #F5E6DC;
            padding-top: 15px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🥖</div>
          <div class="title">BOULANGERIE ROSE</div>
          <div class="subtitle">Export des commandes</div>
        </div>
        
        <div class="filters-info">
          <strong>Filtres appliqués :</strong><br>
          ${this.filtreNumero() ? `N° commande: ${this.filtreNumero()}<br>` : ''}
          ${this.filtreStatut() !== 'tous' ? `Statut: ${this.getStatutInfo(this.filtreStatut()).label}<br>` : ''}
          ${this.filtreType() !== 'tous' ? `Type: ${this.filtreType() === 'livreur' ? 'Livreur' : 'Fournisseur'}<br>` : ''}
          ${this.filtreAnnee() !== 'toutes' ? `Année: ${this.filtreAnnee()}<br>` : ''}
          ${this.filtreMois() !== 'tous' ? `Mois: ${this.moisDisponibles.find(m => m.value === this.filtreMois())?.label}<br>` : ''}
          <strong>Nombre de commandes: ${commandes.length}</strong>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Date</th>
              <th>Type</th>
              <th>Destinataire</th>
              <th>Statut</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            ${commandes.map(cmd => `
              <tr>
                <td>${cmd.id}</td>
                <td>${this.formatDate(cmd.date)}</td>
                <td>${cmd.gerantNom === 'livreur' ? '🏍️ Livreur' : '🏭 Fournisseur'}</td>
                <td>${cmd.boulangerie}</td>
                <td>${this.getStatutInfo(cmd.statut).icon} ${this.getStatutInfo(cmd.statut).label}</td>
                <td style="text-align: right">${this.formatCFA(cmd.total)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="5" style="text-align: right"><strong>TOTAL GÉNÉRAL</strong></td>
              <td style="text-align: right"><strong class="grand-total">${this.formatCFA(this.totalAffiche())}</strong></td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>Document généré le ${dateExport} à ${heureExport}</p>
          <p>Boulangerie Rose - Tous droits réservés</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      alert('Veuillez autoriser les popups pour exporter');
    }
  }
  retourListeCommandes(): void {
    this.router.navigate(['/proprietaire/commandes']);
  }
}

