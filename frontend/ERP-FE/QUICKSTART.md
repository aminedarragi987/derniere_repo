# 🚀 Quick Start Guide - Frontend Angular ERP

## Démarrage en 5 minutes

### Prérequis
- Node.js 18+ et npm 9+
- Angular CLI 17+
- Backend running sur http://localhost:5100
  - User.API sur 5100/User/...
  - Auth sur 5100/Auth/... (ou /User/IsLogin)
  - Stock sur 5100/Stock/...

### 1. Installation
```bash
cd d:\ERPMs\ERPMs\frontend\ERP-FE
npm install
```

### 2. Configuration environment
Vérifier `src/environments/environment.ts`:
```typescript
gatewayUrl: 'http://localhost:5100'  // Adapter si backend est ailleurs
```

### 3. Démarrer en dev
```bash
npm start
```

Ouvre automatiquement http://localhost:4300

### 4. Premier login
- Email: (créé dans ton backend)
- Password: (créé dans ton backend)
- Remember me: ☑️ (stock token en localStorage)
- Submit → Redirect /articles si succès

---

## ✅ Checklist de vérification

### Backend prêt?
```bash
curl http://localhost:5100/User/Roles
# Doit retourner 200 + array de rôles (ou 401 si sans token)
```

### Frontend compile?
```bash
npm run build
# Doit créer dist/ sans erreurs
```

### Token stocké?
Dans DevTools Console:
```javascript
localStorage.getItem('erp.accessToken')  // Doit afficher un JWT
```

### Requête HTTP OK?
Dans DevTools Network:
```
GET http://localhost:5100/Stock/Articles
Headers: Authorization: Bearer {token}
Response: 200 + [ArticleDto...]
```

---

## 🧪 Test Scenarios

### Scenario 1: Login → Logout
```
1. Accède http://localhost:4300
2. Vois page login (redirecté automatiquement)
3. Entre credentials
4. Soumets form
5. Vois "Chargement..." puis redirect /articles
6. Clique Logout (header)
7. Vois login page again
✅ Token bien stocké/effacé
```

### Scenario 2: Article CRUD
```
1. Login réussi
2. Navigues vers /articles
3. Vois liste articles
4. Cliques "+ Ajouter article"
5. Fills form (nom, prix, quantité, seuil)
6. Cliques Enregistrer
7. Reviens à liste
8. Cherches article créé
9. Cliques "Modifier"
10. Changes prix
11. Enregistres
12. Cliques "Supprimer" + confirm
13. Article disparu de liste
✅ CRUD fonctionne
```

### Scenario 3: Article Filtres
```
1. Login
2. /articles
3. Entre "test" en recherche
4. Attends 300ms
5. Vois articles filtrés
6. Sélectionnes fournisseur dropdown
7. Change prix min/max
8. Filtres appliqués en temps réel
✅ Filtres avec debounce
```

### Scenario 4: Admin Pages (si role Admin)
```
1. Login avec Admin
2. Sidebar affiche Utilisateurs, Rôles, Profils, Menus
3. Cliques Rôles
4. Vois liste des rôles
5. Cliques "+ Ajouter rôle"
6. Entre nom + description
7. Enregistres
8. Vois rôle en liste
✅ Admin pages accessible
```

### Scenario 5: Token Refresh
```
1. Login → Accès token stocké
2. Attends ~15min (token expire)
3. Cliques article list (requête)
4. Backend répond 401
5. AuthInterceptor appelle refresh
6. Reçoit nouveau accessToken
7. Retry article list
8. Reçoit 200 + articles
✅ Auto refresh fonctionne
9. Pas de redirect login
```

---

## 📊 Architecture Overview (Mermaid)

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────┐           │
│  │ Angular 17 App (Port 4300)             │           │
│  ├────────────────────────────────────────┤           │
│  │ Components:                            │           │
│  │  - Login/ChangePassword                │           │
│  │  - ArticleList/ArticleForm             │           │
│  │  - AdminUsers/Roles/Profiles/Menus     │           │
│  │                                        │           │
│  │ Services:                              │           │
│  │  - AuthService (login/logout/refresh)  │           │
│  │  - TokenService (storage)              │           │
│  │  - ArticleService (CRUD + filtres)    │           │
│  │  - UserIamService (CRUD IAM)          │           │
│  │  - MenuService (menus dynamiques)      │           │
│  │                                        │           │
│  │ Guards:                                │           │
│  │  - authGuard (authenticated)           │           │
│  │  - roleGuard (has role)                │           │
│  │  - permissionGuard (has all perms)     │           │
│  │                                        │           │
│  │ Interceptors:                          │           │
│  │  - authInterceptor (Bearer + 401)      │           │
│  └────────────────────────────────────────┘           │
│                     ↕                                  │
│  ┌────────────────────────────────────────┐           │
│  │ Storage (session/localStorage)         │           │
│  │  - erp.accessToken                     │           │
│  │  - erp.refreshToken                    │           │
│  └────────────────────────────────────────┘           │
│                     ↕                                  │
│  ┌────────────────────────────────────────┐           │
│  │ HTTP Client (HttpClientModule)         │           │
│  └────────────────────────────────────────┘           │
│                     ↕                                  │
└─────────────────────────────────────────────────────────┘
                      ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│  API Gateway (Port 5100)                                │
