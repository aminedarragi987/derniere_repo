# 📸 Guide de gestion des images pour les articles

## Structure des dossiers

Les images des articles doivent être placées dans le dossier suivant :

```
src/
└── assets/
    └── articles/          👈 Dossier des images des articles
        ├── shirt-black.svg
        ├── dress-red.svg
        ├── sneaker-blue.svg
        ├── jacket-gray.svg
        ├── pants-navy.svg
        └── placeholder.svg
```

## Formats et limitations

- **Formats acceptés** : JPG, PNG, WebP, SVG
- **Taille maximale** : 5 MB
- **Dimensions recommandées** : 400x600px (ratio 2:3 pour les vêtements)

## Comment ajouter des images

### Option 1️⃣ : Utiliser une image d'exemple

Lors de la création d'un article, vous avez 5 images d'exemple disponibles :
- T-shirt noir
- Robe rouge
- Sneaker bleu
- Veste grise
- Pantalon marine

1. Cliquez sur l'une des images d'exemple dans le formulaire
2. L'image sera assignée à l'article

### Option 2️⃣ : Uploader une image personnalisée

1. Dans le formulaire de création d'article, cliquez sur le bouton "📤 Uploader une image"
2. Sélectionnez une image de votre ordinateur
3. Un aperçu s'affichera
4. L'image sera sauvegardée lors de la création de l'article

### Option 3️⃣ : Ajouter une image manuellement en base de données

Si vous avez une image stockée ailleurs (ex: URL externe, CDN), vous pouvez la ajouter directement :

1. Placez l'image SVG ou autre dans `src/assets/articles/`
2. Le nom du fichier devient l'`imageUrl` dans la base de données
3. Exemple : `mon-article.svg` → `imageUrl: "mon-article.svg"`

## Code technique

### Service ImageService

Un service a été créé pour gérer les images : `src/app/shared/services/image.service.ts`

**Méthodes principales :**

```typescript
// Obtenir l'URL complète d'une image
getImageUrl(imageFilename: string | null): string

// Obtenir une image placeholder
getPlaceholderImage(): string

// Valider un fichier image
isValidImageFile(file: File): boolean

// Lister les images d'exemple
getExampleImages(): { filename: string; label: string }[]
```

### Utilisation dans les composants

```typescript
// Dans un composant
import { ImageService } from '../../../../shared/services';

export class MonComposant {
  constructor(private imageService: ImageService) {}

  getImageUrl(article: ArticleDto): string {
    return this.imageService.getImageUrl(article.imageUrl || null);
  }
}
```

### Utilisation dans les templates

```html
<!-- Template Angular -->
<img [src]="getImageUrl(article)" [alt]="article.nom" />
```

## Modèle ArticleDto

Le modèle article inclut le champ `imageUrl` :

```typescript
export interface ArticleDto {
  idarticle?: number;
  nom: string;
  // ... autres champs ...
  imageUrl?: string | null;  // 👈 Champ pour l'image
  // ... autres champs ...
}
```

## Exemples de données

### Article avec image
```json
{
  "idarticle": 1,
  "nom": "T-shirt Premium",
  "imageUrl": "shirt-black.svg",
  "prix": 199.99,
  "quantitestock": 50
}
```

### Article sans image (utilise placeholder)
```json
{
  "idarticle": 2,
  "nom": "Robe de soirée",
  "imageUrl": null,
  "prix": 599.99,
  "quantitestock": 10
}
```

## Affichage des images

### Dans la liste des articles
- Les images s'affichent dans la grille avec un ratio 1:1
- Si pas d'image : affiche le placeholder gris
- Au survol : un overlay avec les boutons d'action

### Dans la fiche de détail
- L'image s'affiche en grand
- Si pas d'image : affiche le placeholder

## Bonne pratique

✅ **À faire :**
- Utilisez des formats SVG pour les illustrations légères
- Utilisez PNG/JPG pour les photos réelles
- Nommez les fichiers de manière claire : `shirt-black.svg`, `dress-red.svg`
- Compressez les images avant d'uploader (tinypng.com, squoosh.app)

❌ **À éviter :**
- Ne pas uploader des fichiers > 5 MB
- Ne pas utiliser les noms génériques : `image1.jpg`, `photo.png`
- Ne pas mettre d'espaces dans les noms de fichiers

## Dépannage

**Le placeholder s'affiche au lieu de l'image :**
- Vérifiez que le fichier existe dans `src/assets/articles/`
- Vérifiez le nom exact du fichier (case-sensitive)
- Vérifiez que l'`imageUrl` dans la DB correspond au nom du fichier

**L'image est déformée :**
- Vérifiez les dimensions de l'image
- Utilisez les dimensions recommandées : 400x600px

**L'upload ne fonctionne pas :**
- Vérifiez la taille du fichier (< 5 MB)
- Vérifiez le format (JPG, PNG, WebP, SVG)
- Vérifiez les permissions du dossier `src/assets/articles/`

## Architecture du système

```
article.model.ts (interface)
    ↓
article.service.ts (API communication)
    ↓
image.service.ts (gestion des URLs et validation)
    ↓
article-add.component.ts (upload et sélection)
article-list.component.ts (affichage en grille)
article-detail.component.ts (affichage détail)
    ↓
src/assets/articles/ (stockage des fichiers)
```

---

**Images disponibles :** `shirt-black.svg`, `dress-red.svg`, `sneaker-blue.svg`, `jacket-gray.svg`, `pants-navy.svg`, `placeholder.svg`
