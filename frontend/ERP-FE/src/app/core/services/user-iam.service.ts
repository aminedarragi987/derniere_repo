import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MenuDto, ProfileDto, RoleMenuAssignDto, RolesDto, UtilisateurDto } from '../../features/auth/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserIamService {
  constructor(private http: HttpClient) {}

  getMe(): Observable<UtilisateurDto | UtilisateurDto[]> {
    return this.http
      .get<unknown>(`${environment.gatewayUrl}/User/Users`)
      .pipe(map((payload) => this.normalizeUsersResponse(payload)));
  }

  getUsers(): Observable<UtilisateurDto[]> {
    return this.http
      .get<unknown>(`${environment.gatewayUrl}/User/Users`)
      .pipe(
        map((payload) => this.normalizeUsersResponse(payload)),
        map((payload) => (Array.isArray(payload) ? payload : [payload]))
      );
  }

  addUser(user: UtilisateurDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(
      `${environment.gatewayUrl}/User/AddUser`,
      this.toBackendUserPayload(user)
    );
  }

  updateUser(user: UtilisateurDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(
      `${environment.gatewayUrl}/User/UpdUser`,
      this.toBackendUserPayload(user)
    );
  }

  getRoles(): Observable<RolesDto[]> {
    return this.http.get<RolesDto[]>(`${environment.gatewayUrl}/User/Roles`);
  }

  addRole(role: RolesDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(`${environment.gatewayUrl}/User/Role`, role);
  }

  updateRole(idrole: number, role: RolesDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${environment.gatewayUrl}/User/Role/${idrole}`, role);
  }

  deleteRole(idrole: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${environment.gatewayUrl}/User/Role/${idrole}`);
  }

  getMenusByRole(idrole: number): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${environment.gatewayUrl}/User/Role/${idrole}/Menus`);
  }

  assignMenusToRole(idrole: number, request: RoleMenuAssignDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${environment.gatewayUrl}/User/Role/${idrole}/Menus`, request);
  }

  getProfiles(): Observable<ProfileDto[]> {
    return this.http.get<ProfileDto[]>(`${environment.gatewayUrl}/User/Profiles`);
  }

  addProfile(profile: ProfileDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(`${environment.gatewayUrl}/User/Profile`, profile);
  }

  updateProfile(idprofil: number, profile: ProfileDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${environment.gatewayUrl}/User/Profile/${idprofil}`, profile);
  }

  deleteProfile(idprofil: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${environment.gatewayUrl}/User/Profile/${idprofil}`);
  }

  getMenus(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${environment.gatewayUrl}/User/Menus`);
  }

  addMenu(menu: MenuDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(`${environment.gatewayUrl}/User/Menu`, menu);
  }

  updateMenu(idmenu: number, menu: MenuDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${environment.gatewayUrl}/User/Menu/${idmenu}`, menu);
  }

  deleteMenu(idmenu: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${environment.gatewayUrl}/User/Menu/${idmenu}`);
  }

  private normalizeUsersResponse(payload: unknown): UtilisateurDto | UtilisateurDto[] {
    if (Array.isArray(payload)) {
      return payload.map((item) => this.normalizeUserDto(item));
    }

    if (payload && typeof payload === 'object' && 'value' in (payload as Record<string, unknown>)) {
      const value = (payload as { value?: unknown }).value;
      if (Array.isArray(value)) {
        return value.map((item) => this.normalizeUserDto(item));
      }
      if (value && typeof value === 'object') {
        return this.normalizeUserDto(value);
      }
    }

    if (payload && typeof payload === 'object') {
      return this.normalizeUserDto(payload);
    }

    return [];
  }

  private normalizeUserDto(payload: unknown): UtilisateurDto {
    const user = (payload as Record<string, unknown>) ?? {};
    return {
      id: this.toNumber(user['id'] ?? user['iduser']),
      iduser: this.toNumber(user['iduser'] ?? user['id']),
      idrole: this.toNumber(user['idrole']),
      userName: this.toString(user['userName'] ?? user['username']),
      email: this.toString(user['email']),
      nom: this.toString(user['nom']),
      prenom: this.toString(user['prenom']),
      telephone: this.toString(user['telephone']),
      roles: Array.isArray(user['roles']) ? (user['roles'] as string[]) : undefined,
      permissions: Array.isArray(user['permissions']) ? (user['permissions'] as string[]) : undefined,
      idprofil: this.toNumber(user['idprofil']),
      profileNom: this.toString(user['profileNom'])
    };
  }

  private toBackendUserPayload(user: UtilisateurDto): Record<string, unknown> {
    return {
      iduser: user.iduser ?? user.id ?? 0,
      idrole: user.idrole ?? null,
      nom: user.nom ?? '',
      prenom: user.prenom ?? '',
      email: user.email ?? '',
      telephone: user.telephone ?? '',
      username: user.userName ?? '',
      userName: user.userName ?? '',
      motpass: user.motdepasse ?? '',
      motdepasse: user.motdepasse ?? ''
    };
  }

  private toNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string' && value.trim().length) {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  private toString(value: unknown): string | undefined {
    if (typeof value === 'string') {
      return value;
    }
    return undefined;
  }
}
