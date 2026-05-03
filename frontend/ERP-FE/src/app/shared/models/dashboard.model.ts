// ========== LEGACY DTO (Compatibilité avec l'API) ==========
export interface DashboardStockDto {
  nombreArticles: number;
  nombreFournisseurs: number;
  nombreCommandes: number;
  nombreCommandesValidees: number;
  nombreArticlesEnAlerte: number;
  chiffreAffaires: number;
}

// ========== ENUMS ==========
export enum DashboardMetricType {
  ARTICLES = 'articles',
  FOURNISSEURS = 'fournisseurs',
  COMMANDES = 'commandes',
  FACTURES = 'factures'
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable'
}

// ========== INTERFACES ==========

/**
 * Point de données pour les tendances (graphiques)
 */
export interface DashboardTrendPoint {
  label: string;
  value: number;
  timestamp?: Date;
}

/**
 * Métrique avec couleur pour les visualisations
 */
export interface DashboardMetric {
  label: string;
  value: number;
  color: string;
  icon?: string;
  trend?: TrendDirection;
  change?: number; // % de changement
}

/**
 * Statistiques de validation des commandes
 */
export interface ValidationStats {
  total: number;
  validated: number;
  pending: number;
  rate: number; // pourcentage
}

/**
 * Statistiques générales du système
 */
export interface DashboardStats {
  totalArticles: number;
  totalFournisseurs: number;
  totalCommandes: number;
  totalFactures: number;
  articlesEnAlerte: number;
  utilisateursActifs: number;
}

/**
 * Métriques structurées pour le dashboard
 */
export interface DashboardMetrics {
  stock: DashboardMetric[];
  orders: DashboardMetric[];
  finances: DashboardMetric[];
  validation: ValidationStats;
}

/**
 * Tendances et graphiques pour le dashboard
 */
export interface DashboardTrends {
  ordersHistory: DashboardTrendPoint[];
  revenueHistory: DashboardTrendPoint[];
  stockAlerts: DashboardTrendPoint[];
}

/**
 * Modèle principal du Dashboard
 * Structure unifiée pour tous les données du tableau de bord
 */
export interface DashboardModel {
  // ===== STATISTICS =====
  stats: DashboardStats;
  
  // ===== METRICS =====
  metrics: DashboardMetrics;
  
  // ===== TRENDS =====
  trends: DashboardTrends;
  
  // ===== STATUS =====
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
}

/**
 * Configuration du Dashboard (pour le routing et l'affichage)
 */
export interface DashboardConfig {
  refreshInterval: number; // en millisecondes
  layout: 'grid' | 'list' | 'compact';
  visibleMetrics: DashboardMetricType[];
  chartType: 'line' | 'bar' | 'donut' | 'area';
}
