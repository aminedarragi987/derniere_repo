import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MenuDto } from '../../features/auth/models/user.models';
import { UserIamService } from './user-iam.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly menusSubject = new BehaviorSubject<MenuDto[]>([]);
  readonly menus$ = this.menusSubject.asObservable();

  constructor(
    private userIamService: UserIamService,
    private authService: AuthService
  ) {}

  loadMyMenus(): Observable<MenuDto[]> {
    return this.userIamService.getMenus().pipe(
      tap((menus) => {
        const sorted = [...menus].sort((a, b) => (a.idmenu ?? 0) - (b.idmenu ?? 0));
        this.menusSubject.next(this.ensureRoleMenus(sorted));
      }),
      catchError(() => {
        const fallback = this.ensureRoleMenus(this.createFallbackMenus());
        this.menusSubject.next(fallback);
        return of(fallback);
      })
    );
  }

  clear(): void {
    this.menusSubject.next([]);
  }

  private createFallbackMenus(): MenuDto[] {
    return [
      {
        idmenu: 0,
        titre: 'Dashboard',
        description: 'Vue globale',
        memRouterlink: '/dashboard',
        memHref: '',
        memIcon: 'dashboard',
        memTarget: '',
        hassubmenu: false
      }
    ];
  }

  private ensureRoleMenus(menus: MenuDto[]): MenuDto[] {
    const merged = [...menus];

    // Dashboard Gestionnaire / Admin
    if (this.authService.hasAnyRole(['Gestionnaire', 'Administrateur'])) {
      this.pushIfMissing(merged, {
        idmenu: 1,
        titre: 'Dashboard',
        description: 'Vue opérationnelle',
        memRouterlink: '/dashboard',
        memHref: '',
        memIcon: 'dashboard',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 2,
        titre: 'Articles',
        description: 'Gestion des articles',
        memRouterlink: '/articles',
        memHref: '',
        memIcon: 'inventory',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 3,
        titre: 'Fournisseurs',
        description: 'Gestion des fournisseurs',
        memRouterlink: '/fournisseurs',
        memHref: '',
        memIcon: 'local_shipping',
        memTarget: '',
        hassubmenu: false
      });
    }

    // Flux commercial
    if (this.authService.hasAnyRole(['Gestionnaire', 'Comptable', 'Administrateur'])) {
      this.pushIfMissing(merged, {
        idmenu: 4,
        titre: 'Clients',
        description: 'Gestion des clients',
        memRouterlink: '/clients',
        memHref: '',
        memIcon: 'groups',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 5,
        titre: 'Commandes',
        description: 'Suivi des commandes',
        memRouterlink: '/commandes',
        memHref: '',
        memIcon: 'receipt_long',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 55,
        titre: 'Livraisons',
        description: 'Gestion des livraisons',
        memRouterlink: '/livraisons',
        memHref: '',
        memIcon: 'local_shipping',
        memTarget: '',
        hassubmenu: false
      });
    }

    // Comptabilité
    if (this.authService.hasAnyRole(['Comptable', 'Administrateur'])) {
      this.pushIfMissing(merged, {
        idmenu: 6,
        titre: 'Factures',
        description: 'Gestion des factures',
        memRouterlink: '/factures',
        memHref: '',
        memIcon: 'request_quote',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 7,
        titre: 'Paiements',
        description: 'Gestion des paiements',
        memRouterlink: '/paiements',
        memHref: '',
        memIcon: 'payments',
        memTarget: '',
        hassubmenu: false
      });
    }


    // Dashboard Direction supprimé volontairement

    // IAM Admin
    if (this.authService.hasAnyRole(['Administrateur'])) {
      this.pushIfMissing(merged, {
        idmenu: 20,
        titre: 'Utilisateurs',
        description: 'Gestion des utilisateurs',
        memRouterlink: '/users',
        memHref: '',
        memIcon: 'group',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 21,
        titre: 'Rôles',
        description: 'Gestion des rôles',
        memRouterlink: '/admin/roles',
        memHref: '',
        memIcon: 'security',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 22,
        titre: 'Profils',
        description: 'Gestion des profils',
        memRouterlink: '/admin/profiles',
        memHref: '',
        memIcon: 'person',
        memTarget: '',
        hassubmenu: false
      });

      this.pushIfMissing(merged, {
        idmenu: 23,
        titre: 'Menus',
        description: 'Gestion des menus',
        memRouterlink: '/admin/menus',
        memHref: '',
        memIcon: 'menu',
        memTarget: '',
        hassubmenu: false
      });
    }

    return merged.sort((a, b) => (a.idmenu ?? 0) - (b.idmenu ?? 0));
  }

  private pushIfMissing(menus: MenuDto[], menu: MenuDto): void {
    const route = (menu.memRouterlink ?? '').trim().toLowerCase();

    const alreadyExists = menus.some(
      (item) => (item.memRouterlink ?? '').trim().toLowerCase() === route
    );

    if (!alreadyExists) {
      menus.push(menu);
    }
  }
}