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
    return this.http
      .get<unknown>(`${environment.gatewayUrl}/User/Roles`)
      .pipe(map((payload) => this.normalizeRolesResponse(payload)));
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
    return this.http
      .get<unknown>(`${environment.gatewayUrl}/User/Profiles`)
      .pipe(map((payload) => this.normalizeProfilesResponse(payload)));
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
    return this.http
      .get<unknown>(`${environment.gatewayUrl}/User/Menus`)
      .pipe(map((payload) => this.normalizeMenusResponse(payload)));
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

  private normalizeRolesResponse(payload: unknown): RolesDto[] {
    const list = this.unwrapToArray(payload);
    return list
      .map((item) => this.normalizeRoleDto(item))
      .filter((role) => typeof role.idrole === 'number' && !!role.nom);
  }

  private normalizeRoleDto(payload: unknown): RolesDto {
    const role = (payload as Record<string, unknown>) ?? {};
    return {
      idrole: this.toNumber(role['idrole'] ?? role['idRole'] ?? role['Idrole'] ?? role['IdRole']) ?? 0,
      nom: this.toString(role['nom'] ?? role['name'] ?? role['libelle'] ?? role['Nom']) ?? '',
      description: this.toString(role['description'] ?? role['Description']),
      idprofile: this.toNumber(role['idprofile'] ?? role['idProfile'] ?? role['idprofil'] ?? role['Idprofile']),
      idroleparent: this.toNumber(role['idroleparent'] ?? role['idRoleParent'] ?? role['Idroleparent'])
    };
  }

  private normalizeProfilesResponse(payload: unknown): ProfileDto[] {
    const list = this.unwrapToArray(payload);
    return list
      .map((item) => this.normalizeProfileDto(item))
      .filter((profile) => typeof profile.idprofil === 'number' && !!profile.nom);
  }

  private normalizeProfileDto(payload: unknown): ProfileDto {
    const profile = (payload as Record<string, unknown>) ?? {};
    return {
      idprofil: this.toNumber(profile['idprofil'] ?? profile['idprofile'] ?? profile['Idprofil'] ?? profile['IdProfile']) ?? 0,
      nom: this.toString(profile['nom'] ?? profile['name'] ?? profile['libelle'] ?? profile['Nom']) ?? '',
      description: this.toString(profile['description'] ?? profile['Description'])
    };
  }

  private normalizeMenusResponse(payload: unknown): MenuDto[] {
    const list = this.unwrapToArray(payload);
    return list
      .map((item) => this.normalizeMenuDto(item))
      .filter((menu) => typeof menu.idmenu === 'number' && !!menu.titre);
  }

  private normalizeMenuDto(payload: unknown): MenuDto {
    const menu = (payload as Record<string, unknown>) ?? {};
    return {
      idmenu: this.toNumber(menu['idmenu'] ?? menu['idMenu'] ?? menu['Idmenu'] ?? menu['IdMenu']) ?? 0,
      titre: this.toString(menu['titre'] ?? menu['title'] ?? menu['Titre']) ?? '',
      description: this.toString(menu['description'] ?? menu['Description']),
      memRouterlink: this.toString(menu['memRouterlink'] ?? menu['routerLink']),
      memHref: this.toString(menu['memHref'] ?? menu['href']),
      memIcon: this.toString(menu['memIcon'] ?? menu['icon']),
      memTarget: this.toString(menu['memTarget'] ?? menu['target']),
      hassubmenu: typeof menu['hassubmenu'] === 'boolean' ? menu['hassubmenu'] : undefined,
      parentid: this.toNumber(menu['parentid'] ?? menu['parentId'])
    };
  }

  private unwrapToArray(payload: unknown): unknown[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;
      const candidate = record['value'] ?? record['items'] ?? record['data'] ?? record['result'];
      if (Array.isArray(candidate)) {
        return candidate;
      }
      if (candidate && typeof candidate === 'object') {
        return [candidate];
      }
      return [record];
    }

    return [];
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
