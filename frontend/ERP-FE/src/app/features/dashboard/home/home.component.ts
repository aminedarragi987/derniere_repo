import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

interface RoleAction {
  title: string;
  description: string;
  link: string;
  tone: 'teal' | 'amber' | 'slate' | 'rose';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public userService: UserService) {}

  readonly commonActions: RoleAction[] = [
    {
      title: 'Changer le mot de passe',
      description: 'Mettre a jour le mot de passe du compte courant.',
      link: '/auth/change-password',
      tone: 'slate'
    },
    {
      title: 'Consulter le tableau de bord',
      description: 'Voir les indicateurs d’activite et de stock.',
      link: '/dashboard/overview',
      tone: 'teal'
    }
  ];

  readonly adminActions: RoleAction[] = [
    {
      title: 'Gerer les utilisateurs',
      description: 'Creer, modifier et affecter les comptes.',
      link: '/users',
      tone: 'amber'
    },
    {
      title: 'Configurer les roles',
      description: 'Controler les droits et la structure IAM.',
      link: '/admin/roles',
      tone: 'rose'
    },
    {
      title: 'Administrer les profils',
      description: 'Organiser les profils fonctionnels.',
      link: '/admin/profiles',
      tone: 'slate'
    },
    {
      title: 'Gerer les menus',
      description: 'Decider ce que chaque role voit dans la sidebar.',
      link: '/admin/menus',
      tone: 'teal'
    }
  ];

  readonly managerActions: RoleAction[] = [
    {
      title: 'Gerer les articles',
      description: 'Creer et maintenir le catalogue stock.',
      link: '/articles',
      tone: 'teal'
    },
    {
      title: 'Gerer les fournisseurs',
      description: 'Maintenir le reseau de fournisseurs actifs.',
      link: '/fournisseurs',
      tone: 'slate'
    },
    {
      title: 'Gerer les clients',
      description: 'Consulter et mettre a jour les clients.',
      link: '/clients',
      tone: 'amber'
    },
    {
      title: 'Suivre les commandes',
      description: 'Piloter le cycle de commande.',
      link: '/commandes',
      tone: 'rose'
    }
  ];

  readonly accountantActions: RoleAction[] = [
    {
      title: 'Suivre les commandes',
      description: 'Verifier les statuts de commandes et les montants.',
      link: '/commandes',
      tone: 'rose'
    },
    {
      title: 'Consulter les clients',
      description: 'Rechercher les clients et verifier leurs coordonnees.',
      link: '/clients',
      tone: 'amber'
    }
  ];

  get displayName(): string {
    return this.userService.getDisplayName();
  }

  get primaryRole(): string {
    const user = this.userService.currentUserValue;
    if (!user?.roles?.length) {
      return 'Visiteur';
    }

    if (user.roles.some((role) => this.isExecutiveRole(role))) {
      return user.roles.find((role) => this.isExecutiveRole(role)) ?? 'Administrateur';
    }

    if (user.roles.includes('Administrateur')) {
      return 'Administrateur';
    }

    if (user.roles.includes('Gestionnaire')) {
      return 'Gestionnaire';
    }

    if (user.roles.includes('Comptable')) {
      return 'Comptable';
    }

    return user.roles[0];
  }

  private isExecutiveRole(role: string): boolean {
    const normalized = role
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();

    return normalized === 'dg' || normalized === 'directeur' || normalized === 'directeur general';
  }

  get visibleActions(): RoleAction[] {
    if (this.userService.isAdmin()) {
      return [...this.commonActions, ...this.managerActions, ...this.adminActions];
    }

    if (this.userService.isManager()) {
      return [...this.commonActions, ...this.managerActions];
    }

    if (this.userService.isAccountant()) {
      return [...this.commonActions, ...this.accountantActions];
    }

    return this.commonActions;
  }

}
