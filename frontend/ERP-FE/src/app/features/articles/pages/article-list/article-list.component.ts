/* src/app/features/articles/pages/article-list/article-list.component.ts */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import {
  ArticleService,
  CategorieService,
  AuthService,
  DataService,
  ImageService
} from '../../../../shared/services';

import {
  ArticleDto,
  ArticleFilterDto,
  CategorieDto
} from '../../../../shared/models';

import { OptionItem } from '../../../../shared/services/data.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: ArticleDto[] = [];
  categories: CategorieDto[] = [];

  genres: OptionItem[] = [];
  tailles: OptionItem[] = [];
  couleurs: OptionItem[] = [];
  marques: OptionItem[] = [];
  typesVetement: OptionItem[] = [];

  isLoading = false;
  errorMessage = '';

  filterForm!: FormGroup;

  private destroy$ = new Subject<void>();
  private filter$ = new Subject<ArticleFilterDto>();

  constructor(
    private service: ArticleService,
    private categorieService: CategorieService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private imageService: ImageService
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      sexe: [''],
      typevetement: [''],
      marque: [''],
      couleur: [''],
      taille: [''],
      prixMin: [''],
      prixMax: ['']
    });

    this.filter$
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filter: ArticleFilterDto) => this.applyFilter(filter));
  }

  ngOnInit(): void {
    this.loadEnumerations();
    this.load();
    this.loadCategories();

    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.filter$.next(this.buildFilter()));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEnumerations(): void {
    this.genres = this.dataService.getGenres();
    this.tailles = this.dataService.getTailles();
    this.couleurs = this.dataService.getCouleurs();
    this.marques = this.dataService.getMarques();
    this.typesVetement = this.dataService.getTypesVetement();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.service.getAll().subscribe({
      next: (res: ArticleDto[]) => {
        this.articles = res.map(a => ({
          ...a,
          imageUrl: (a as any).imageUrl || this.getFakeImage(a.nom)
        }));
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.status === 403
            ? 'Accès refusé : rôle Gestionnaire requis.'
            : 'Impossible de charger les articles.';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categorieService.getCategories().subscribe({
      next: (res: CategorieDto[]) => (this.categories = res),
      error: () => (this.categories = [])
    });
  }

  buildFilter(): ArticleFilterDto {
    const formValue = this.filterForm.getRawValue();

    return {
      search: formValue.search || null,
      idcategorie: null,
      idfournisseur: null,
      sexe: formValue.sexe || null,
      typevetement: formValue.typevetement || null,
      marque: formValue.marque || null,
      couleur: formValue.couleur || null,
      taille: formValue.taille || null,
      prixMin: formValue.prixMin ? Number(formValue.prixMin) : null,
      prixMax: formValue.prixMax ? Number(formValue.prixMax) : null
    };
  }

  applyFilter(filter: ArticleFilterDto): void {
    this.isLoading = true;

    this.service.getArticles(filter).subscribe({
      next: (res: ArticleDto[]) => {
        this.articles = res.map(a => ({
          ...a,
          imageUrl: (a as any).imageUrl || this.getFakeImage(a.nom)
        }));
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage =
          error.status === 403
            ? 'Accès refusé : rôle Gestionnaire requis.'
            : 'Erreur lors du filtre.';
        this.isLoading = false;
      }
    });
  }

  clearFilter(): void {
    this.filterForm.reset({
      search: '',
      sexe: '',
      typevetement: '',
      marque: '',
      couleur: '',
      taille: '',
      prixMin: '',
      prixMax: ''
    });

    this.load();
  }

  getCategoryName(article: ArticleDto): string {
    if (article.categorieNom) return article.categorieNom;
    return this.categories.find(c => c.idcategorie === article.idcategorie)?.nom ?? '-';
  }

  getFakeImage(name: string): string {
    return `https://source.unsplash.com/600x800/?fashion,clothing,${encodeURIComponent(name)}`;
  }

  create(): void {
    if (!this.canManageArticles) return;
    this.router.navigate(['/articles/new']);
  }

  viewDetail(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/articles', id]);
  }

  goToFournisseurs(): void {
    this.router.navigate(['/fournisseurs']);
  }

  edit(id: number | undefined): void {
    if (!this.canManageArticles || !id) return;
    this.router.navigate(['/articles/edit', id]);
  }

  delete(id: number | undefined): void {
    if (!this.canManageArticles || !id || !confirm('Êtes-vous sûr ?')) return;

    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: () => (this.errorMessage = 'Erreur lors de la suppression.')
    });
  }

  isInAlert(article: ArticleDto): boolean {
    return article.quantitestock <= article.seuilminimum;
  }

  /**
   * Retourne l'URL de l'image pour un article
   */
  getImageUrl(article: ArticleDto): string {
    return this.imageService.getImageUrl(article.imageUrl || null);
  }

  /**
   * Gère l'erreur de chargement d'image
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.imageService.getPlaceholderImage();
  }

  get canManageArticles(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire', 'Administrateur']);
  }
}