├─────────────────────────────────────────────────────────┤
│  Routes:                                                │
│  /User/* → User.API                                    │
│  /Auth/* → Auth.API (ou /User/IsLogin)                │
│  /Stock/* → Gestion_de_stock.API                      │
└─────────────────────────────────────────────────────────┘
         ↕ Routes
┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐
│ User.API         │ │ Auth.API         │ │ Stock.API    │
│ /Users           │ │ /IsLogin         │ │ /Articles    │
│ /Roles           │ │ /Refresh         │ │ /Fournisseurs│
│ /Profiles        │ │ /Logout          │ │ /Categories  │
│ /Menus           │ │                  │ │              │
└──────────────────┘ └──────────────────┘ └──────────────┘
```

---

## 📝 Fichiers modifiés/créés

### Modifiés depuis initial:
- ✅ `src/app/core/services/auth.service.ts` - Login endpoint changé
- ✅ `src/app/core/services/user-iam.service.ts` - Tous endpoints +implemented
- ✅ `src/app/core/services/menu.service.ts` - getMenus() appel + fallback
- ✅ `src/app/features/auth/pages/login/login.component.ts` - Handle rememberMe
- ✅ `src/app/features/auth/models/auth.models.ts` - Login/ResponseLogin
- ✅ `src/app/features/auth/models/user.models.ts` - UtilisateurDto, etc.
- ✅ `src/app/features/articles/models/article.model.ts` - ArticleFilterDto
- ✅ `src/app/features/articles/services/article.service.ts` - Filtres implémentés
- ✅ `src/app/features/articles/pages/article-list/article-list.component.ts` - Filtres
- ✅ `src/app/features/articles/pages/article-list/article-list.component.html` - Filter form
- ✅ `src/app/features/articles/pages/article-form/article-form.component.ts` - Validations
- ✅ `src/app/app.routes.ts` - Admin routes ajoutées
- ✅ `src/environments/environment.ts` - Simplifié gatewayUrl

### Créés:
- ✅ `src/app/features/auth/pages/admin-users/` - CRUD users
- ✅ `src/app/features/auth/pages/admin-roles/` - CRUD roles
- ✅ `src/app/features/auth/pages/admin-profiles/` - CRUD profiles
- ✅ `src/app/features/auth/pages/admin-menus/` - CRUD menus
- ✅ `IMPLEMENTATION_GUIDE.md` - Guide complet
- ✅ `FILES_REFERENCE.md` - Référence fichiers
- ✅ `QUICKSTART.md` - Ce fichier

---

## 🔧 Troubleshooting

### Erreur: "Cannot find module '@angular/common'"
```bash
npm install
```

### Erreur: "POST /User/IsLogin 404"
Backend endpoint missing ou URL incorrect
- Vérifier contrôleur User.API
- Vérifier route [Route("IsLogin")] [HttpPost]

### Erreur: "CORS error"
Backend n'a pas les bons headers CORS
```csharp
// Dans Program.cs backend:
builder.Services.AddCors(options => {
    options.AddPolicy("CORSPolicy", builder => {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
app.UseCors("CORSPolicy");
```

### Erreur: "Token absent"
TokenService.getAccessToken() retourne null
- Vérifier localStorage/sessionStorage en DevTools
- Vérifier que login a bien stocké le token

### Erreur: "401 Unauthorized" (boucle infinie)
Refresh token aussi expiré
- Vérifier que endpoint refresh retourne nouveau token
- Vérifier TokenService.setAccessToken() après refresh

### Article list vide après login
- Vérifier que user a rôle Gestionnaire
- Vérifier que backend retourne articles
- Vérifier erreur en console

---

## 📚 Documentation supplémentaire

- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Architecture + plan 3 sprints
- [FILES_REFERENCE.md](./FILES_REFERENCE.md) - Référence détaillée fichiers + DTOs
- [Angular Docs](https://angular.io/docs) - Documentation officielle
- [RxJS Docs](https://rxjs.dev) - Observables, operators
- [HTTP Interceptors](https://angular.io/api/common/http/HttpInterceptor) - Interceptors guide

---

## 💡 Prochaines étapes

Après MVP (3 sprints):
1. **Error Interceptor** - Toast notifications pour erreurs
2. **Pagination** - Articles list avec pagination
3. **Categories CRUD** - Page admin categories
4. **Clients CRUD** - Gestion clients
5. **Commandes** - Workflow commandes
6. **Factures** - Génération + paiements
7. **Tests** - Unit + e2e
8. **i18n** - Traductions multiples langues
9. **Material UI** - Composants Material Angular
10. **Dark Mode** - Thème clair/sombre

---

## 📞 Besoin d'aide?

1. Vérifier console browser (F12)
2. Vérifier Network tab pour requêtes HTTP
3. Vérifier localStorage: `localStorage.getItem('erp.accessToken')`
4. Vérifier backend logs (voir erreur exacte)
5. Relancer npm start si problème cache
6. Vérifier endpoints exacts dans tes controllers backend

---

**Status**: ✅ MVP Ready - IAM + Article CRUD implémentés
**Version**: 1.0.0
**Date**: 21/04/2026
**Angular**: 17+
**Node**: 18+
