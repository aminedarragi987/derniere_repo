import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIamService } from '../../../../shared/services';
import { ProfileDto, RolesDto } from '../../models/user.models';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-roles.component.html',
  styleUrl: './admin-roles.component.css'
})
export class AdminRolesComponent implements OnInit {
  roles: RolesDto[] = [];
  profiles: ProfileDto[] = [];
  availableParentRoles: RolesDto[] = [];
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
      idprofile: [null as number | null, Validators.required],
      idroleparent: [null as number | null]
    });
  }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadRoles();
  }

  loadProfiles(): void {
    this.userIamService.getProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        const currentProfile = this.form.getRawValue().idprofile;
        if (!currentProfile && profiles.length > 0) {
          this.form.patchValue({ idprofile: profiles[0].idprofil });
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des profils.';
      }
    });
  }

  loadRoles(): void {
    this.isLoading = true;
    this.userIamService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.availableParentRoles = roles;
        const currentParent = this.form.getRawValue().idroleparent;
        const adminRole = roles.find((role) => role.nom?.toLowerCase() === 'administrateur');
        if (!currentParent && adminRole) {
          this.form.patchValue({ idroleparent: adminRole.idrole });
        }
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
      const adminRole = this.roles.find((role) => role.nom?.toLowerCase() === 'administrateur');
      this.form.reset({
        idrole: 0,
        nom: '',
        description: '',
        idprofile: this.profiles[0]?.idprofil ?? null,
        idroleparent: adminRole?.idrole ?? null
      });
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
    if (!role.idroleparent) {
      const adminRole = this.roles.find((item) => item.nom?.toLowerCase() === 'administrateur');
      if (adminRole) {
        this.form.patchValue({ idroleparent: adminRole.idrole });
      }
    }
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
