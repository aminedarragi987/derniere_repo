import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FournisseurDto } from '../../models/article.model';
import { FournisseurService } from '../../services/fournisseur.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrl: './fournisseur-list.component.css'
})
export class FournisseurListComponent implements OnInit {
  fournisseurs: FournisseurDto[] = [];
  filtered: FournisseurDto[] = [];
  search = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.fournisseurService.getAll().subscribe({
      next: (fournisseurs) => {
        this.fournisseurs = fournisseurs;
        this.applyFilter();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les fournisseurs.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();
    if (!term) {
      this.filtered = [...this.fournisseurs];
      return;
    }

    this.filtered = this.fournisseurs.filter((fournisseur) =>
      [fournisseur.nom, fournisseur.email, fournisseur.telephone]
        .filter(Boolean)
        .some((value) => (value as string).toLowerCase().includes(term))
    );
  }

  create(): void {
    this.router.navigate(['/fournisseurs/new']);
  }

  edit(idfournisseur: number | undefined): void {
    if (idfournisseur) {
      this.router.navigate(['/fournisseurs/edit', idfournisseur]);
    }
  }

  delete(idfournisseur: number | undefined): void {
    if (!idfournisseur || !confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      return;
    }

    this.fournisseurService.delete(idfournisseur).subscribe({
      next: () => {
        this.loadFournisseurs();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression du fournisseur.';
      }
    });
  }
}