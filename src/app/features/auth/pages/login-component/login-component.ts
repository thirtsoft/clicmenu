import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Role = 'vendeur' | 'gerant' | 'proprietaire';

interface Compte {
  email: string;
  pwd: string;
  route: string;
}

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {

  constructor(private router: Router) { }

  roles = [
    { id: 'vendeur' as Role, ico: '🏪', nom: 'Vendeur', desc: 'Caisse & POS' },
    { id: 'gerant' as Role, ico: '🚚', nom: 'Gérant', desc: 'Opérations' },
    { id: 'proprietaire' as Role, ico: '👑', nom: 'Propriétaire', desc: 'Direction' },
  ];

  stats = [
    { val: '4', lbl: 'Boulangeries' },
    { val: '3', lbl: 'Rôles' },
    { val: '24/7', lbl: 'Disponible' },
    { val: '🇸🇳', lbl: 'Dakar' },
  ];

  features = [
    { ico: '🏪', txt: 'Caisse & encaissement POS' },
    { ico: '🚚', txt: 'Gestion des livraisons en temps réel' },
    { ico: '📊', txt: 'Tableau de bord propriétaire' },
  ];

  // Identifiants de démo — remplacer par votre service d'authentification
  private comptes: Record<Role, Compte> = {
    vendeur: { email: 'vendeur@rose.sn', pwd: 'vendeur123', route: '/vendeur' },
    gerant: { email: 'gerant@rose.sn', pwd: 'gerant123', route: '/gerant' },
    proprietaire: { email: 'proprio@rose.sn', pwd: 'proprio123', route: '/proprietaire' },
  };

  // ── Signals ────────────────────────────────────────────
  roleActif = signal<Role>('vendeur');
  email = signal('');
  password = signal('');
  remember = signal(false);
  showPwd = signal(false);
  loading = signal(false);
  succes = signal(false);
  erreur = signal('');

  selectRole(id: Role) {
    this.roleActif.set(id);
    this.erreur.set('');
  }

  togglePwd() {
    this.showPwd.set(!this.showPwd());
  }

  forgotPwd() {
    this.router.navigate(['auth/mot-de-passe-oublie']);
  }

  onSubmit() {
    this.erreur.set('');

    const email = this.email().trim().toLowerCase();
    const pwd = this.password();

    if (!email || !pwd) {
      this.erreur.set('Veuillez remplir tous les champs.');
      return;
    }

    const compte = this.comptes[this.roleActif()];

    if (email === compte.email && pwd === compte.pwd) {
      this.loading.set(true);
      // Simuler un appel API — remplacer par votre AuthService
      setTimeout(() => {
        this.loading.set(false);
        this.succes.set(true);
        setTimeout(() => this.router.navigate([compte.route]), 800);
      }, 1000);
    } else {
      this.erreur.set(
        'Identifiants incorrects pour le rôle « ' + this.roleActif() + ' ».'
      );
    }
  }
}

