import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ArticleDto } from '../../../articles/models/article.model';
import { ArticleService } from '../../../articles/services/article.service';
import { ClientDto } from '../../../clients/models/client.model';
import { ClientService } from '../../../clients/services/client.service';
import { CommandeDto } from '../../models/commande.model';
import { CommandeService } from '../../services/commande.service';

interface LigneSelection {
  idarticle: number;
  nom: string;
  quantite: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-list.component.html',
  styleUrl: './commande-list.component.css'
})
export class CommandeListComponent implements OnInit {
  commandes: CommandeDto[] = [];
  isLoading = false;
  errorMessage = '';
  idFilter: number | null = null;

  isDialogOpen = false;
  dialogErrorMessage = '';
  dialogSuccessMessage = '';
  isSubmittingCommande = false;
  isLoadingClients = false;
  isLoadingArticles = false;

  clients: ClientDto[] = [];
  articles: ArticleDto[] = [];
  selectedClientId: number | null = null;
  selectedArticleId: number | null = null;
  selectedQuantity = 1;
  validateAfterCreate = true;
  lignes: LigneSelection[] = [];

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private clientService: ClientService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.commandeService.getCommandes({ idcommande: this.idFilter ?? undefined }).subscribe({
      next: (commandes) => {
        this.commandes = commandes;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les commandes.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get canCreateCommande(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire']);
  }

  openCreateCommandeDialog(): void {
    if (!this.canCreateCommande) {
      return;
    }

    this.isDialogOpen = true;
    this.resetDialogState();
    this.loadDialogData();
  }

  closeCreateCommandeDialog(): void {
    this.isDialogOpen = false;
  }

  addLigne(): void {
    this.dialogErrorMessage = '';

    if (!this.selectedArticleId) {
      this.dialogErrorMessage = 'Selectionne un article.';
      return;
    }

    if (!Number.isFinite(this.selectedQuantity) || this.selectedQuantity <= 0) {
      this.dialogErrorMessage = 'La quantite doit etre superieure a 0.';
      return;
    }

    const article = this.articles.find((item) => item.idarticle === this.selectedArticleId);
    if (!article || !article.idarticle) {
      this.dialogErrorMessage = 'Article introuvable.';
      return;
    }

    const existing = this.lignes.find((item) => item.idarticle === article.idarticle);
    if (existing) {
      existing.quantite += this.selectedQuantity;
    } else {
      this.lignes.push({
        idarticle: article.idarticle,
        nom: article.nom,
        quantite: this.selectedQuantity
      });
    }

    this.selectedArticleId = null;
    this.selectedQuantity = 1;
  }

  removeLigne(idarticle: number): void {
    this.lignes = this.lignes.filter((item) => item.idarticle !== idarticle);
  }

  async createCommandeFromDialog(): Promise<void> {
    if (!this.selectedClientId) {
      this.dialogErrorMessage = 'Selectionne un client.';
      return;
    }

    this.isSubmittingCommande = true;
    this.dialogErrorMessage = '';
    this.dialogSuccessMessage = '';

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

      this.dialogSuccessMessage = `Commande #${created.idcommande} creee avec succes.`;
      this.isDialogOpen = false;
      this.loadCommandes();
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      this.dialogErrorMessage =
        httpError.error?.Message ??
        (httpError.status === 403
          ? 'Action refusee: le role Gestionnaire est requis.'
          : 'Erreur lors de la creation de la commande.');
    } finally {
      this.isSubmittingCommande = false;
    }
  }

  private loadDialogData(): void {
    this.isLoadingClients = true;
    this.isLoadingArticles = true;

    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: () => {
        this.dialogErrorMessage = 'Impossible de charger les clients.';
      },
      complete: () => {
        this.isLoadingClients = false;
      }
    });

    this.articleService.getAll().subscribe({
      next: (articles) => {
        this.articles = articles;
      },
      error: () => {
        this.dialogErrorMessage = 'Impossible de charger les articles.';
      },
      complete: () => {
        this.isLoadingArticles = false;
      }
    });
  }

  private resetDialogState(): void {
    this.dialogErrorMessage = '';
    this.dialogSuccessMessage = '';
    this.selectedClientId = null;
    this.selectedArticleId = null;
    this.selectedQuantity = 1;
    this.validateAfterCreate = true;
    this.lignes = [];
  }
}
