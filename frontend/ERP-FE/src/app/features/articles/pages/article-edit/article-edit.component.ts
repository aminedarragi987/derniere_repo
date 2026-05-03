import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ArticleService, CategorieService, AuthService, NotificationService, DataService } from '../../../../shared/services';
import { ArticleDto, CategorieDto, FournisseurDto } from '../../../../shared/models';
import { OptionItem } from '../../../../shared/services/data.service';

/**
 * Composant pour MODIFIER un article existant
 */
@Component({
  standalone: true,
  selector: 'app-article-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-edit.component.html',
  styleUrl: './article-edit.component.css'
})
export class ArticleEditComponent implements OnInit {
  form: FormGroup;
  categories: CategorieDto[] = [];
  fournisseurs: FournisseurDto[] = [];
  isLoading = false;
  isSubmitting = false;
  articleId: number = 0;

  genres: OptionItem[] = [];
  tailles: OptionItem[] = [];
  couleurs: OptionItem[] = [];
  marques: OptionItem[] = [];
  typesVetement: OptionItem[] = [];

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dataService: DataService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      prix: [0, Validators.required],
      quantitestock: [0, Validators.required],
      seuilminimum: [0, Validators.required],
      sexe: [''],
      typevetement: [''],
      marque: [''],
      couleur: [''],
      taille: [''],
      idcategorie: [null],
      fournisseurIds: [[]]
    });
  }

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.params['id']);
    
    if (!this.articleId) {
      this.notificationService.error('Article introuvable.');
      this.router.navigate(['/articles']);
      return;
    }

    this.loadEnumerations();
    this.loadCategories();
    this.loadFournisseurs();
    this.loadArticle();
  }

  private loadEnumerations(): void {
    this.genres = this.dataService.getGenres();
    this.tailles = this.dataService.getTailles();
    this.couleurs = this.dataService.getCouleurs();
    this.marques = this.dataService.getMarques();
    this.typesVetement = this.dataService.getTypesVetement();
  }

  private loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (res: CategorieDto[]) => {
        this.categories = res;
      },
      error: () => {
        this.notificationService.error('Impossible de charger les catégories.');
        this.categories = [];
      }
    });
  }

  private loadFournisseurs(): void {
    this.articleService.getFournisseurs().subscribe({
      next: (res: FournisseurDto[]) => {
        this.fournisseurs = res;
      },
      error: () => {
        this.notificationService.error('Impossible de charger les fournisseurs.');
        this.fournisseurs = [];
      }
    });
  }

  private loadArticle(): void {
    this.isLoading = true;

    this.articleService.getAll().subscribe({
      next: (list: ArticleDto[]) => {
        const article = list.find((a: ArticleDto) => a.idarticle === this.articleId);
        
        if (!article) {
          this.notificationService.error('Article introuvable.');
          this.router.navigate(['/articles']);
          return;
        }

        this.form.patchValue({
          nom: article.nom,
          description: article.description ?? '',
          prix: article.prix,
          quantitestock: article.quantitestock,
          seuilminimum: article.seuilminimum,
          sexe: article.sexe ?? '',
          typevetement: article.typevetement ?? '',
          marque: article.marque ?? '',
          couleur: article.couleur ?? '',
          taille: article.taille ?? '',
          idcategorie: article.idcategorie ?? null,
          fournisseurIds: article.fournisseurIds ?? []
        });
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement de l\'article.');
        this.router.navigate(['/articles']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSelectFournisseurs(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const ids = Array.from(select.selectedOptions).map((o) => Number(o.value));
    this.form.patchValue({ fournisseurIds: ids });
  }

  isSelectedFournisseur(id: number | undefined): boolean {
    if (!id) return false;
    const selected = (this.form.get('fournisseurIds')?.value as number[]) ?? [];
    return selected.includes(id);
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

    const payload: ArticleDto = {
      ...this.form.getRawValue(),
      idarticle: this.articleId,
      fournisseurIds: this.form.get('fournisseurIds')?.value ?? []
    };

    this.articleService.update(this.articleId, payload).subscribe({
      next: () => {
        this.notificationService.success('Article mis à jour avec succès.');
        setTimeout(() => this.router.navigate(['/articles']), 1500);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la mise à jour de l\'article.');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/articles']);
  }

  get canManageArticles(): boolean {
    return this.authService.hasAnyRole(['Administrateur', 'Gestionnaire']);
  }
}
