import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientDto } from '../../../../shared/models';
import { ClientService, AuthService } from '../../../../shared/services';

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

  constructor(
    private clientService: ClientService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClients().subscribe({
      next: (res) => {
        this.clients = res;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les clients.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();

    this.filtered = !term
      ? [...this.clients]
      : this.clients.filter(c =>
          (c.nom + c.email + c.telephone + c.adresse)
            .toLowerCase()
            .includes(term)
        );
  }

  // ✅ ICI la correction importante
  createClient(): void {
    if (!this.canManageClients) return;
    this.router.navigate(['/clients/new']);
  }

  editClient(client: ClientDto): void {
    if (!this.canManageClients) return;
    this.router.navigate(['/clients/edit', client.idclient]);
  }

  deleteClient(client: ClientDto): void {
    if (!this.canManageClients) return;

    if (!confirm('Supprimer ce client ?')) return;

    this.clientService.deleteClient(client.idclient).subscribe({
      next: () => this.loadClients(),
      error: () => this.errorMessage = 'Erreur suppression client'
    });
  }

  get canManageClients(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire', 'Administrateur']);
  }
}