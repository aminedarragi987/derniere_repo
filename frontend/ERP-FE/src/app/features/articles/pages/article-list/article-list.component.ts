import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ArticleService } from '../../services/article.service';
import { ArticleDto, ArticleFilterDto, CategorieDto, FournisseurDto } from '../../models/article.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit, OnDestroy {

  articles: ArticleDto[] = [];
  isLoading = false;
  errorMessage = '';
  categories: CategorieDto[] = [];
  fournisseurs: FournisseurDto[] = [];
  filterForm!: FormGroup;

  private destroy$ = new Subject<void>();
  private filter$ = new Subject<ArticleFilterDto>();

  constructor(
    private service: ArticleService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.nonNullable.group({
      search: [''],
      idcategorie: [''],
      idfournisseur: [''],
      prixMin: [''],
      prixMax: ['']
    });

    this.filter$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((filter) => {
      this.applyFilter(filter);
    });
  }

  ngOnInit(): void {
    this.load();
    this.loadCategories();
    this.loadFournisseurs();
    
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const filter = this.buildFilter();
        this.filter$.next(filter);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (res) => {
        this.articles = res;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 403
          ? "Acces refuse: le role Gestionnaire est requis pour consulter les articles."
          : 'Impossible de charger les articles.';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    // A implémenter via CategorieService si disponible
    // Pour maintenant, laisser vide
  }

  loadFournisseurs(): void {
    this.service.getFournisseurs().subscribe({
      next: (res) => {
        this.fournisseurs = res;
      },
      error: () => {
        console.error('Erreur chargement fournisseurs');
      }
    });
  }

  buildFilter(): ArticleFilterDto {
    const formValue = this.filterForm.getRawValue();
    return {
      search: formValue.search || null,
      idcategorie: formValue.idcategorie ? parseInt(formValue.idcategorie) : null,
      idfournisseur: formValue.idfournisseur ? parseInt(formValue.idfournisseur) : null,
      prixMin: formValue.prixMin ? parseFloat(formValue.prixMin) : null,
      prixMax: formValue.prixMax ? parseFloat(formValue.prixMax) : null
    };
  }

  applyFilter(filter: ArticleFilterDto): void {
    this.isLoading = true;
    this.service.getArticles(filter).subscribe({
      next: (res) => {
        this.articles = res;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 403
          ? "Acces refuse: le role Gestionnaire est requis pour filtrer les articles."
          : 'Erreur lors du filtre.';
        this.isLoading = false;
      }
    });
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  create(): void {
    if (!this.canManageArticles) {
      this.errorMessage = "Action refusee: le role Gestionnaire est requis pour ajouter un article.";
      return;
    }
    this.router.navigate(['/articles/new']);
  }

  edit(id: number | undefined): void {
    if (!this.canManageArticles) {
      this.errorMessage = "Action refusee: le role Gestionnaire est requis pour modifier un article.";
      return;
    }
    if (id) {
      this.router.navigate(['/articles/edit', id]);
    }
  }

  delete(id: number | undefined): void {
    if (!this.canManageArticles) {
      this.errorMessage = "Action refusee: le role Gestionnaire est requis pour supprimer un article.";
      return;
    }
    if (!id || !confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    this.service.delete(id).subscribe({
      next: () => {
        this.load();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression.';
      }
    });
  }

  get canManageArticles(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire']);
  }
}