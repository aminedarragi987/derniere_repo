# Fichiers Essentiels - Frontend Angular ERP

## 📋 Index des fichiers clés et leur rôle

### 🔐 Authentication Core

#### `src/app/core/services/auth.service.ts`
**Rôle**: Service d'authentification principal
- **Méthodes**:
  - `login(payload: Login, rememberMe: boolean): Observable<AuthUserState>`
    - POST /User/IsLogin → Stocke tokens → Charge user
  - `logout(fromExpiredSession?: boolean): void`
    - Revoque refreshToken, efface storage, redirect login
  - `refreshToken(): Observable<ResponseLogin>`
    - POST /Auth/Refresh ou /User/Refresh
    - Queue automatique des requêtes en attente
  - `changePassword(iduser: number, payload: ChangePasswordDto)`
    - POST /User/ChangePassword/{iduser}
  - `loadConnectedUser(): Observable<AuthUserState>`
    - GET /User/Users → fallback JWT claims
  - `currentUser$: Observable<AuthUserState | null>` (BehaviorSubject)
  - `currentUserValue: AuthUserState | null` (getter sync)
  - `isAuthenticated(): boolean`
  - `hasAnyRole(roles: string[]): boolean`
  - `hasAllPermissions(permissions: string[]): boolean`

#### `src/app/core/services/token.service.ts`
**Rôle**: Gestion du stockage des tokens
- **Méthodes**:
  - `getAccessToken(): string | null`
  - `getRefreshToken(): string | null`
  - `setTokens(tokens: ResponseLogin, rememberMe: boolean): void`
    - sessionStorage (défaut) ou localStorage (remember-me)
  - `setAccessToken(token: string): void`
  - `clearTokens(): void`
  - `hasValidToken(): boolean`
- **Clés stockage**: `erp.accessToken`, `erp.refreshToken`

#### `src/app/core/interceptors/auth.interceptor.ts`
**Rôle**: Injection token + gestion 401
- **Logique**:
  1. Détecte header `x-skip-auth` (ignore pour login/refresh/logout)
  2. Ajoute `Authorization: Bearer {accessToken}`
  3. Sur 401: Appelle `authService.refreshToken()` + retry requête
  4. Sur refresh failure: Appelle `logout(true)`
- **Key**: HttpInterceptorFn functional

#### `src/app/core/utils/jwt.utils.ts`
**Rôle**: Décodage JWT + normalisation claims
- **Fonctions**:
  - `decodeJwtClaims(token: string): Record<string, unknown>`
    - Décode le payload JWT en base64
  - `normalizeUserFromClaims(claims: Record<string, unknown>): AuthUserState`
    - Extrait roles/permissions des claims standards
    - Gère sub/unique_name/name/email/profile/role/roles

### 🛂 Guards

#### `src/app/core/guards/auth.guard.ts`
**Rôle**: Vérifier que user est authentifié
- **Logique**:
  - Si authenticated → allow
  - Sinon → redirect /auth/login?returnUrl={current_path}

#### `src/app/core/guards/role.guard.ts`
**Rôle**: Vérifier que user a un des rôles requis
- **Usage**: `data: { roles: ['Administrateur', 'Gestionnaire'] }`
- **Logique**:
  - Si pas de roles en data → allow
  - Si `user.hasAnyRole(roles)` → allow
  - Sinon → redirect /auth/login?denied=role

#### `src/app/core/guards/permission.guard.ts`
**Rôle**: Vérifier que user a TOUTES les permissions requises
- **Usage**: `data: { permissions: ['articles.write', 'articles.delete'] }`
- **Logique**:
  - Si pas de permissions en data → allow
  - Si `user.hasAllPermissions(permissions)` → allow
  - Sinon → redirect /auth/login?denied=permission

### 👥 User & Menu Management

#### `src/app/core/services/user-iam.service.ts`
**Rôle**: CRUD pour Utilisateurs, Rôles, Profils, Menus
- **Utilisateurs**:
  - `getMe()`: GET /User/Users
  - `getUsers()`: GET /User/Users
  - `addUser(user)`: POST /User/AddUser
  - `updateUser(user)`: PUT /User/UpdUser
- **Rôles**:
  - `getRoles()`: GET /User/Roles
  - `addRole(role)`: POST /User/Role
  - `updateRole(idrole, role)`: PUT /User/Role/{idrole}
  - `deleteRole(idrole)`: DELETE /User/Role/{idrole}
  - `getMenusByRole(idrole)`: GET /User/Role/{idrole}/Menus
  - `assignMenusToRole(idrole, request)`: PUT /User/Role/{idrole}/Menus
- **Profils**:
  - `getProfiles()`: GET /User/Profiles
  - `addProfile(profile)`: POST /User/Profile
  - `updateProfile(idprofil, profile)`: PUT /User/Profile/{idprofil}
  - `deleteProfile(idprofil)`: DELETE /User/Profile/{idprofil}
