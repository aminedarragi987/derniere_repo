import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserIamService } from '../../../../shared/services';
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

interface DonutSegment {
  label: string;
  value: number;
  color: string;
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

  get stockSegments(): DonutSegment[] {
    const critical = this.lowStockAlerts.length;
    const normal = Math.max(this.articlesCount - critical, 0);

    return [
      { label: 'Stock normal', value: normal, color: '#16a34a' },
      { label: 'Sous seuil', value: critical, color: '#dc2626' }
    ];
  }

  get stockDonutGradient(): string {
    const segments = this.stockSegments;
    const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
    let offset = 0;

    const parts = segments.map((segment) => {
      const start = (offset / total) * 100;
      offset += segment.value;
      const end = (offset / total) * 100;
      return `${segment.color} ${start}% ${end}%`;
    });

    return `conic-gradient(${parts.join(', ')})`;
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

  trendPath(trend: TrendPoint[], width = 420, height = 170, padding = 18): string {
    if (trend.length === 0) {
      return '';
    }

    const max = this.maxTrendValue(trend);
    const stepX = trend.length > 1 ? (width - padding * 2) / (trend.length - 1) : 0;

    return trend
      .map((point, index) => {
        const x = padding + index * stepX;
        const y = height - padding - (point.value / max) * (height - padding * 2);
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
  }

  trendDots(trend: TrendPoint[], width = 420, height = 170, padding = 18): Array<{ x: number; y: number; value: number; label: string }> {
    if (trend.length === 0) {
      return [];
    }

    const max = this.maxTrendValue(trend);
    const stepX = trend.length > 1 ? (width - padding * 2) / (trend.length - 1) : 0;

    return trend.map((point, index) => ({
      x: padding + index * stepX,
      y: height - padding - (point.value / max) * (height - padding * 2),
      value: point.value,
      label: point.label
    }));
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
