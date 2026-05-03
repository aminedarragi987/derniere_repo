import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { PublicHomeComponent } from './features/public-home/public-home.component';

export const routes: Routes = [

  // ================= PUBLIC =================
  {
    path: '',
    pathMatch: 'full',
    component: PublicHomeComponent
  },

  // ================= AUTH =================
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'auth/change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/pages/change-password/change-password.component')
        .then(m => m.ChangePasswordComponent)
  },

  // ================= APP LAYOUT =================
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),

    children: [

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // ================= DASHBOARD =================
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Comptable', 'Administrateur', 'Directeur Générale'] },
        loadComponent: () =>
          import('./features/dashboard/home/home.component')
            .then(m => m.HomeComponent)
      },

      // ================= ARTICLES =================
      {
        path: 'articles',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/articles/pages/article-list/article-list.component')
            .then(m => m.ArticleListComponent)
      },
      {
        path: 'articles/new',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/articles/pages/article-add/article-add.component')
            .then(m => m.ArticleAddComponent)
      },
      {
        path: 'articles/edit/:id',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/articles/pages/article-edit/article-edit.component')
            .then(m => m.ArticleEditComponent)
      },
      {
        path: 'articles/:id',
        loadComponent: () =>
          import('./features/articles/pages/article-detail/article-detail.component')
            .then(m => m.ArticleDetailComponent)
      },

      // ================= FOURNISSEURS =================
      {
        path: 'fournisseurs',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/articles/pages/fournisseur-list/fournisseur-list.component')
            .then(m => m.FournisseurListComponent)
      },
      {
        path: 'fournisseurs/new',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/articles/pages/fournisseur-add/fournisseur-add.component')
            .then(m => m.FournisseurAddComponent)
      },
      {
        path: 'fournisseurs/edit/:id',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/articles/pages/fournisseur-edit/fournisseur-edit.component')
            .then(m => m.FournisseurEditComponent)
      },

      // ================= CLIENTS =================
      {
        path: 'clients',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Comptable', 'Administrateur'] },
        loadComponent: () =>
          import('./features/clients/pages/client-list/client-list.component')
            .then(m => m.ClientListComponent)
      },
      {
        path: 'clients/new',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/clients/pages/client-add/client-add.component')
            .then(m => m.ClientAddComponent)
      },
      {
        path: 'clients/edit/:id',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/clients/pages/client-edit/client-edit.component')
            .then(m => m.ClientEditComponent)
      },

      // ================= COMMANDES =================
      {
        path: 'commandes',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Comptable', 'Administrateur'] },
        loadComponent: () =>
          import('./features/commandes/pages/commande-list/commande-list.component')
            .then(m => m.CommandeListComponent)
      },

      // ================= LIVRAISONS =================
      {
        path: 'livraisons',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        loadComponent: () =>
          import('./features/livraisons/pages/livraison-list/livraison-list.component')
            .then(m => m.LivraisonListComponent)
      },

      // ================= FACTURES =================
      {
        path: 'factures',
        canActivate: [roleGuard],
        data: { roles: ['Comptable', 'Administrateur'] },
        loadComponent: () =>
          import('./features/factures/pages/facture-list/facture-list.component')
            .then(m => m.FactureListComponent)
      },

      // ================= PAIEMENTS =================
      {
        path: 'paiements',
        canActivate: [roleGuard],
        data: { roles: ['Comptable', 'Administrateur'] },
        loadComponent: () =>
          import('./features/paiements/pages/paiement-list/paiement-list.component')
            .then(m => m.PaiementListComponent)
      },

      // ================= USERS =================
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/users/user-list/user-list.component')
            .then(m => m.UserListComponent)
      },
      {
        path: 'users/new',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/users/user-add/user-add.component')
            .then(m => m.UserAddComponent)
      },
      {
        path: 'users/edit/:id',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/users/user-edit/user-edit.component')
            .then(m => m.UserEditComponent)
      },

      // ================= ADMIN IAM =================
      {
        path: 'admin/roles',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/auth/pages/admin-roles/admin-roles.component')
            .then(m => m.AdminRolesComponent)
      },
      {
        path: 'admin/profiles',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/auth/pages/admin-profiles/admin-profiles.component')
            .then(m => m.AdminProfilesComponent)
      },
      {
        path: 'admin/menus',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/auth/pages/admin-menus/admin-menus.component')
            .then(m => m.AdminMenusComponent)
      }
    ]
  },

  // ================= FALLBACK =================
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];