- **Menus**:
  - `getMenus()`: GET /User/Menus
  - `addMenu(menu)`: POST /User/Menu
  - `updateMenu(idmenu, menu)`: PUT /User/Menu/{idmenu}
  - `deleteMenu(idmenu)`: DELETE /User/Menu/{idmenu}

#### `src/app/core/services/menu.service.ts`
**Rôle**: Chargement menus avec fallback par rôle
- **Méthodes**:
  - `loadMyMenus(): Observable<MenuDto[]>`
    - Appelle userIamService.getMenus()
    - Fallback: Menu fixe basé sur rôle utilisateur
  - `clear(): void`
  - `menus$: Observable<MenuDto[]>` (BehaviorSubject)
- **Fallback Menu**:
  - Articles (pour tous)
  - Utilisateurs, Rôles, Profils, Menus (pour Administrateur)

### 📦 Article Management

#### `src/app/features/articles/services/article.service.ts`
**Rôle**: CRUD Articles avec filtres
- **Méthodes**:
  - `getArticles(filter?: ArticleFilterDto): Observable<ArticleDto[]>`
    - GET /Stock/Articles?search=...&idcategorie=...&idfournisseur=...&prixMin=...&prixMax=...
  - `getAll(): Observable<ArticleDto[]>` (alias getArticles())
  - `create(data: ArticleDto): Observable<ArticleDto>`
    - POST /Stock/Article
  - `update(id: number, data: ArticleDto): Observable<{ Message }>`
    - PUT /Stock/Article/{idarticle}
  - `delete(id: number): Observable<{ Message }>`
    - DELETE /Stock/Article/{idarticle}
  - `getStock(id: number): Observable<number>`
    - GET /Stock/Article/{id}/NiveauStock
  - `getFournisseurs(): Observable<FournisseurDto[]>`
    - GET /Stock/Fournisseurs
  - `associateFournisseur(idarticle, idfournisseur): Observable<{ Message }>`
    - POST /Stock/Article/{idarticle}/Fournisseur/{idfournisseur}

### 📄 Models & DTOs

#### `src/app/features/auth/models/auth.models.ts`
```typescript
Login { email, password }
ResponseLogin { accessToken, refreshToken, expiresIn? }
ChangePasswordDto { currentPassword, newPassword, confirmPassword }
RevokeRequest { refreshToken }
RefreshRequest { accessToken, refreshToken }
```

#### `src/app/features/auth/models/user.models.ts`
```typescript
MenuDto { idmenu, titre, description, memRouterlink, memHref, memIcon, memTarget, hassubmenu, parentid, inverseParent, idroles }
UtilisateurDto { iduser, userName, email, nom, prenom, roles[], permissions[], idprofil, profileNom }
RolesDto { idrole, nom, description, idprofile, idroleparent, idprofileNavigation, utilisateurs[], idmenus[] }
ProfileDto { idprofil, nom, description, roles[] }
RoleMenuAssignDto { menuIds[] }
AuthUserState { iduser, userName, email, nom, prenom, profile, idprofil, roles[], permissions[], claims }
```

#### `src/app/features/articles/models/article.model.ts`
```typescript
ArticleDto { idarticle, nom, description, prix, quantitestock, seuilminimum, idcategorie, categorieNom, fournisseurIds[] }
ArticleFilterDto { search, idcategorie, idfournisseur, prixMin, prixMax }
FournisseurDto { idfournisseur, nom, email, telephone }
CategorieDto { idcategorie, nom, description }
```

### 🧩 Pages (Components)

#### Login
**`src/app/features/auth/pages/login/login.component.ts`**
- Form: email (required, email), password (required, minLength 6), rememberMe
- On submit: authService.login() → navigate('/articles')
- Error handling: 404/401 → "Identifiants invalides"

#### Change Password
**`src/app/features/auth/pages/change-password/change-password.component.ts`**
- Form: currentPassword, newPassword, confirmPassword (must match)
- On submit: authService.changePassword(iduser) → success message

#### Admin Users
**`src/app/features/auth/pages/admin-users/admin-users.component.ts`**
- List users from userIamService.getUsers()
- Form for create/edit: userName, email, nom, prenom, motdepasse, roles
- Actions: Create, Edit, (Delete - backend missing endpoint)

#### Admin Roles
**`src/app/features/auth/pages/admin-roles/admin-roles.component.ts`**
- List roles from userIamService.getRoles()
- Form: nom, description, idprofile
- Actions: Create, Edit, Delete

#### Admin Profiles
**`src/app/features/auth/pages/admin-profiles/admin-profiles.component.ts`**
- List profiles from userIamService.getProfiles()
- Form: nom, description
- Actions: Create, Edit, Delete

#### Admin Menus
**`src/app/features/auth/pages/admin-menus/admin-menus.component.ts`**
- List menus from userIamService.getMenus()
- Form: titre, description, memRouterlink, memIcon, memTarget, hassubmenu, parentid
- Actions: Create, Edit, Delete

#### Article List
**`src/app/features/articles/pages/article-list/article-list.component.ts`**
- List articles with articleService.getArticles(filter)
- Filter form: search, idcategorie, idfournisseur, prixMin, prixMax
- Debounced filter (300ms)
- Load fournisseurs for filter dropdown
- Actions: Create, Edit, Delete

