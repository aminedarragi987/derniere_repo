/**
 * Service pour gérer les images des articles
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  
  // Dossier où stocker les images
  private readonly ARTICLES_IMAGES_PATH = 'assets/articles/';

  constructor() { }

  /**
   * Retourne l'URL complète d'une image
   * Gère : fichiers locaux, base64 data URLs, chemins multiples
   */
  getImageUrl(imageFilename: string | null): string {
    if (!imageFilename) {
      return this.getPlaceholderImage();
    }

    // Si c'est déjà une data URL (base64), la retourner directement
    if (imageFilename.startsWith('data:')) {
      return imageFilename;
    }

    // Si c'est déjà un chemin complet (commence par 'assets/'), le retourner directement
    if (imageFilename.startsWith('assets/')) {
      return imageFilename;
    }

    // Si le chemin contient un '/' (ex: brand/surchemise_gris.jpg), ajouter 'assets/'
    if (imageFilename.includes('/')) {
      return `assets/${imageFilename}`;
    }

    // Sinon, c'est juste un nom de fichier → le mettre dans assets/articles/
    return `${this.ARTICLES_IMAGES_PATH}${imageFilename}`;
  }

  /**
   * Retourne une image placeholder par défaut
   */
  getPlaceholderImage(): string {
    return `${this.ARTICLES_IMAGES_PATH}placeholder.svg`;
  }

  /**
   * Convertit un fichier uploadé en base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Valide si le fichier est une image
   */
  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type)) {
      return false;
    }

    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  /**
   * Liste les images d'exemple disponibles
   */
  getExampleImages(): { filename: string; label: string }[] {
    return [
      { filename: 'shirt-black.svg', label: 'T-shirt noir' },
      { filename: 'dress-red.svg', label: 'Robe rouge' },
      { filename: 'sneaker-blue.svg', label: 'Sneaker bleu' },
      { filename: 'jacket-gray.svg', label: 'Veste grise' },
      { filename: 'pants-navy.svg', label: 'Pantalon marine' }
    ];
  }
}
