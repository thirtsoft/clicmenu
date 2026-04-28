import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';


type Vue = 'apercu' | 'tables' | 'commandes' | 'menu' | 'ventes';

export interface TableRestaurant {
  id: string;
  nom: string;
  zone: 'interieur' | 'terrasse' | 'vip';
  couverts: number;
  statut: 'libre' | 'occupee' | 'reservee' | 'maintenance';
  clientNom: string;
  heureOccupation: string;
  commandesEnCours: number;
  commandesToday: number;
  montantToday: number;
}

interface Reservation {
  tableId: string;
  clientNom: string;
  telephone: string;
  date: string;
  heure: string;
  nbPersonnes: number;
  notes: string;
}

@Component({
  selector: 'app-tables-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tables-list-component.html',
  styleUrl: './tables-list-component.css',
})
export class TablesListComponent {


  protected readonly Math = Math;

  vue = signal<Vue>('tables');
  sidebarOpen = signal(false);
  sidebarCollapsed = signal(false);

  naviguer(id: Vue) {
    this.vue.set(id);
    this.sidebarOpen.set(false);
  }

  // ── Tables ─────────────────────────────────────────
  tables = signal<TableRestaurant[]>([
    {
      id: 'T1', nom: 'Table 1', zone: 'interieur', couverts: 4,
      statut: 'occupee', clientNom: 'M. Diop', heureOccupation: '12:30',
      commandesEnCours: 3, commandesToday: 8, montantToday: 24500
    },
    {
      id: 'T2', nom: 'Table 2', zone: 'interieur', couverts: 2,
      statut: 'libre', clientNom: '', heureOccupation: '',
      commandesEnCours: 0, commandesToday: 5, montantToday: 15000
    },
    {
      id: 'T3', nom: 'Table 3', zone: 'interieur', couverts: 6,
      statut: 'occupee', clientNom: 'Mme Fall', heureOccupation: '13:00',
      commandesEnCours: 5, commandesToday: 12, montantToday: 45000
    },
    {
      id: 'T4', nom: 'Table 4', zone: 'terrasse', couverts: 4,
      statut: 'occupee', clientNom: 'Famille Bâ', heureOccupation: '12:45',
      commandesEnCours: 4, commandesToday: 10, montantToday: 38000
    },
    {
      id: 'T5', nom: 'Table 5', zone: 'terrasse', couverts: 2,
      statut: 'libre', clientNom: '', heureOccupation: '',
      commandesEnCours: 0, commandesToday: 3, montantToday: 8500
    },
    {
      id: 'T6', nom: 'Table 6', zone: 'terrasse', couverts: 8,
      statut: 'reservee', clientNom: 'Société X', heureOccupation: '14:00',
      commandesEnCours: 0, commandesToday: 0, montantToday: 0
    },
    {
      id: 'T7', nom: 'VIP 1', zone: 'vip', couverts: 4,
      statut: 'occupee', clientNom: 'M. Niang', heureOccupation: '13:15',
      commandesEnCours: 2, commandesToday: 6, montantToday: 52000
    },
    {
      id: 'T8', nom: 'VIP 2', zone: 'vip', couverts: 6,
      statut: 'libre', clientNom: '', heureOccupation: '',
      commandesEnCours: 0, commandesToday: 2, montantToday: 12000
    },
  ]);

  // ── Signals réservation ────────────────────────────
  showFormReservation = signal(false);
  newReservation = signal<Reservation>({
    tableId: '',
    clientNom: '',
    telephone: '',
    date: new Date().toISOString().split('T')[0],
    heure: '',
    nbPersonnes: 2,
    notes: ''
  });

  // ── Computed tables disponibles ────────────────────
  tablesDisponibles = computed(() =>
    this.tables().filter(t => t.statut === 'libre')
  );




  showFormTable = signal(false);
  newTable = signal({
    nom: '', zone: '', couverts: 4
  });

  filtreStatut = signal<'tous' | 'libre' | 'occupee' | 'reservee'>('tous');

  zonesRestaurant = ['Intérieur', 'Terrasse', 'VIP'];

  // ── Computed ────────────────────────────────────────
  tablesFiltrees = computed(() => {
    const f = this.filtreStatut();
    return f === 'tous'
      ? this.tables()
      : this.tables().filter(t => t.statut === f);
  });

  tablesOccupees = computed(() =>
    this.tables().filter(t => t.statut === 'occupee').length
  );

  tablesLibres = computed(() =>
    this.tables().filter(t => t.statut === 'libre').length
  );

  tablesReservees = computed(() =>
    this.tables().filter(t => t.statut === 'reservee').length
  );