#### Article Form
**`src/app/features/articles/pages/article-form/article-form.component.ts`**
- Form: nom, description, prix, quantitestock, seuilminimum, idcategorie, fournisseurIds (multi-select)
- Create or Edit mode based on :id param
- Load fournisseurs list
- Validations: nom (required), prix (required), quantité (required), seuil (required)

### 🗂️ Layout

#### Main Layout
**`src/app/layout/main-layout/main-layout.component.ts`**
- Shell component avec header + sidebar + router-outlet
- OnInit: authService.loadConnectedUser() + menuService.loadMyMenus()

#### Header
**`src/app/layout/header/header.component.ts`**
- Display: user.userName/email/roles
- Button: Logout

#### Sidebar
**`src/app/layout/sidebar/sidebar.component.ts`**
- Dynamic menu from menuService.menus$
- routerLink to memRouterlink, routerLinkActive="active"

### ⚙️ Configuration

#### `src/app/app.config.ts`
```typescript
provideZoneChangeDetection({ eventCoalescing: true })
provideRouter(routes)
provideHttpClient(withInterceptors([authInterceptor]))
provideClientHydration()
```

#### `src/app/app.routes.ts`
Public:
- /auth/login
- /auth/change-password (authGuard)

Protected (authGuard):
- / (redirect to /articles)
- /articles (list)
- /articles/new (roleGuard: Gestionnaire|Administrateur)
- /articles/edit/:id (roleGuard: Gestionnaire|Administrateur)
- /admin/users (roleGuard: Administrateur)
- /admin/roles (roleGuard: Administrateur)
- /admin/profiles (roleGuard: Administrateur)
- /admin/menus (roleGuard: Administrateur)

#### `src/environments/environment.ts`
```typescript
{
  production: false,
  gatewayUrl: 'http://localhost:5100',
  tokenStorage: 'session' as 'local' | 'session'
}
```

---

## 🔄 Flux de données exemple: Login complet

```
1. User accède http://localhost:4300
2. Router redirige vers /auth/login (pas authentifié)
3. LoginComponent affiche form
4. User entre email/password + cooche remember-me
5. User clique submit
   ├─ LoginComponent.submit()
   ├─ AuthService.login(Login, boolean)
   ├─ HTTP POST /User/IsLogin
   ├─ ResponseLogin { accessToken, refreshToken }
   ├─ TokenService.setTokens(response, true)
   │  └─ localStorage.setItem('erp.accessToken', token)
   │  └─ localStorage.setItem('erp.refreshToken', token)
   ├─ AuthService.loadConnectedUser()
   ├─ HTTP GET /User/Users
   ├─ AuthUserState { iduser, userName, email, roles, permissions }
   ├─ currentUserSubject.next(user)
   └─ Router.navigate('/articles')
6. MainLayoutComponent initialise
   ├─ authService.loadConnectedUser() (déjà fait)
   ├─ menuService.loadMyMenus()
   ├─ HTTP GET /User/Menus
   ├─ MenuDto[] trié par idmenu
   └─ menusSubject.next(menus)
7. HeaderComponent affiche user info
8. SidebarComponent affiche menus dynamiques
9. ArticleListComponent charge articles
   ├─ ArticleService.getArticles()
   ├─ HTTP GET /Stock/Articles
   │  ├─ AuthInterceptor.intercept()
   │  ├─ Ajoute Authorization: Bearer {accessToken}
   │  └─ Envoie requête
   ├─ Backend valide JWT
   └─ Répond 200 + ArticleDto[]
10. User peut maintenant naviguer, filtrer articles, créer/éditer/supprimer

Si user refresh page:
1. AuthService.currentUserSubject = null
2. MainLayoutComponent.ngOnInit()
3. authService.loadConnectedUser() - dépend de token stocké
4. TokenService.getAccessToken() - récupère du localStorage
5. Si pas de token: redirect /auth/login
6. Si token: Charge user (GET /User/Users ou JWT fallback)
```

---

## 🐛 Debugging tips

### Dans le navigateur:
```javascript
// Vérifier tokens stockés
localStorage.getItem('erp.accessToken')
sessionStorage.getItem('erp.accessToken')

// Décoder JWT pour voir claims
const token = localStorage.getItem('erp.accessToken')
const payload = JSON.parse(atob(token.split('.')[1]))
console.log(payload)

// Vérifier user en mémoire (depuis console Angular)
ng.getComponent(document.querySelector('app-root')).injector.get(AuthService).currentUserValue
```

### Dans DevTools Network:
- Vérifier Authorization header sur chaque requête
- Vérifier 401 responses et refresh flow
- Vérifier query params des filtres articles

### Erreurs courantes:
- **"Token absent"**: TokenService retourne null → need login
- **"Unauthorized 401"**: Bearer header manquant ou token expiré
- **"Not found 404"**: Endpoint URL incorrect dans service
- **"CORS error"**: Backend n'a pas les bons headers CORS

---

**Last Updated**: 21/04/2026
