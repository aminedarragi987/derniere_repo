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
        this.menusSubject.next(sorted);
      }),
      catchError(() => {
        const fallback = this.createFallbackMenus();
        this.menusSubject.next(fallback);
        return of(fallback);
      })
    );
  }

  clear(): void {
    this.menusSubject.next([]);
  }

  private createFallbackMenus(): MenuDto[] {
    const user = this.authService.currentUserValue;
    if (!user) {
      return [];
    }

    const menus: MenuDto[] = [
      {
        idmenu: 0,
        titre: 'Dashboard',
        description: 'Vue globale',
        memRouterlink: '/dashboard',
        memHref: '',
        memIcon: 'dashboard',
        memTarget: '',
        hassubmenu: false
      },
      {
        idmenu: 1,
        titre: 'Articles',
        description: 'Gestion des articles',
        memRouterlink: '/articles',
        memHref: '',
        memIcon: 'inventory',
        memTarget: '',
        hassubmenu: false
      },
      {
        idmenu: 6,
        titre: 'Clients',
        description: 'Gestion des clients',
        memRouterlink: '/clients',
        memHref: '',
        memIcon: 'groups',
        memTarget: '',
        hassubmenu: false
      },
      {
        idmenu: 7,
        titre: 'Commandes',
        description: 'Suivi des commandes',
        memRouterlink: '/commandes',
        memHref: '',
        memIcon: 'receipt_long',
        memTarget: '',
        hassubmenu: false
      }
    ];

    if (user.roles.includes('Administrateur')) {
      menus.push(
        {
          idmenu: 2,
          titre: 'Utilisateurs',
          description: 'Gestion des utilisateurs',
          memRouterlink: '/users',
          memHref: '',
          memIcon: 'group',
          memTarget: '',
          hassubmenu: false
        },
        {
          idmenu: 3,
          titre: 'Rôles',
          description: 'Gestion des rôles',
          memRouterlink: '/admin/roles',
          memHref: '',
          memIcon: 'security',
          memTarget: '',
          hassubmenu: false
        },
        {
          idmenu: 4,
          titre: 'Profils',
          description: 'Gestion des profils',
          memRouterlink: '/admin/profiles',
          memHref: '',
          memIcon: 'person',
          memTarget: '',
          hassubmenu: false
        },
        {
          idmenu: 5,
          titre: 'Menus',
          description: 'Gestion des menus',
          memRouterlink: '/admin/menus',
          memHref: '',
          memIcon: 'menu',
          memTarget: '',
          hassubmenu: false
        }
      );
    }

    return menus;
  }
}
