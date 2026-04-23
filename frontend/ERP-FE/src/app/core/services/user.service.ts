import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUserState } from '../../features/auth/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private authService: AuthService) {}

  get currentUser$(): Observable<AuthUserState | null> {
    return this.authService.currentUser$;
  }

  get currentUserValue(): AuthUserState | null {
    return this.authService.currentUserValue;
  }

  loadConnectedUser(): Observable<AuthUserState> {
    return this.authService.loadConnectedUser();
  }

  hasAnyRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  hasAllPermissions(permissions: string[]): boolean {
    return this.authService.hasAllPermissions(permissions);
  }

  logout(fromExpiredSession = false): void {
    this.authService.logout(fromExpiredSession);
  }

  isAdmin(): boolean {
    return this.hasAnyRole(['Administrateur']);
  }

  isManager(): boolean {
    return this.hasAnyRole(['Gestionnaire']);
  }

  isAccountant(): boolean {
    return this.hasAnyRole(['Comptable']);
  }

  canManageCommercialFlow(): boolean {
    return this.hasAnyRole(['Gestionnaire', 'Comptable', 'Administrateur']);
  }

  getDisplayName(): string {
    const user = this.currentUserValue;
    if (!user) {
      return 'Utilisateur';
    }

    return user.nom && user.prenom
      ? `${user.prenom} ${user.nom}`
      : user.userName || user.email || 'Utilisateur';
  }
}
