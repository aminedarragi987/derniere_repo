import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  ChangePasswordDto,
  Login,
  RefreshRequest,
  RevokeRequest,
  ResponseLogin
} from '../../features/auth/models/auth.models';
import { AuthUserState, UtilisateurDto } from '../../features/auth/models/user.models';
import { TokenService } from './token.service';
import { UserIamService } from './user-iam.service';
import { decodeJwtClaims, normalizeUserFromClaims } from '../utils/jwt.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<AuthUserState | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private refreshInProgress = false;
  private refreshQueueSubject = new BehaviorSubject<string | null>(null);

  get currentUserValue(): AuthUserState | null {
    return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private userIamService: UserIamService,
    private router: Router
  ) {
    this.restoreUserFromToken();
  }

  login(payload: Login, rememberMe = false): Observable<AuthUserState> {
    return this.http.post<ResponseLogin>(`${environment.gatewayUrl}/User/IsLogin`, payload).pipe(
      tap((response) => this.tokenService.setTokens(response, rememberMe)),
      switchMap(() => this.loadConnectedUser()),
      catchError((error) => throwError(() => error))
    );
  }

  changePassword(iduser: number, payload: ChangePasswordDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(
      `${environment.gatewayUrl}/User/ChangePassword/${iduser}`,
      payload
    );
  }

  logout(fromExpiredSession = false): void {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken) {
      const body: RevokeRequest = { refreshToken };
      const headers = new HttpHeaders({ 'x-skip-auth': 'true' });
      this.http.post<{ Message: string }>(`${environment.gatewayUrl}/User/Logout`, body, { headers }).subscribe({
        error: () => undefined
      });
    }

    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);

    this.router.navigate(['/auth/login'], {
      queryParams: fromExpiredSession ? { expired: '1' } : undefined
    });
  }

  refreshToken(): Observable<string> {
    if (this.refreshInProgress) {
      return this.refreshQueueSubject.pipe(
        map((token) => {
          if (!token) {
            throw new Error('Refresh token indisponible');
          }
          return token;
        })
      );
    }

    const accessToken = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return throwError(() => new Error('Session invalide'));
    }

    this.refreshInProgress = true;
    this.refreshQueueSubject.next(null);

    const payload: RefreshRequest = { accessToken, refreshToken };
    const headers = new HttpHeaders({ 'x-skip-auth': 'true' });

    return this.http.post<ResponseLogin>(`${environment.gatewayUrl}/Auth/Refresh`, payload, { headers }).pipe(
      tap((tokens) => {
        const accessTokenFromResponse = tokens.AccessToken ?? tokens.accessToken;
        if (!accessTokenFromResponse) {
          throw new Error('Access token manquant dans la reponse refresh');
        }
        this.tokenService.setTokens(tokens, true);
        this.refreshQueueSubject.next(accessTokenFromResponse);
        const claims = decodeJwtClaims(accessTokenFromResponse);
        this.currentUserSubject.next(normalizeUserFromClaims(claims));
      }),
      map((tokens) => {
        const token = tokens.AccessToken ?? tokens.accessToken;
        if (!token) {
          throw new Error('Access token manquant dans la reponse refresh');
        }
        return token;
      }),
      finalize(() => {
        this.refreshInProgress = false;
      }),
      catchError((error) => {
        this.logout(true);
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  hasAnyRole(expectedRoles: string[]): boolean {
    if (!expectedRoles.length) {
      return true;
    }

    const currentRoles = (this.currentUserValue?.roles ?? []).map((role) => this.normalizeRole(role));
    const requiredRoles = expectedRoles.map((role) => this.normalizeRole(role));

    return requiredRoles.some((role) => currentRoles.includes(role));
  }

  hasAllPermissions(expectedPermissions: string[]): boolean {
    if (!expectedPermissions.length) {
      return true;
    }
    const permissions = this.currentUserValue?.permissions ?? [];
    return expectedPermissions.every((permission) => permissions.includes(permission));
  }

  loadConnectedUser(): Observable<AuthUserState> {
    return this.userIamService.getMe().pipe(
      map((user: UtilisateurDto) => {
        const normalized: AuthUserState = {
          iduser: user.iduser,
          userName: user.userName,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          profile: user.profileNom,
          idprofil: user.idprofil,
          roles: user.roles ?? [],
          permissions: user.permissions ?? [],
          claims: {}
        };
        return normalized;
      }),
      tap((user) => this.currentUserSubject.next(user)),
      catchError(() => {
        const accessToken = this.tokenService.getAccessToken();
        if (!accessToken) {
          return throwError(() => new Error('Token absent'));
        }

        const fallback = normalizeUserFromClaims(decodeJwtClaims(accessToken));
        this.currentUserSubject.next(fallback);
        return of(fallback);
      })
    );
  }

  private restoreUserFromToken(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return;
    }

    const claims = decodeJwtClaims(token);
    const user = normalizeUserFromClaims(claims);
    this.currentUserSubject.next(user);
  }

  private normalizeRole(role: string): string {
    const normalized = role
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();

    if (normalized === 'administrateur' || normalized === 'admin' || normalized === 'dg' || normalized === 'directeur' || normalized === 'directeur general') {
      return 'Administrateur';
    }

    if (normalized === 'gestionnaire' || normalized === 'manager') {
      return 'Gestionnaire';
    }

    return role.trim();
  }
}
