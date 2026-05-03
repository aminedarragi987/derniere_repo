import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FactureDetail } from '../../../../shared/models';
import { FactureService } from '../../../../shared/services';

@Component({
  selector: 'app-facture-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facture-list.component.html',
  styleUrl: './facture-list.component.css'
})
export class FactureListComponent implements OnInit {
  factures: FactureDetail[] = [];
  loading = false;
  error = '';
  commandeId = 0;

  constructor(private factureService: FactureService) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    this.loading = true;
    this.error = '';

    this.factureService.getFactures().subscribe({
      next: (data) => {
        this.factures = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger les factures.';
        this.loading = false;
      }
    });
  }

  genererFacture(): void {
    if (!this.commandeId || this.commandeId <= 0) {
      this.error = 'Veuillez saisir un ID commande valide.';
      return;
    }

    this.error = '';
    this.factureService.genererFacture(this.commandeId).subscribe({
      next: () => {
        this.commandeId = 0;
        this.loadFactures();
      },
      error: () => {
        this.error = 'Erreur lors de la génération de la facture.';
      }
    });
  }

  ajouterPaiement(facture: FactureDetail): void {
    const montant = window.prompt(`Montant du paiement pour facture #${facture.idfacture}`);
    if (!montant) {
      return;
    }

    this.factureService.ajouterPaiement(facture.idfacture, {
      montant: Number(montant),
      modepaiement: 'Espèces'
    }).subscribe({
      next: () => {
        alert('Paiement ajouté avec succès');
      },
      error: () => {
        this.error = 'Erreur lors de l\'ajout du paiement.';
      }
    });
  }
}
