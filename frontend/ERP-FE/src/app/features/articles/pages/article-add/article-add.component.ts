import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ArticleService, AuthService, NotificationService, DataService, ImageService } from '../../../../shared/services';
import { ArticleDto } from '../../../../shared/models';
import { OptionItem } from '../../../../shared/services/data.service';

/**
 * Composant pour AJOUTER un nouvel article
 */
@Component({
  standalone: true,
  selector: 'app-article-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-add.component.html',
  styleUrl: './article-add.component.css'
})
export class ArticleAddComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;

  genres: OptionItem[] = [];
  tailles: OptionItem[] = [];
  couleurs: OptionItem[] = [];
  marques: OptionItem[] = [];
  typesVetement: OptionItem[] = [];

  // Gestion des images
  imagePreview: string | null = null;
  exampleImages: { filename: string; label: string }[] = [];
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dataService: DataService,
    private imageService: ImageService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prix: [0, Validators.required],
      quantitestock: [0, Validators.required],
      seuilminimum: [0, Validators.required],
      sexe: [''],
      typevetement: [''],
      marque: [''],
      couleur: [''],
      taille: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadEnumerations();
    this.exampleImages = this.imageService.getExampleImages();
  }

  private loadEnumerations(): void {
    this.genres = this.dataService.getGenres();
    this.tailles = this.dataService.getTailles();
    this.couleurs = this.dataService.getCouleurs();
    this.marques = this.dataService.getMarques();
    this.typesVetement = this.dataService.getTypesVetement();
  }

  save(): void {
    if (!this.canManageArticles) {
      this.notificationService.error('Action refusée.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Veuillez remplir les champs obligatoires.');
      return;
    }

    this.isSubmitting = true;

    const payload: ArticleDto = this.form.getRawValue();

    this.articleService.create(payload).subscribe({
      next: () => {
        this.notificationService.success('Article créé avec succès.');
        setTimeout(() => this.router.navigate(['/articles']), 1500);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la création de l\'article.');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/articles']);
  }

  // ====== Gestion des images ======

  /**
   * Sélectionner une image d'exemple
   */
  selectExampleImage(filename: string): void {
    const imageUrl = this.imageService.getImageUrl(filename);
    this.form.patchValue({ imageUrl });
    this.imagePreview = imageUrl;
  }

  /**
   * Gérer le changement du chemin manuel
   */
  onImagePathChange(): void {
    const path = this.form.get('imageUrl')?.value;
    if (!path) {
      this.imagePreview = null;
      return;
    }

    // Si c'est déjà une data URL (base64), l'utiliser directement
    if (path.startsWith('data:')) {
      this.imagePreview = path;
      return;
    }

    // Sinon, construire l'URL complète pour l'assets
    let fullUrl = path;
    if (!path.startsWith('assets/')) {
      fullUrl = `assets/${path}`;
    }

    this.imagePreview = fullUrl;
  }

  /**
   * Gérer l'upload d'un fichier image
   */
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Valider le fichier
    if (!this.imageService.isValidImageFile(file)) {
      this.notificationService.error('Format d\'image invalide ou fichier trop volumineux (max 5MB).');
      return;
    }

    // Stocker le fichier
    this.selectedImageFile = file;

    // Créer un preview et stocker en base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.imagePreview = base64String;
      // Stocker l'image en base64 (sera sauvegardée en BD)
      this.form.patchValue({ imageUrl: base64String });
      // Notification de confirmation
      this.notificationService.success(`Image "${file.name}" chargée avec succès!`);
    };
    reader.onerror = () => {
      this.notificationService.error('Erreur lors de la lecture du fichier.');
    };
    reader.readAsDataURL(file);
  }

  /**
   * Supprimer l'image sélectionnée
   */
  removeImage(): void {
    this.form.patchValue({ imageUrl: '' });
    this.imagePreview = null;
    this.selectedImageFile = null;
  }

  get canManageArticles(): boolean {
    return this.authService.hasAnyRole(['Administrateur', 'Gestionnaire']);
  }
}
