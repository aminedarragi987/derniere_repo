import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../shared/services';
import { DashboardStockDto } from '../../../shared/models';

interface TrendPoint {
  label: string;
  value: number;
}

interface MetricPoint {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  dashboard: DashboardStockDto | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  get validationRate(): number {
    const total = this.dashboard?.nombreCommandes ?? 0;
    const validated = this.dashboard?.nombreCommandesValidees ?? 0;

    if (total <= 0) {
      return 0;
    }

    return Math.round((validated / total) * 100);
  }

  get ordersTrend(): TrendPoint[] {
    const base = this.dashboard?.nombreCommandes ?? 0;
    return this.createTrend(base);
  }

  get stockMetrics(): MetricPoint[] {
    if (!this.dashboard) {
      return [];
    }

    return [
      { label: 'Articles', value: this.dashboard.nombreArticles, color: '#1d4ed8' },
      { label: 'Fournisseurs', value: this.dashboard.nombreFournisseurs, color: '#0f766e' },
      { label: 'En alerte', value: this.dashboard.nombreArticlesEnAlerte, color: '#dc2626' }
    ];
  }

  get maxStockMetric(): number {
    return Math.max(...this.stockMetrics.map((metric) => metric.value), 1);
  }

  get ordersDonutGradient(): string {
    const total = this.dashboard?.nombreCommandes ?? 0;
    const validated = this.dashboard?.nombreCommandesValidees ?? 0;
    const pending = Math.max(total - validated, 0);
    const safeTotal = Math.max(total, 1);
    const split = (validated / safeTotal) * 100;

    return `conic-gradient(#16a34a 0% ${split}%, #f59e0b ${split}% 100%)`;
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

  loadDashboard(): void {
    this.loading = true;
    this.error = '';

    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger le dashboard';
        this.loading = false;
      }
    });
  }

  private createTrend(base: number): TrendPoint[] {
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const multipliers = [0.74, 0.81, 0.88, 0.93, 1, 1.08, 1.14];

    return labels.map((label, index) => ({
      label,
      value: Math.max(Math.round(base * multipliers[index]), 0)
    }));
  }
}