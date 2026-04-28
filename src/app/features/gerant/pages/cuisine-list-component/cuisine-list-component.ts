import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PlatCommande {
  nom: string;
  icone: string;
  quantite: number;
  notes: string;
  statut: 'en_attente' | 'en_preparation' | 'pret';
}

interface CommandeCuisine {
  id: string;
  table: string;
  serveur: string;
  heureCommande: string;
  tempsEcoule: number;
  statut: 'en_attente' | 'en_preparation' | 'pret' | 'servi';
  urgent: boolean;
  plats: PlatCommande[];
}

@Component({
  selector: 'app-cuisine-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuisine-list-component.html',
  styleUrl: './cuisine-list-component.css',
})
export class CuisineListComponent {

  commandes = signal<CommandeCuisine[]>([
    {
      id: 'CMD1', table: 'Table 1', serveur: 'Aminata Diallo',
      heureCommande: '12:45', tempsEcoule: 10, statut: 'en_preparation',
      urgent: false,
      plats: [
        { nom: 'Poulet Yassa', icone: '🍗', quantite: 2, notes: 'Sans piment', statut: 'en_preparation' },
        { nom: 'Nems Poulet', icone: '🥟', quantite: 1, notes: '', statut: 'pret' }
      ]
    },
    {
      id: 'CMD2', table: 'Table 3', serveur: 'Moussa Sow',
      heureCommande: '13:00', tempsEcoule: 5, statut: 'en_attente',
      urgent: true,
      plats: [
        { nom: 'Thieboudienne', icone: '🍚', quantite: 1, notes: 'Bien cuit', statut: 'en_attente' },
        { nom: 'Mafé Poulet', icone: '🍛', quantite: 2, notes: '', statut: 'en_attente' }
      ]
    },
    {
      id: 'CMD3', table: 'VIP 1', serveur: 'Moussa Sow',
      heureCommande: '12:50', tempsEcoule: 15, statut: 'pret',
      urgent: false,
      plats: [
        { nom: 'Poisson Grillé', icone: '🐟', quantite: 1, notes: 'Sauce à part', statut: 'pret' },
        { nom: 'Salade César', icone: '🥗', quantite: 2, notes: '', statut: 'pret' }
      ]
    },
    {
      id: 'CMD4', table: 'Table 4', serveur: 'Fatou Ndiaye',
      heureCommande: '13:10', tempsEcoule: 3, statut: 'en_attente',
      urgent: false,
      plats: [
        { nom: 'Nems Poulet', icone: '🥟', quantite: 3, notes: '', statut: 'en_attente' },
        { nom: 'Tiramisu', icone: '🍰', quantite: 2, notes: '', statut: 'en_attente' }
      ]
    },
    {
      id: 'CMD5', table: 'Table 7', serveur: 'Aminata Diallo',
      heureCommande: '13:05', tempsEcoule: 8, statut: 'en_preparation',
      urgent: false,
      plats: [
        { nom: 'Poulet Yassa', icone: '🍗', quantite: 1, notes: '', statut: 'en_preparation' },
        { nom: 'Jus Bissap', icone: '🍷', quantite: 3, notes: '', statut: 'pret' }
      ]
    },
  ]);

  filtreCuisine = signal<'tous' | 'en_attente' | 'en_preparation' | 'pret'>('tous');

  // ── Computed Cuisine ────────────────────────────────
  commandesFiltrees = computed(() => {
    const f = this.filtreCuisine();
    return f === 'tous'
      ? this.commandes()
      : this.commandes().filter(c => c.statut === f);
  });

  commandesEnAttente = computed(() =>
    this.commandes().filter(c => c.statut === 'en_attente').length
  );

  commandesEnPreparation = computed(() =>
    this.commandes().filter(c => c.statut === 'en_preparation').length
  );

  commandesTerminees = computed(() =>
    this.commandes().filter(c => c.statut === 'pret').length
  );

  tempsMoyen = computed(() => {
    const cmds = this.commandes().filter(c => c.tempsEcoule > 0);
    return cmds.length > 0
      ? Math.round(cmds.reduce((s, c) => s + c.tempsEcoule, 0) / cmds.length)
      : 0;
  });

  // ── Méthodes Cuisine ────────────────────────────────
  setFiltreCuisine(val: 'tous' | 'en_attente' | 'en_preparation' | 'pret') {
    this.filtreCuisine.set(val);
  }

  demarrerPreparation(cmd: CommandeCuisine) {
    this.commandes.update(list =>
      list.map(c => c.id === cmd.id ? { ...c, statut: 'en_preparation' as const } : c)
    );
  }

  terminerPlat(cmd: CommandeCuisine) {
    this.commandes.update(list =>
      list.map(c => c.id === cmd.id ? { ...c, statut: 'pret' as const } : c)
    );
  }

  servirCommande(cmd: CommandeCuisine) {
    this.commandes.update(list =>
      list.map(c => c.id === cmd.id ? { ...c, statut: 'servi' as const } : c)
    );
    // Supprimer après 2 secondes
    setTimeout(() => {
      this.commandes.update(list => list.filter(c => c.id !== cmd.id));
    }, 2000);
  }

  rafraichirCuisine() {
    // Simuler un rafraîchissement
    console.log('Cuisine actualisée');
  }

  statutCuisine(s: string) {
    const m: Record<string, { label: string; cls: string }> = {
      en_attente: { label: 'En attente', cls: 'warning' },
      en_preparation: { label: 'En préparation', cls: 'info' },
      pret: { label: 'Prêt', cls: 'success' },
      servi: { label: 'Servi', cls: 'success' },
    };
    return m[s] ?? { label: s, cls: 'info' };
  }

}
