import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LivraisonService } from '../../../../shared/services';
import { Livraison, ComptabiliteExport } from '../../../../shared/models';

@Component({
  selector: 'app-livraison-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livraison-list.component.html',
  styleUrl: './livraison-list.component.css'
})
export class LivraisonListComponent {
  idCommande = 0;
  idLivraison = 0;

  livraison: Livraison | null = null;
  exportResult: ComptabiliteExport | null = null;
  errorMessage = '';

  constructor(private livraisonService: LivraisonService) {}

  genererLivraison(): void {
    this.errorMessage = '';
    this.exportResult = null;

    this.livraisonService.generer(this.idCommande).subscribe({
      next: (res) => {
        this.livraison = res;
      },
      error: () => {
        this.errorMessage = 'Impossible de générer la livraison.';
      }
    });
  }

  rechercherLivraison(): void {
    this.errorMessage = '';
    this.exportResult = null;

    this.livraisonService.getById(this.idLivraison).subscribe({
      next: (res) => {
        this.livraison = res;
      },
      error: () => {
        this.errorMessage = 'Livraison introuvable.';
      }
    });
  }

  exporterComptabilite(): void {
    if (!this.livraison) return;

    this.errorMessage = '';

    this.livraisonService.exportComptabilite(this.livraison.idlivraison).subscribe({
      next: (res) => {
        this.exportResult = res;
      },
      error: () => {
        this.errorMessage = 'Export comptabilité impossible.';
      }
    });
  }
}