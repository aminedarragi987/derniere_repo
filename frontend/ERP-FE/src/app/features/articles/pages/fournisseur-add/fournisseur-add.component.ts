import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FournisseurDto } from '../../../../shared/models';
import { FournisseurService, AuthService, NotificationService } from '../../../../shared/services';

/**
 * Composant pour AJOUTER un nouveau fournisseur
 */
@Component({
  standalone: true,
  selector: 'app-fournisseur-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fournisseur-add.component.html',
  styleUrl: './fournisseur-add.component.css'
})
export class FournisseurAddComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', Validators.email],
      telephone: ['']
    });
  }

  ngOnInit(): void {}

  save(): void {
    if (!this.canManageSuppliers) {
      this.notificationService.error('Action refusée.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Veuillez remplir les champs obligatoires.');
      return;
    }

    this.isSubmitting = true;

    const payload: FournisseurDto = this.form.getRawValue();

    this.fournisseurService.create(payload).subscribe({
      next: () => {
        this.notificationService.success('Fournisseur créé avec succès.');
        setTimeout(() => this.router.navigate(['/fournisseurs']), 1500);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la création du fournisseur.');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/fournisseurs']);
  }

  get canManageSuppliers(): boolean {
    return this.authService.hasAnyRole(['Administrateur', 'Gestionnaire']);
  }
}
