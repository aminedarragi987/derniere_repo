import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommandeDto } from '../../models/commande.model';
import { CommandeService } from '../../services/commande.service';

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
  statusFilter = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.commandeService.getCommandes({ statut: this.statusFilter || undefined }).subscribe({
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
}
