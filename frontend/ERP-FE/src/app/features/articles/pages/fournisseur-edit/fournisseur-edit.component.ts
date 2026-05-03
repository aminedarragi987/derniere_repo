import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FournisseurDto } from '../../../../shared/models';
import { FournisseurService, AuthService, NotificationService } from '../../../../shared/services';

/**
 * Composant pour MODIFIER un fournisseur existant
 */
@Component({
  standalone: true,
  selector: 'app-fournisseur-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fournisseur-edit.component.html',
  styleUrl: './fournisseur-edit.component.css'
})
export class FournisseurEditComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  isSubmitting = false;
  fournisseurId: number = 0;

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.fournisseurId = Number(this.route.snapshot.params['id']);
    
    if (!this.fournisseurId) {
      this.notificationService.error('Fournisseur introuvable.');
      this.router.navigate(['/fournisseurs']);
      return;
    }

    this.loadFournisseur();
  }

  private loadFournisseur(): void {
    this.isLoading = true;

    this.fournisseurService.getAll().subscribe({
      next: (list: FournisseurDto[]) => {
        const fournisseur = list.find((item: FournisseurDto) => item.idfournisseur === this.fournisseurId);
        
        if (!fournisseur) {
          this.notificationService.error('Fournisseur introuvable.');
          this.router.navigate(['/fournisseurs']);
          return;
        }

        this.form.patchValue({
          nom: fournisseur.nom,
          email: fournisseur.email ?? '',
          telephone: fournisseur.telephone ?? ''
        });
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du fournisseur.');
        this.router.navigate(['/fournisseurs']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

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

    const payload: FournisseurDto = {
      ...this.form.getRawValue(),
      idfournisseur: this.fournisseurId
    };

    this.fournisseurService.update(this.fournisseurId, payload).subscribe({
      next: () => {
        this.notificationService.success('Fournisseur mis à jour avec succès.');
        setTimeout(() => this.router.navigate(['/fournisseurs']), 1500);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la mise à jour du fournisseur.');
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
