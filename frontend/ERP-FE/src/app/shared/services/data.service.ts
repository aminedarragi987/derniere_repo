/* src/app/shared/services/data.service.ts */
import { Injectable } from '@angular/core';

export interface OptionItem {
  id: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  // Genres
  private readonly genres: OptionItem[] = [
    { id: 'Homme', label: 'Homme' },
    { id: 'Femme', label: 'Femme' },
    { id: 'Unisexe', label: 'Unisexe' },
    { id: 'Enfant', label: 'Enfant' }
  ];

  // Tailles
  private readonly tailles: OptionItem[] = [
    { id: 'XS', label: 'XS' },
    { id: 'S', label: 'S' },
    { id: 'M', label: 'M' },
    { id: 'L', label: 'L' },
    { id: 'XL', label: 'XL' },
    { id: 'XXL', label: 'XXL' }
  ];

  // Couleurs
  private readonly couleurs: OptionItem[] = [
    { id: 'Noir', label: 'Noir' },
    { id: 'Blanc', label: 'Blanc' },
    { id: 'Rouge', label: 'Rouge' },
    { id: 'Bleu', label: 'Bleu' },
    { id: 'Vert', label: 'Vert' },
    { id: 'Jaune', label: 'Jaune' },
    { id: 'Orange', label: 'Orange' },
    { id: 'Rose', label: 'Rose' },
    { id: 'Violet', label: 'Violet' },
    { id: 'Gris', label: 'Gris' },
    { id: 'Marron', label: 'Marron' },
    { id: 'Beige', label: 'Beige' }
  ];

  // Marques
  private readonly marques: OptionItem[] = [
    { id: 'Nike', label: 'Nike' },
    { id: 'Adidas', label: 'Adidas' },
    { id: 'Puma', label: 'Puma' },
    { id: 'Reebok', label: 'Reebok' },
    { id: 'Lacoste', label: 'Lacoste' },
    { id: 'Tommy Hilfiger', label: 'Tommy Hilfiger' },
    { id: 'Calvin Klein', label: 'Calvin Klein' },
    { id: 'Ralph Lauren', label: 'Ralph Lauren' },
    { id: 'H&M', label: 'H&M' },
    { id: 'Zara', label: 'Zara' },
    { id: 'Gap', label: 'Gap' },
    { id: 'Uniqlo', label: 'Uniqlo' }
  ];

  // Types de vêtement
  private readonly typesVetement: OptionItem[] = [
    { id: 'T-shirt', label: 'T-shirt' },
    { id: 'Chemise', label: 'Chemise' },
    { id: 'Pantalon', label: 'Pantalon' },
    { id: 'Short', label: 'Short' },
    { id: 'Robe', label: 'Robe' },
    { id: 'Jupe', label: 'Jupe' },
    { id: 'Veste', label: 'Veste' },
    { id: 'Sweat', label: 'Sweat' },
    { id: 'Hoodie', label: 'Hoodie' },
    { id: 'Cardigan', label: 'Cardigan' },
    { id: 'Manteau', label: 'Manteau' },
    { id: 'Blouson', label: 'Blouson' },
    { id: 'Pull', label: 'Pull' },
    { id: 'Pullover', label: 'Pullover' },
    { id: 'Gilet', label: 'Gilet' }
  ];

  constructor() {}

  getGenres(): OptionItem[] {
    return [...this.genres];
  }

  getTailles(): OptionItem[] {
    return [...this.tailles];
  }

  getCouleurs(): OptionItem[] {
    return [...this.couleurs];
  }

  getMarques(): OptionItem[] {
    return [...this.marques];
  }

  getTypesVetement(): OptionItem[] {
    return [...this.typesVetement];
  }

  getGenreLabel(id: string): string {
    return this.genres.find(g => g.id === id)?.label || id || 'N/A';
  }

  getTailleLabel(id: string): string {
    return this.tailles.find(t => t.id === id)?.label || id || 'N/A';
  }

  getCouleurLabel(id: string): string {
    return this.couleurs.find(c => c.id === id)?.label || id || 'N/A';
  }

  getMarqueLabel(id: string): string {
    return this.marques.find(m => m.id === id)?.label || id || 'N/A';
  }

  getTypeVetementLabel(id: string): string {
    return this.typesVetement.find(t => t.id === id)?.label || id || 'N/A';
  }
}
