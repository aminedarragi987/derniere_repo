import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component')
        .then((m) => m.LoginComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component')
        .then((m) => m.ForgotPasswordComponent)
  },
  {
    path: 'auth/change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/pages/change-password/change-password.component')
        .then((m) => m.ChangePasswordComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component')
        .then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/home/home.component')
            .then((m) => m.HomeComponent)
      },
      {
        path: 'dashboard/overview',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.component')
            .then((m) => m.DashboardComponent)
      },
      {
        path: 'articles',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/articles/pages/article-list/article-list.component')
                .then((m) => m.ArticleListComponent)
          },
          {
            path: 'new',
            canActivate: [roleGuard],
            data: { roles: ['Gestionnaire'] },
            loadComponent: () =>
              import('./features/articles/pages/article-form/article-form.component')
                .then((m) => m.ArticleFormComponent)
          },
          {
            path: 'edit/:id',
            canActivate: [roleGuard],
            data: { roles: ['Gestionnaire'] },
            loadComponent: () =>
              import('./features/articles/pages/article-form/article-form.component')
                .then((m) => m.ArticleFormComponent)
          }
        ]
      },
      {
        path: 'fournisseurs',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Administrateur'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/articles/pages/fournisseur-list/fournisseur-list.component')
                .then((m) => m.FournisseurListComponent)
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/articles/pages/fournisseur-form/fournisseur-form.component')
                .then((m) => m.FournisseurFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/articles/pages/fournisseur-form/fournisseur-form.component')
                .then((m) => m.FournisseurFormComponent)
          }
        ]
      },
      {
        path: 'clients',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Comptable', 'Administrateur'] },
        loadComponent: () =>
          import('./features/clients/pages/client-list/client-list.component')
            .then((m) => m.ClientListComponent)
      },
      {
        path: 'commandes',
        canActivate: [roleGuard],
        data: { roles: ['Gestionnaire', 'Comptable', 'Administrateur'] },
        loadComponent: () =>
          import('./features/commandes/pages/commande-list/commande-list.component')
            .then((m) => m.CommandeListComponent)
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/users/user-list/user-list.component')
                .then((m) => m.UserListComponent)
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/users/user-form/user-form.component')
                .then((m) => m.UserFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/users/user-form/user-form.component')
                .then((m) => m.UserFormComponent)
          }
        ]
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/auth/pages/admin-users/admin-users.component')
            .then((m) => m.AdminUsersComponent)
      },
      {
        path: 'admin/roles',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/auth/pages/admin-roles/admin-roles.component')
            .then((m) => m.AdminRolesComponent)
      },
      {
        path: 'admin/profiles',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/auth/pages/admin-profiles/admin-profiles.component')
            .then((m) => m.AdminProfilesComponent)
      },
      {
        path: 'admin/menus',
        canActivate: [roleGuard],
        data: { roles: ['Administrateur'] },
        loadComponent: () =>
          import('./features/auth/pages/admin-menus/admin-menus.component')
            .then((m) => m.AdminMenusComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
