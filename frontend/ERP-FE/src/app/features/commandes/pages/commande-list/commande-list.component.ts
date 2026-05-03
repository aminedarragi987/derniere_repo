import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService, ArticleService, ClientService, CommandeService, NotificationService } from '../../../../shared/services';
import { ArticleDto, ClientDto, CommandeDto } from '../../../../shared/models';

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

  idFilter: number | null = null;

  // ===== DIALOG STATE =====
  isDialogOpen = false;
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
    private articleService: ArticleService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  // ================= COMMANDES =================

  loadCommandes(): void {
    this.isLoading = true;

    this.commandeService.getCommandes({ idcommande: this.idFilter ?? undefined }).subscribe({
      next: (res) => this.commandes = res,
      error: () => this.notificationService.error('Impossible de charger les commandes.'),
      complete: () => this.isLoading = false
    });
  }

  deleteCommande(cmd: CommandeDto): void {
    if (!this.canManageCommande) return;
    if (!cmd.idcommande || !confirm(`Supprimer commande #${cmd.idcommande} ?`)) return;

    this.isLoading = true;

    this.commandeService.deleteCommande(cmd.idcommande).subscribe({
      next: () => this.loadCommandes(),
      error: () => {
        this.notificationService.error('Erreur suppression.');
        this.isLoading = false;
      }
    });
  }

  // ================= ROLES =================

  get canManageCommande(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire', 'Administrateur']);
  }

  get canCreateCommande(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire', 'Administrateur']);
  }

  // ================= DIALOG =================
  // ================= SUPPRESSION BROUILLONS =================

  deleteAllDrafts(): void {
    if (!this.canManageCommande) return;
    const drafts = this.commandes.filter(c => c.statut === 'Brouillon');
    if (drafts.length === 0) return;
    if (!confirm(`Supprimer toutes les commandes Brouillon (${drafts.length}) ?`)) return;

    this.isLoading = true;
    let deleted = 0;
    let failed = 0;

    const next = () => {
      const cmd = drafts[deleted + failed];
      if (!cmd) {
        this.isLoading = false;
        this.loadCommandes();
        if (failed > 0) {
          this.notificationService.error(`${failed} suppression(s) ont échoué.`);
        }
        return;
      }
      this.commandeService.deleteCommande(cmd.idcommande).subscribe({
        next: () => { deleted++; next(); },
        error: () => { failed++; next(); }
      });
    };
    next();
  }

  openCreateCommandeDialog(): void {
    if (!this.canCreateCommande) return;

    this.isDialogOpen = true;
    this.resetDialog();
    this.loadDialogData();
  }

  closeCreateCommandeDialog(): void {
    this.isDialogOpen = false;
  }

  private resetDialog(): void {
    this.selectedClientId = null;
    this.selectedArticleId = null;
    this.selectedQuantity = 1;
    this.lignes = [];
    this.validateAfterCreate = true;
  }

  private loadDialogData(): void {
    this.isLoadingClients = true;
    this.isLoadingArticles = true;

    this.clientService.getClients().subscribe({
      next: (res) => this.clients = res,
      complete: () => this.isLoadingClients = false
    });

    this.articleService.getAll().subscribe({
      next: (res) => this.articles = res,
      complete: () => this.isLoadingArticles = false
    });
  }

  // ================= LIGNES =================

  addLigne(): void {
    if (!this.selectedArticleId) {
      this.notificationService.error('Article requis');
      return;
    }

    if (this.selectedQuantity <= 0) {
      this.notificationService.error('Quantité invalide');
      return;
    }

    const article = this.articles.find(a => a.idarticle === this.selectedArticleId);
    if (!article?.idarticle) return;

    const existing = this.lignes.find(l => l.idarticle === article.idarticle);

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

  removeLigne(id: number): void {
    this.lignes = this.lignes.filter(l => l.idarticle !== id);
  }

  // ================= CREATE =================

  async createCommandeFromDialog(): Promise<void> {
    if (!this.selectedClientId) {
      this.notificationService.error('Client requis');
      return;
    }

    this.isSubmittingCommande = true;

    try {
      const cmd = await firstValueFrom(
        this.commandeService.createCommande({ idclient: this.selectedClientId })
      );

      for (const l of this.lignes) {
        await firstValueFrom(
          this.commandeService.addLigneCommande(cmd.idcommande, {
            idarticle: l.idarticle,
            quantite: l.quantite
          })
        );
      }

      if (this.validateAfterCreate) {
        await firstValueFrom(this.commandeService.validateCommande(cmd.idcommande));
      }

      this.notificationService.success(`Commande #${cmd.idcommande} créée.`);
      this.isDialogOpen = false;
      this.loadCommandes();

    } catch (e) {
      const err = e as HttpErrorResponse;

      const errorMsg =
        err.status === 403
          ? 'Accès refusé: rôle Gestionnaire ou Administrateur requis.'
          : 'Erreur création commande.';
      
      this.notificationService.error(errorMsg);
    } finally {
      this.isSubmittingCommande = false;
    }
  }
}