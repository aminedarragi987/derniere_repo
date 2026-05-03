import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FournisseurDto } from '../../../../shared/models';
import { FournisseurService, NotificationService } from '../../../../shared/services';

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

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoading = true;

    this.fournisseurService.getAll().subscribe({
      next: (fournisseurs: FournisseurDto[]) => {
        this.fournisseurs = fournisseurs;
        this.applyFilter();
      },
      error: () => {
        this.notificationService.error('Impossible de charger les fournisseurs.');
        this.isLoading = false;
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

    this.filtered = this.fournisseurs.filter((fournisseur: FournisseurDto) =>
      [fournisseur.nom, fournisseur.email, fournisseur.telephone]
        .filter((value): value is string => !!value)
        .some((value: string) => value.toLowerCase().includes(term))
    );
  }

  create(): void {
    this.router.navigate(['/fournisseurs/new']);
  }

  edit(idfournisseur: number | undefined): void {
    if (!idfournisseur) return;
    this.router.navigate(['/fournisseurs/edit', idfournisseur]);
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
        this.notificationService.error('Erreur lors de la suppression du fournisseur.');
      }
    });
  }
}