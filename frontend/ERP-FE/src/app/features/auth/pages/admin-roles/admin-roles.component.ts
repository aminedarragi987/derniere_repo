import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIamService } from '../../../../core/services/user-iam.service';
import { RolesDto } from '../../models/user.models';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css'
})
export class AdminRolesComponent implements OnInit {
  roles: RolesDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;
  form!: FormGroup;

  constructor(private userIamService: UserIamService, private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      idrole: [0],
      nom: ['', Validators.required],
      description: [''],
      idprofile: [null as number | null]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.userIamService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des rôles.';
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.form.reset();
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const isEdit = formValue.idrole > 0;

    if (isEdit) {
      this.userIamService.updateRole(formValue.idrole, formValue).subscribe({
        next: () => {
          this.successMessage = 'Rôle mis à jour avec succès.';
          this.loadRoles();
          this.toggleForm();
        },
        error: () => {
          this.errorMessage = "Erreur lors de l'édition du rôle.";
        }
      });
      return;
    }

    this.userIamService.addRole(formValue).subscribe({
      next: () => {
        this.successMessage = 'Rôle créé avec succès.';
        this.loadRoles();
        this.toggleForm();
      },
      error: () => {
        this.errorMessage = "Erreur lors de la création du rôle.";
      }
    });
  }

  edit(role: RolesDto): void {
    this.form.patchValue(role);
    this.showForm = true;
  }

  delete(idrole: number): void {
    if (!confirm('Êtes-vous sûr ?')) return;
    this.userIamService.deleteRole(idrole).subscribe({
      next: () => {
        this.successMessage = 'Rôle supprimé avec succès.';
        this.loadRoles();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression.';
      }
    });
  }
}
