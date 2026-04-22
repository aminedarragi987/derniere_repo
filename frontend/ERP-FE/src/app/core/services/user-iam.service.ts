import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuDto, ProfileDto, RoleMenuAssignDto, RolesDto, UtilisateurDto } from '../../features/auth/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserIamService {
  constructor(private http: HttpClient) {}

  getMe(): Observable<UtilisateurDto> {
    return this.http.get<UtilisateurDto>(`${environment.gatewayUrl}/User/Users`);
  }

  getUsers(): Observable<UtilisateurDto[]> {
    return this.http.get<UtilisateurDto[]>(`${environment.gatewayUrl}/User/Users`);
  }

  addUser(user: UtilisateurDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(`${environment.gatewayUrl}/User/AddUser`, user);
  }

  updateUser(user: UtilisateurDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${environment.gatewayUrl}/User/UpdUser`, user);
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
}
