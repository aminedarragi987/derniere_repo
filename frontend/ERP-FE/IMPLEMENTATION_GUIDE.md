# Frontend Angular ERP - Implémentation Complète IAM + Article CRUD

## 📋 Table des matières
1. [Arborescence du projet](#arborescence)
2. [Architecture technique](#architecture)
3. [Flux d'authentification](#flux-auth)
4. [Fichiers clés et mise en place](#fichiers-cles)
5. [Plan d'implémentation (3 sprints)](#plan-sprints)

---

## <a id="arborescence"></a>📂 Arborescence complète du projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts              ✅ Vérifier authentification
│   │   │   ├── role.guard.ts              ✅ Vérifier rôles
│   │   │   └── permission.guard.ts        ✅ Vérifier permissions
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts        ✅ Bearer token + 401 refresh
│   │   ├── services/
│   │   │   ├── auth.service.ts            ✅ Login/logout/refresh/changePassword
│   │   │   ├── token.service.ts           ✅ Stockage token (session/local)
│   │   │   ├── user-iam.service.ts        ✅ CRUD User/Role/Profile/Menu
│   │   │   └── menu.service.ts            ✅ Chargement menus avec fallback
│   │   └── utils/
│   │       └── jwt.utils.ts               ✅ Décodage JWT + normalisation claims
│   ├── features/
│   │   ├── auth/
│   │   │   ├── models/
│   │   │   │   ├── auth.models.ts         ✅ Login, ResponseLogin, ChangePasswordDto
│   │   │   │   └── user.models.ts         ✅ UtilisateurDto, MenuDto, RolesDto, ProfileDto
│   │   │   └── pages/
│   │   │       ├── login/
│   │   │       │   ├── login.component.ts
│   │   │       │   └── login.component.html
│   │   │       ├── change-password/
│   │   │       │   ├── change-password.component.ts
│   │   │       │   └── change-password.component.html
│   │   │       ├── admin-users/
│   │   │       │   ├── admin-users.component.ts        ✅ CRUD utilisateurs
│   │   │       │   └── admin-users.component.html
│   │   │       ├── admin-roles/
│   │   │       │   ├── admin-roles.component.ts        ✅ CRUD rôles
│   │   │       │   └── admin-roles.component.html
│   │   │       ├── admin-profiles/
│   │   │       │   ├── admin-profiles.component.ts     ✅ CRUD profils
│   │   │       │   └── admin-profiles.component.html
│   │   │       └── admin-menus/
│   │   │           ├── admin-menus.component.ts        ✅ CRUD menus
│   │   │           └── admin-menus.component.html
│   │   └── articles/
│   │       ├── models/
│   │       │   └── article.model.ts       ✅ ArticleDto, ArticleFilterDto, etc.
│   │       ├── services/
│   │       │   └── article.service.ts     ✅ CRUD + filtres avec ArticleFilterDto
│   │       └── pages/
│   │           ├── article-list/
│   │           │   ├── article-list.component.ts       ✅ Liste + filtres
│   │           │   └── article-list.component.html
│   │           └── article-form/
│   │               ├── article-form.component.ts       ✅ Create/edit
│   │               └── article-form.component.html
│   ├── layout/
│   │   ├── header/
│   │   │   ├── header.component.ts        (Affiche user + logout)
│   │   │   └── header.component.html
│   │   ├── sidebar/
│   │   │   ├── sidebar.component.ts       (Menu dynamique)
│   │   │   └── sidebar.component.html
│   │   └── main-layout/
│   │       ├── main-layout.component.ts   (Shell + router-outlet)
│   │       └── main-layout.component.html
│   ├── app.config.ts                      ✅ HttpClient + interceptors
│   └── app.routes.ts                      ✅ Routes avec guards
├── environments/
│   ├── environment.ts                     ✅ gatewayUrl = http://localhost:5100
│   └── environment.prod.ts                (À adapter)
└── main.ts
```

---

## <a id="architecture"></a>🏗️ Architecture technique

### Stack
- **Angular 17+** (standalone, RxJS, Reactive Forms)
- **TypeScript** (strict mode)
- **HttpClient** avec interceptors fonctionnels
- **Guards** fonctionnels (CanActivateFn)
- **JWT** + Token refresh automatique

### Principes
1. **Feature-based**: Chaque module métier (auth, articles) est dans un dossier feature
2. **Standalone**: Pas de NgModule, utilisation de `standalone: true`
3. **Services singleton**: `providedIn: 'root'`
4. **RxJS**: Observables, BehaviorSubject pour state, debounce pour filtres
5. **Lazy loading**: Routes enfant chargées à la demande

### Flux d'authentification
1. **Login** → POST /User/IsLogin → TokenResponse (accessToken, refreshToken)
2. **TokenService** → Stocke tokens en sessionStorage ou localStorage
3. **AuthService** → Charge user avec GET /User/Users (ou fallback JWT claims)
4. **AuthInterceptor** → Attache Authorization Bearer au chaque requête
5. **401 Handling** → Refresh token automatique, retry requête, ou logout si echec

---

## <a id="flux-auth"></a>🔐 Flux d'authentification détaillé

### 1️⃣ Login (anonyme)
```
User → Form Email/Password/RememberMe
     → LoginComponent.submit()
     → AuthService.login(Login, rememberMe: boolean)
     → HTTP POST /User/IsLogin
     → ResponseLogin { accessToken, refreshToken }
     → TokenService.setTokens(tokens, rememberMe)
        ├─ Si rememberMe: localStorage
        └─ Sinon: sessionStorage
     → AuthService.loadConnectedUser()
     → GET /User/Users (optionnel, fallback JWT claims)
     → Stocke currentUser$ en BehaviorSubject
     → Router.navigate('/articles')
```

### 2️⃣ Requête HTTP protégée
```
User click article list
     → ArticleListComponent.load()
     → ArticleService.getArticles(filter)
     → HTTP GET /Stock/Articles
        ↓ AuthInterceptor
        ├─ Récupère token du TokenService
        ├─ Ajoute Authorization: Bearer {accessToken}
        └─ Envoie requête
     → Backend vérifie token JWT
     → Répond 200 + données
```

### 3️⃣ Token expiré (401)
```
User requête → 401 Unauthorized
     → AuthInterceptor.intercept()
     → Si NOT (refresh OR login endpoint):
        ├─ Appelle AuthService.refreshToken()
        ├─ HTTP POST /Auth/Refresh { accessToken, refreshToken }
        ├─ Reçoit nouveau accessToken
        ├─ TokenService.setAccessToken(newToken)
        ├─ Retrie la requête originale
        └─ Retourne réponse 200
     → Sinon: logout(true)
```

### 4️⃣ Logout
```
User click Logout
     → HeaderComponent.logout()
     → AuthService.logout()
     ├─ Appelle HTTP POST /User/Logout { refreshToken }
     ├─ TokenService.clearTokens() (sessionStorage + localStorage)
     ├─ currentUserSubject.next(null)
     └─ Router.navigate('/auth/login')
```

---

## <a id="fichiers-cles"></a>⚙️ Fichiers clés - Code et configuration

### 🔑 Configuration (environment.ts)
```typescript
export const environment = {
  production: false,
  gatewayUrl: 'http://localhost:5100',     // API Gateway
  tokenStorage: 'session' as 'local' | 'session'
};
```

### 📐 Routes (app.routes.ts)
Routes publiques:
- `/auth/login` - Formulaire login

Routes protégées (authGuard):
- `/articles` - Liste articles
- `/articles/new` - Créer article (roleGuard: Gestionnaire|Administrateur)
- `/articles/edit/:id` - Modifier article (roleGuard: Gestionnaire|Administrateur)
- `/admin/users` - CRUD utilisateurs (roleGuard: Administrateur)
- `/admin/roles` - CRUD rôles (roleGuard: Administrateur)
- `/admin/profiles` - CRUD profils (roleGuard: Administrateur)
- `/admin/menus` - CRUD menus (roleGuard: Administrateur)

### 🔌 app.config.ts
```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration()
  ]
};
```

### 🔐 Token Service (core/services/token.service.ts)
Responsable de:
- Récupération accessToken + refreshToken
- Stockage en sessionStorage (défaut) ou localStorage (remember-me)
- Clearing des tokens

### 🔐 Auth Service (core/services/auth.service.ts)
Responsable de:
- login(payload: Login, rememberMe): Observable<AuthUserState>
- logout(fromExpiredSession)
- changePassword(iduser, payload)
- refreshToken() avec queue de requêtes
- loadConnectedUser()
- currentUser$ (BehaviorSubject)
- hasAnyRole(roles[])
- hasAllPermissions(permissions[])

### 🛡️ Auth Interceptor (core/interceptors/auth.interceptor.ts)
Responsable de:
- Attacher Authorization Bearer header
- Gérer x-skip-auth pour login/refresh/logout
- Retry automatique sur 401
- Redirection logout sur refresh failure

### 🛂 Guards
- **authGuard**: userIsAuthenticated() → allow : redirect /login
- **roleGuard**: user.hasAnyRole(data.roles) → allow : redirect /login?denied=role
- **permissionGuard**: user.hasAllPermissions(data.permissions) → allow : redirect /login?denied=permission

### 📦 Services
- **AuthService**: login, logout, changePassword, refreshToken, loadConnectedUser
- **TokenService**: getAccessToken, getRefreshToken, setTokens, clearTokens
- **UserIamService**: CRUD pour User, Role, Profile, Menu (tous les endpoints /User/*)
- **MenuService**: loadMyMenus(), menus$ (BehaviorSubject)
- **ArticleService**: getArticles(filter), create, update, delete, getFournisseurs, associateFournisseur

---

## <a id="plan-sprints"></a>📅 Plan d'implémentation (3 sprints)

### Sprint 1: IAM Core (3-4 jours)
**Objectif**: Authentification, authorization, guards, menus dynamiques

Tasks:
- ✅ **Token Service** - Session/local storage switching
- ✅ **Auth Service** - Login/logout/refresh/changePassword
- ✅ **JWT Utilities** - Décodage + normalisation claims
- ✅ **Auth Interceptor** - Bearer token + 401 auto-refresh
- ✅ **Guards** - Auth/role/permission avec redirects
- ✅ **Menu Service** - Chargement menus avec fallback
- ✅ **Login Page** - Formulaire + remember-me
- ✅ **Change Password** - Formulaire validé
- ✅ **Layout Shell** - Header/sidebar/main avec menus dynamiques
- ✅ **Routes** - Configuration avec guards

Endpoints utilisés:
- POST /User/IsLogin
- POST /User/ChangePassword/{iduser}
- POST /User/Logout
- GET /User/Menus (ou fallback)
- POST /Auth/Refresh (si séparé)

Tests:
- ✅ Login successful + token storage
- ✅ 401 auto-refresh + retry
- ✅ Logout revoke token
- ✅ Route protection (auth/role/permission)
- ✅ Menus display based on roles

**Livrables**: App fonctionnelle avec login/logout, guards, menus dynamiques

---

### Sprint 2: Article CRUD + Filtres (3-4 jours)
**Objectif**: CRUD Article avec filtres, validations, gestion d'erreurs

Tasks:
- ✅ **Article Models** - ArticleDto, ArticleFilterDto, FournisseurDto
- ✅ **Article Service** - CRUD + getArticles(filter), getFournisseurs
- ✅ **Article List Page** - Tableau + filtres (search, category, fournisseur, prix)
- ✅ **Article Form** - Create/edit avec validations
- ✅ **Filter Integration** - debounce + HttpParams pour query params
- ✅ **Error Handling** - Messages d'erreur cohérents
- ✅ **Routes** - /articles, /articles/new, /articles/edit/:id avec guards

Endpoints utilisés:
- GET /Stock/Articles (avec ArticleFilterDto params)
- POST /Stock/Article
- PUT /Stock/Article/{idarticle}
- DELETE /Stock/Article/{idarticle}
- GET /Stock/Fournisseurs

Validations form:
- Nom: required
- Prix: required, number
- Quantité stock: required, number
- Seuil minimum: required, number
- Fournisseurs: multi-select optional

Tests:
- ✅ Load articles sans filtre
- ✅ Filtrer par search/category/fournisseur/prix
- ✅ Create article valid/invalid
- ✅ Edit article existing
- ✅ Delete avec confirmation
- ✅ Error handling API

**Livrables**: Article CRUD fonctionnel avec filtres et validations

---

### Sprint 3: Admin IAM Pages (3-4 jours)
**Objectif**: Pages admin pour gérer utilisateurs, rôles, profils, menus

Tasks:
- ✅ **Admin Users Page** - Liste CRUD users
  - GET /User/Users → tableau
  - POST /User/AddUser → form create
  - PUT /User/UpdUser → form edit
  - DELETE /User/{id} → à ajouter au backend si absent
- ✅ **Admin Roles Page** - Liste CRUD roles
  - GET /User/Roles
  - POST /User/Role
  - PUT /User/Role/{idrole}
  - DELETE /User/Role/{idrole}
  - Bonus: GET /User/Role/{idrole}/Menus pour assign menus
- ✅ **Admin Profiles Page** - Liste CRUD profiles
  - GET /User/Profiles
  - POST /User/Profile
  - PUT /User/Profile/{idprofil}
  - DELETE /User/Profile/{idprofil}
- ✅ **Admin Menus Page** - Liste CRUD menus
  - GET /User/Menus
  - POST /User/Menu
  - PUT /User/Menu/{idmenu}
  - DELETE /User/Menu/{idmenu}
- ✅ **Routes** - /admin/* avec roleGuard: Administrateur
- ✅ **Menu Navigation** - Sidebar affiche lien admin selon role

Tests:
- ✅ Affichage tableaux (admin roles only)
- ✅ Create/edit/delete operations
- ✅ Form validations
- ✅ Error handling
- ✅ Role-based access

**Livrables**: Pages admin fonctionnelles, gestion complète IAM

---

## 📝 Notes d'implémentation

### Backend assumptions
- Endpoint POST /User/IsLogin existe et retourne { accessToken, refreshToken }
- Endpoint POST /Auth/Refresh existe (ou POST /User/Refresh) pour token refresh
- Tous endpoints protégés require Authorization header
- ArticleFilterDto params sont optionnels (nullable)
- Erreurs retournent { Message: "..." }

### À adapter/vérifier
- GET /User/Users retourne l'utilisateur courant - VÉRIFIER si c'est l'endpoint pour "me"
  - Sinon ajouter un endpoint GET /User/Me
- DELETE /User/{iduser} - VÉRIFIER si endpoint existe
- Categories CRUD - Endpoints fournis mais pas de page UI (Sprint 4?)
- Permission-based routing - Actuellement rôle-based. À affiner si besoin permissions spécifiques

### Production readiness
- [ ] Tests unitaires (jasmine)
- [ ] Tests e2e (cypress/playwright)
- [ ] Error interceptor (toast/snackbar notifications)
- [ ] Pagination article list
- [ ] Loading spinners/skeletons
- [ ] Debounce/throttle optimisations
- [ ] HTTPS + secure cookie flags
- [ ] CSRF protection si nécessaire
- [ ] i18n (traductions multiples langues)

### Stack optionnel (post MVP)
- Material Angular ou PrimeNG pour composants
- ngrx/store pour state management
- Jest pour tests plus rapides
- Storybook pour composants
- Prettier + ESLint pour code quality

---

## 🚀 Commandes pour démarrer

```bash
# Installation dépendances
npm install

# Dev mode (watch)
npm start

# Run tests
npm test -- --watch=false --browsers=ChromeHeadless

# Build production
npm run build

# Serveur backend doit être running sur http://localhost:5100
```

---

## 📞 Support
En cas de problème:
1. Vérifier que le backend est running sur http://localhost:5100
2. Vérifier les endpoints exacts dans les contrôleurs backend
3. Ouvrir DevTools → Network pour voir les requêtes HTTP
4. Vérifier les logs console pour erreurs TypeScript
5. Tester l'interceptor en console: `localStorage.getItem('erp.accessToken')`

---

**Generated**: 21/04/2026
**Angular Version**: 17+
**TypeScript**: Strict mode
**Status**: MVP Ready ✅
