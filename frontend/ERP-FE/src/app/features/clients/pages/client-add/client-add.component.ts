import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientService, AuthService, NotificationService } from '../../../../shared/services';
import { ClientCreateDto } from '../../../../shared/models';

/**
 * Composant pour AJOUTER un nouveau client
 */
@Component({
  standalone: true,
  selector: 'app-client-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-add.component.html',
  styleUrl: './client-add.component.css'
})
export class ClientAddComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
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

  ngOnInit(): void {}

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

    const payload: ClientCreateDto = this.form.getRawValue();

    this.clientService.addClient(payload).subscribe({
      next: () => {
        this.notificationService.success('Client créé avec succès.');
        setTimeout(() => this.router.navigate(['/clients']), 1500);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la création du client.');
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
