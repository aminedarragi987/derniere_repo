import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, ArticleService, ClientService, CommandeService, NotificationService } from '../../../../shared/services';
import { ArticleDto, ClientDto } from '../../../../shared/models';

interface LigneSelection {
  idarticle: number;
  nom: string;
  quantite: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-form.component.html',
  styleUrl: './commande-form.component.css'
})
export class CommandeFormComponent implements OnInit {

  clients: ClientDto[] = [];
  articles: ArticleDto[] = [];

  selectedClientId: number | null = null;
  selectedArticleId: number | null = null;
  quantity = 1;

  lignes: LigneSelection[] = [];

  // ✅ AJOUTS OBLIGATOIRES
  isLoadingClients = false;
  isLoadingArticles = false;
  isSubmitting = false;
  validateAfterCreate = true;

  isLoading = false;

  constructor(
    private clientService: ClientService,
    private articleService: ArticleService,
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadArticles();
  }

  // ================= ROLES =================

  get canCreateCommande(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire', 'Administrateur']);
  }

  // ================= LIGNES =================

  addLigne(): void {
    if (!this.selectedArticleId || this.quantity <= 0) {
      this.notificationService.error('Données invalides.');
      return;
    }

    const article = this.articles.find(a => a.idarticle === this.selectedArticleId);

    if (!article || !article.idarticle) {
      this.notificationService.error('Article introuvable.');
      return;
    }

    const existing = this.lignes.find(l => l.idarticle === article.idarticle);

    if (existing) {
      existing.quantite += this.quantity;
    } else {
      this.lignes.push({
        idarticle: article.idarticle,
        nom: article.nom,
        quantite: this.quantity
      });
    }

    this.selectedArticleId = null;
    this.quantity = 1;
  }

  removeLigne(idarticle: number): void {
    this.lignes = this.lignes.filter(l => l.idarticle !== idarticle);
  }

  // ================= CREATION =================

  async createCommande(): Promise<void> {

    if (!this.canCreateCommande) {
      this.notificationService.error('Accès refusé : rôle requis.');
      return;
    }

    if (!this.selectedClientId) {
      this.notificationService.error('Client obligatoire.');
      return;
    }

    this.isLoading = true;

    try {
      const created = await firstValueFrom(
        this.commandeService.createCommande({
          idclient: this.selectedClientId
        })
      );

      for (const ligne of this.lignes) {
        await firstValueFrom(
          this.commandeService.addLigneCommande(created.idcommande, {
            idarticle: ligne.idarticle,
            quantite: ligne.quantite
          })
        );
      }

      // Validation automatique si demandé
      if (this.validateAfterCreate) {
        await firstValueFrom(this.commandeService.validateCommande(created.idcommande));
      }

      this.notificationService.success('Commande créée avec succès.');
      setTimeout(() => this.router.navigate(['/commandes']), 1500);

    } catch (err) {
      const httpError = err as HttpErrorResponse;

      const errorMsg =
        httpError.status === 403
          ? 'Accès refusé : rôle Gestionnaire ou Administrateur requis.'
          : 'Erreur lors de la création de la commande.';
      
      this.notificationService.error(errorMsg);

    } finally {
      this.isLoading = false;
    }
  }

  // ================= DATA LOAD =================

  private loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (res) => this.clients = res,
      error: (err: HttpErrorResponse) => {
        const errorMsg = err.status === 403
          ? 'Accès refusé clients'
          : 'Erreur chargement clients';
        this.notificationService.error(errorMsg);
      }
    });
  }

  private loadArticles(): void {
    this.articleService.getAll().subscribe({
      next: (res) => this.articles = res,
      error: (err: HttpErrorResponse) => {
        const errorMsg = err.status === 403
          ? 'Accès refusé articles'
          : 'Erreur chargement articles';
        this.notificationService.error(errorMsg);
      }
    });
  }

  // ================= NAVIGATION =================

  goBack(): void {
    this.router.navigate(['/commandes']);
  }
}