import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurDto } from '../../models/article.model';
import { FournisseurService } from '../../services/fournisseur.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fournisseur-form.component.html',
  styleUrl: './fournisseur-form.component.css'
})
export class FournisseurFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id!: number;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.nonNullable.group({
      idfournisseur: [0],
      nom: ['', Validators.required],
      email: [''],
      telephone: ['']
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.params['id']);

    if (this.id) {
      this.isEdit = true;
      this.fournisseurService.getAll().subscribe({
        next: (list) => {
          const fournisseur = list.find((item) => item.idfournisseur === this.id);
          if (!fournisseur) {
            this.errorMessage = 'Fournisseur introuvable.';
            return;
          }

          this.form.patchValue({
            idfournisseur: fournisseur.idfournisseur ?? 0,
            nom: fournisseur.nom,
            email: fournisseur.email ?? '',
            telephone: fournisseur.telephone ?? ''
          });
        },
        error: () => {
          this.errorMessage = 'Impossible de charger le fournisseur.';
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.form.getRawValue();
    const payload: FournisseurDto = {
      idfournisseur: formValue.idfournisseur,
      nom: formValue.nom,
      email: formValue.email,
      telephone: formValue.telephone
    };

    const request$ = this.isEdit && this.id
      ? this.fournisseurService.update(this.id, payload)
      : this.fournisseurService.create(payload);

    request$.subscribe({
      next: () => {
        this.successMessage = this.isEdit
          ? 'Fournisseur mis a jour avec succes.'
          : 'Fournisseur cree avec succes.';
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 403
          ? 'Action refusee: votre role ne permet pas de modifier les fournisseurs.'
          : this.isEdit
            ? 'Echec de mise a jour fournisseur.'
            : 'Echec de creation fournisseur.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/fournisseurs']);
  }

  get canManageSuppliers(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire', 'Administrateur']);
  }
}