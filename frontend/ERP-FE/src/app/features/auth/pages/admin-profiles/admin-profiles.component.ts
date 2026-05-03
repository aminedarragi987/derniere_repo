import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIamService } from '../../../../shared/services';
import { ProfileDto } from '../../models/user.models';

@Component({
  selector: 'app-admin-profiles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profiles.component.html',
  styleUrl: './admin-profiles.component.css'
})
export class AdminProfilesComponent implements OnInit {
  profiles: ProfileDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;
  form!: FormGroup;

  constructor(private userIamService: UserIamService, private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      idprofil: [0],
      nom: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.isLoading = true;
    this.userIamService.getProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des profils.';
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.form.reset();
      this.successMessage = '';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const isEdit = formValue.idprofil > 0;

    if (isEdit) {
      this.userIamService.updateProfile(formValue.idprofil, formValue).subscribe({
        next: () => {
          this.successMessage = 'Profil mis à jour.';
          this.loadProfiles();
          this.toggleForm();
        },
        error: () => {
          this.errorMessage = "Erreur lors de l'opération.";
        }
      });
      return;
    }

    this.userIamService.addProfile(formValue).subscribe({
      next: () => {
        this.successMessage = 'Profil créé.';
        this.loadProfiles();
        this.toggleForm();
      },
      error: () => {
        this.errorMessage = "Erreur lors de l'opération.";
      }
    });
  }

  edit(profile: ProfileDto): void {
    this.form.patchValue(profile);
    this.showForm = true;
  }

  delete(idprofil: number): void {
    if (!confirm('Êtes-vous sûr ?')) return;
    this.userIamService.deleteProfile(idprofil).subscribe({
      next: () => {
        this.successMessage = 'Profil supprimé.';
        this.loadProfiles();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression.';
      }
    });
  }
}