  totalCouverts = computed(() =>
    this.tables()
      .filter(t => t.statut === 'occupee')
      .reduce((s, t) => s + t.couverts, 0)
  );

  totalMontantTables = computed(() =>
    this.tables().reduce((s, t) => s + t.montantToday, 0)
  );

  // ── Méthodes ────────────────────────────────────────
  ajouterTable() {
    const d = this.newTable();
    if (!d.nom || !d.zone) return;

    this.tables.update(list => [...list, {
      id: 'T' + Date.now(),
      nom: d.nom,
      zone: d.zone.toLowerCase() as 'interieur' | 'terrasse' | 'vip',
      couverts: d.couverts,
      statut: 'libre' as const,
      clientNom: '',
      heureOccupation: '',
      commandesEnCours: 0,
      commandesToday: 0,
      montantToday: 0
    }]);

    this.showFormTable.set(false);
    this.newTable.set({ nom: '', zone: '', couverts: 4 });
  }

  supprimerTable(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      this.tables.update(l => l.filter(t => t.id !== id));
    }
  }

  toggleTableStatut(t: TableRestaurant) {
    this.tables.update(list =>
      list.map(table => {
        if (table.id === t.id) {
          if (table.statut === 'occupee') {
            // Libérer la table
            return {
              ...table,
              statut: 'libre' as const,
              clientNom: '',
              heureOccupation: '',
              commandesEnCours: 0
            };
          } else if (table.statut === 'libre') {
            // Occuper la table
            const now = new Date();
            return {
              ...table,
              statut: 'occupee' as const,
              heureOccupation: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            };
          } else if (table.statut === 'reservee') {
            // Confirmer la réservation (passer à occupée)
            const now = new Date();
            return {
              ...table,
              statut: 'occupee' as const,
              heureOccupation: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            };
          }
        }
        return table;
      })
    );
  }

  setFiltreStatut(val: 'tous' | 'libre' | 'occupee' | 'reservee') {
    this.filtreStatut.set(val);
  }

  initialesClient(nom: string) {
    return nom
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  statTable(s: string) {
    const m: Record<string, { label: string; cls: string }> = {
      libre: { label: 'Libre', cls: 'success' },
      occupee: { label: 'Occupée', cls: 'warning' },
      reservee: { label: 'Réservée', cls: 'info' },
      maintenance: { label: 'Maintenance', cls: 'danger' },
    };
    return m[s] ?? { label: s, cls: 'info' };
  }

  fmtCFA(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  // Méthodes de mise à jour du formulaire nouvelle table
  setNouveauNomTable(v: string) {
    this.newTable.update(n => ({ ...n, nom: v }));
  }

  setNouveauZoneTable(v: string) {
    this.newTable.update(n => ({ ...n, zone: v }));
  }

  setNouveauCouvertsTable(v: string | number) {
    const value = typeof v === 'string' ? parseInt(v, 10) || 4 : v;
    this.newTable.update(n => ({ ...n, couverts: value }));
  }

  // ── Méthode ajouter réservation ────────────────────
  ajouterReservation() {
    const r = this.newReservation();
    if (!r.tableId || !r.clientNom || !r.date || !r.heure) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    // Mettre à jour le statut de la table en "réservée"
    this.tables.update(list =>
      list.map(table => {
        if (table.id === r.tableId) {
          return {
            ...table,
            statut: 'reservee' as const,
            clientNom: r.clientNom,
            heureOccupation: r.heure
          };
        }
        return table;
      })
    );

    // Réinitialiser le formulaire
    this.showFormReservation.set(false);
    this.newReservation.set({
      tableId: '',
      clientNom: '',
      telephone: '',
      date: new Date().toISOString().split('T')[0],
      heure: '',
      nbPersonnes: 2,
      notes: ''
    });
  }

  // ── Méthodes de mise à jour réservation ────────────
  setReservationTable(v: string) {
    this.newReservation.update(n => ({ ...n, tableId: v }));
  }

  setReservationClient(v: string) {
    this.newReservation.update(n => ({ ...n, clientNom: v }));
  }

  setReservationTelephone(v: string) {
    this.newReservation.update(n => ({ ...n, telephone: v }));
  }

  setReservationDate(v: string) {
    this.newReservation.update(n => ({ ...n, date: v }));
  }

  setReservationHeure(v: string) {
    this.newReservation.update(n => ({ ...n, heure: v }));
  }

  setReservationNbPersonnes(v: string | number) {
    const value = typeof v === 'string' ? parseInt(v, 10) || 2 : v;
    this.newReservation.update(n => ({ ...n, nbPersonnes: value }));
  }

  setReservationNotes(v: string) {
    this.newReservation.update(n => ({ ...n, notes: v }));
  }


}