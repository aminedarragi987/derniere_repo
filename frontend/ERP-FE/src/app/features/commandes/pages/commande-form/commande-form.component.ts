import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ArticleDto } from '../../../articles/models/article.model';
import { ArticleService } from '../../../articles/services/article.service';
import { ClientDto } from '../../../clients/models/client.model';
import { ClientService } from '../../../clients/services/client.service';
import { CommandeService } from '../../services/commande.service';

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
  validateAfterCreate = true;

  lignes: LigneSelection[] = [];

  isLoadingClients = false;
  isLoadingArticles = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private clientService: ClientService,
    private articleService: ArticleService,
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadArticles();
  }

  loadClients(): void {
    this.isLoadingClients = true;

    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les clients.';
      },
      complete: () => {
        this.isLoadingClients = false;
      }
    });
  }

  loadArticles(): void {
    this.isLoadingArticles = true;

    this.articleService.getAll().subscribe({
      next: (articles) => {
        this.articles = articles;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les articles.';
      },
      complete: () => {
        this.isLoadingArticles = false;
      }
    });
  }

  addLigne(): void {
    this.errorMessage = '';

    if (!this.selectedArticleId) {
      this.errorMessage = 'Selectionne un article.';
      return;
    }

    if (!Number.isFinite(this.quantity) || this.quantity <= 0) {
      this.errorMessage = 'La quantite doit etre superieure a 0.';
      return;
    }

    const selectedArticle = this.articles.find((article) => article.idarticle === this.selectedArticleId);
    if (!selectedArticle || !selectedArticle.idarticle) {
      this.errorMessage = 'Article introuvable.';
      return;
    }

    const existing = this.lignes.find((ligne) => ligne.idarticle === selectedArticle.idarticle);
    if (existing) {
      existing.quantite += this.quantity;
    } else {
      this.lignes.push({
        idarticle: selectedArticle.idarticle,
        nom: selectedArticle.nom,
        quantite: this.quantity
      });
    }

    this.selectedArticleId = null;
    this.quantity = 1;
  }

  removeLigne(idarticle: number): void {
    this.lignes = this.lignes.filter((ligne) => ligne.idarticle !== idarticle);
  }

  async createCommande(): Promise<void> {
    if (!this.canCreateCommande) {
      this.errorMessage = 'Action refusee: le role Gestionnaire est requis.';
      return;
    }

    if (!this.selectedClientId) {
      this.errorMessage = 'Selectionne un client.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const created = await firstValueFrom(this.commandeService.createCommande({ idclient: this.selectedClientId }));

      for (const ligne of this.lignes) {
        await firstValueFrom(
          this.commandeService.addLigneCommande(created.idcommande, {
            idarticle: ligne.idarticle,
            quantite: ligne.quantite
          })
        );
      }

      if (this.validateAfterCreate) {
        await firstValueFrom(this.commandeService.validateCommande(created.idcommande));
      }

      this.successMessage = `Commande #${created.idcommande} creee avec succes.`;
      this.router.navigate(['/commandes']);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      this.errorMessage =
        httpError.error?.Message ??
        (httpError.status === 403
          ? 'Action refusee: le role Gestionnaire est requis.'
          : 'Erreur lors de la creation de la commande.');
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/commandes']);
  }

  get canCreateCommande(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire']);
  }
}
