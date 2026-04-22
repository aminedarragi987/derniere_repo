import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDto } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  clients: ClientDto[] = [];
  filtered: ClientDto[] = [];
  search = '';
  isLoading = false;
  errorMessage = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilter();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les clients.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();
    if (!term) {
      this.filtered = [...this.clients];
      return;
    }

    this.filtered = this.clients.filter((client) =>
      [client.nom, client.email, client.telephone, client.adresse]
        .filter(Boolean)
        .some((value) => (value as string).toLowerCase().includes(term))
    );
  }
}
