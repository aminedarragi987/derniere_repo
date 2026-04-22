import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserIamService } from '../../../../core/services/user-iam.service';
import { ArticleService } from '../../../articles/services/article.service';

type ServiceHealth = 'ok' | 'error';

interface DashboardKpi {
  title: string;
  value: number;
  subtitle: string;
}

interface TrendPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  errorMessage = '';

  usersCount = 0;
  articlesCount = 0;
  fournisseursCount = 0;

  usersHealth: ServiceHealth = 'ok';
  stockHealth: ServiceHealth = 'ok';

  userTrend: TrendPoint[] = [];
  articleTrend: TrendPoint[] = [];
  lowStockAlerts: ArticleSummary[] = [];

  constructor(
    private userIamService: UserIamService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.loadOverview();
  }

  get kpis(): DashboardKpi[] {
    return [
      {
        title: 'Utilisateurs',
        value: this.usersCount,
        subtitle: 'Comptes actifs'
      },
      {
        title: 'Articles',
        value: this.articlesCount,
        subtitle: 'Catalogue stock'
      },
      {
        title: 'Fournisseurs',
        value: this.fournisseursCount,
        subtitle: 'Partenaires référencés'
      }
    ];
  }

  get hasCriticalAlert(): boolean {
    return this.lowStockAlerts.length > 0;
  }

  private loadOverview(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.usersHealth = 'ok';
    this.stockHealth = 'ok';

    forkJoin({
      users: this.userIamService.getUsers().pipe(
        catchError(() => {
          this.usersHealth = 'error';
          return of([]);
        })
      ),
      articles: this.articleService.getAll().pipe(
        catchError(() => {
          this.stockHealth = 'error';
          return of([]);
        })
      ),
      fournisseurs: this.articleService.getFournisseurs().pipe(
        catchError(() => {
          this.stockHealth = 'error';
          return of([]);
        })
      )
    }).subscribe({
      next: ({ users, articles, fournisseurs }) => {
        this.usersCount = users.length;
        this.articlesCount = articles.length;
        this.fournisseursCount = fournisseurs.length;

        this.userTrend = this.createTrend(users.length);
        this.articleTrend = this.createTrend(articles.length);
        this.lowStockAlerts = articles
          .filter((article) => article.quantitestock <= article.seuilminimum)
          .sort((a, b) => a.quantitestock - b.quantitestock)
          .slice(0, 6)
          .map((article) => ({
            idarticle: article.idarticle ?? 0,
            nom: article.nom,
            quantitestock: article.quantitestock,
            seuilminimum: article.seuilminimum
          }));

        if (this.usersHealth === 'error' && this.stockHealth === 'error') {
          this.errorMessage = 'Les services IAM et Stock ne repondent pas correctement.';
        }
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le tableau de bord.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  maxTrendValue(trend: TrendPoint[]): number {
    return Math.max(...trend.map((point) => point.value), 1);
  }

  private createTrend(base: number): TrendPoint[] {
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const multipliers = [0.78, 0.84, 0.9, 0.95, 1, 1.05, 1.1];

    return labels.map((label, index) => ({
      label,
      value: Math.max(Math.round(base * multipliers[index]), 0)
    }));
  }

}

interface ArticleSummary {
  idarticle: number;
  nom: string;
  quantitestock: number;
  seuilminimum: number;
}
