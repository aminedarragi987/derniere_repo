export interface MenuDto {
  idmenu: number;
  titre: string;
  description?: string;
  memRouterlink?: string;
  memHref?: string;
  memIcon?: string;
  memTarget?: string;
  hassubmenu?: boolean;
  parentid?: number | null;
  inverseParent?: MenuDto[];
  parent?: MenuDto;
  idroles?: RolesDto[];
}

export interface UtilisateurDto {
  id?: number;
  iduser?: number;
  idrole?: number;
  userName?: string;
  email?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  motdepasse?: string;
  roles?: string[];
  permissions?: string[];
  idprofil?: number;
  profileNom?: string;
}

export interface RolesDto {
  idrole: number;
  nom: string;
  description?: string;
  idprofile?: number | null;
  idroleparent?: number | null;
  idprofileNavigation?: ProfileDto;
  idroleparentNavigation?: RolesDto;
  inverseIdroleparentNavigation?: RolesDto[];
  utilisateurs?: UtilisateurDto[];
  idmenus?: MenuDto[];
}

export interface ProfileDto {
  idprofil: number;
  nom: string;
  description?: string;
  roles?: RolesDto[];
}

export interface RoleMenuAssignDto {
  menuIds: number[];
}

export interface AuthUserState {
  id?: string | number;
  iduser?: number;
  userName?: string;
  email?: string;
}