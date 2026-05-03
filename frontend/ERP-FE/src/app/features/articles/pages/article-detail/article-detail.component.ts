import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ArticleService, CategorieService, AuthService, DataService, NotificationService, ImageService } from '../../../../shared/services';
import { ArticleDto, CategorieDto, FournisseurDto } from '../../../../shared/models';
import { OptionItem } from '../../../../shared/services/data.service';

@Component({
  standalone: true,
  selector: 'app-article-detail',
  imports: [CommonModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: ArticleDto | null = null;
  category: CategorieDto | null = null;
  fournisseurs: FournisseurDto[] = [];
  isLoading = false;
  errorMessage = '';
  articleId: number = 0;

  constructor(
    private articleService: ArticleService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.params['id']);
    
    if (!this.articleId) {
      this.notificationService.error('Article introuvable.');
      this.router.navigate(['/articles']);
      return;
    }

    this.loadArticle();
    this.loadFournisseurs();
  }

  private loadArticle(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.articleService.getAll().subscribe({
      next: (list: ArticleDto[]) => {
        const found = list.find(a => a.idarticle === this.articleId);
        
        if (!found) {
          this.notificationService.error('Article introuvable.');
          this.router.navigate(['/articles']);
          return;
        }

        this.article = found;

        // Charger la catégorie
        if (found.idcategorie) {
          this.categorieService.getCategories().subscribe({
            next: (categories: CategorieDto[]) => {
              this.category = categories.find(c => c.idcategorie === found.idcategorie) || null;
            }
          });
        }

        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Erreur lors du chargement de l\'article.';
        this.isLoading = false;
      }
    });
  }

  private loadFournisseurs(): void {
    this.articleService.getFournisseurs().subscribe({
      next: (res: FournisseurDto[]) => {
        this.fournisseurs = res;
      },
      error: () => {
        this.fournisseurs = [];
      }
    });
  }

  getGenreLabel(id: string | null | undefined): string {
    return this.dataService.getGenreLabel(id || '');
  }

  getTailleLabel(id: string | null | undefined): string {
    return this.dataService.getTailleLabel(id || '');
  }

  getCouleurLabel(id: string | null | undefined): string {
    return this.dataService.getCouleurLabel(id || '');
  }

  getMarqueLabel(id: string | null | undefined): string {
    return this.dataService.getMarqueLabel(id || '');
  }

  getTypeVetementLabel(id: string | null | undefined): string {
    return this.dataService.getTypeVetementLabel(id || '');
  }

  getFournisseurNames(): string {
    if (!this.article || !this.article.fournisseurIds || this.article.fournisseurIds.length === 0) {
      return 'Aucun';
    }

    return this.article.fournisseurIds
      .map(id => this.fournisseurs.find(f => f.idfournisseur === id)?.nom)
      .filter(name => name)
      .join(', ');
  }

  isInAlert(): boolean {
    if (!this.article) return false;
    return this.article.quantitestock <= this.article.seuilminimum;
  }

  goBack(): void {
    this.router.navigate(['/articles']);
  }

  edit(): void {
    if (!this.canManageArticles || !this.article?.idarticle) return;
    this.router.navigate(['/articles/edit', this.article.idarticle]);
  }

  delete(): void {
    if (!this.canManageArticles || !this.article?.idarticle) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    this.articleService.delete(this.article.idarticle).subscribe({
      next: () => {
        this.notificationService.success('Article supprimé avec succès.');
        setTimeout(() => this.router.navigate(['/articles']), 1500);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la suppression.');
      }
    });
  }

  /**
   * Retourne l'URL de l'image pour l'article
   */
  getImageUrl(): string {
    if (!this.article) {
      return this.imageService.getPlaceholderImage();
    }
    return this.imageService.getImageUrl(this.article.imageUrl || null);
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
