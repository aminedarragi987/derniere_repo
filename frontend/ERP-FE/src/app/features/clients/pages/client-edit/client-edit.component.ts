import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ClientService, AuthService, NotificationService } from '../../../../shared/services';
import { ClientUpdateDto, ClientDto } from '../../../../shared/models';

/**
 * Composant pour MODIFIER un client existant
 */
@Component({
  standalone: true,
  selector: 'app-client-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.css'
})
export class ClientEditComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isSubmitting = false;
  clientId: number = 0;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', Validators.email],
      telephone: [''],
      adresse: ['']
    });
  }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.params['id']);
    
    if (!this.clientId) {
      this.notificationService.error('Client introuvable.');
      this.router.navigate(['/clients']);
      return;
    }

    this.loadClient();
  }

  private loadClient(): void {
    this.isLoading = true;

    this.clientService.getClients().subscribe({
      next: (list: ClientDto[]) => {
        const client = list.find((item: ClientDto) => item.idclient === this.clientId);
        
        if (!client) {
          this.notificationService.error('Client introuvable.');
          this.router.navigate(['/clients']);
          return;
        }

        this.form.patchValue({
          nom: client.nom,
          email: client.email ?? '',
          telephone: client.telephone ?? '',
          adresse: client.adresse ?? ''
        });
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du client.');
        this.router.navigate(['/clients']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  save(): void {
    if (!this.canManageClients) {
      this.notificationService.error('Action refusée.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Veuillez remplir les champs obligatoires.');
      return;
    }

    this.isSubmitting = true;

    const payload: ClientUpdateDto = {
      ...this.form.getRawValue(),
      idclient: this.clientId
    };

    this.clientService.updateClient(this.clientId, payload).subscribe({
      next: () => {
        this.notificationService.success('Client mis à jour avec succès.');
        setTimeout(() => this.router.navigate(['/clients']), 1500);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la mise à jour du client.');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clients']);
  }

  get canManageClients(): boolean {
    return this.authService.hasAnyRole(['Administrateur', 'Gestionnaire']);
  }
}
