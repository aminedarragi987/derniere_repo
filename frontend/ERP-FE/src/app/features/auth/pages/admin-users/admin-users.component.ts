import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIamService } from '../../../../core/services/user-iam.service';
import { RolesDto, UtilisateurDto } from '../../models/user.models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: UtilisateurDto[] = [];
  roles: RolesDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;
  form!: FormGroup;

  constructor(
    private userIamService: UserIamService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      iduser: [0],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: [''],
      telephone: [''],
      motdepasse: [''],
      idrole: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.userIamService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les roles.';
      }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userIamService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les utilisateurs.';
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
    const isEdit = formValue.iduser > 0;

    const payload: UtilisateurDto = {
      iduser: formValue.iduser,
      userName: formValue.userName,
      email: formValue.email,
      nom: formValue.nom,
      prenom: formValue.prenom,
      telephone: formValue.telephone,
      motdepasse: formValue.motdepasse,
      idrole: formValue.idrole ? Number(formValue.idrole) : undefined
    };

    (isEdit ?
      this.userIamService.updateUser(payload) :
      this.userIamService.addUser(payload)
    ).subscribe({
      next: () => {
        this.successMessage = `Utilisateur ${isEdit ? 'mis à jour' : 'créé'} avec succès.`;
        this.loadUsers();
        this.toggleForm();
      },
      error: () => {
        this.errorMessage = `Erreur lors de l'${isEdit ? 'édition' : 'création'} de l'utilisateur.`;
      }
    });
  }

  edit(user: UtilisateurDto): void {
    this.form.patchValue({
      iduser: user.iduser ?? 0,
      userName: user.userName ?? '',
      email: user.email ?? '',
      nom: user.nom ?? '',
      prenom: user.prenom ?? '',
      telephone: user.telephone ?? '',
      motdepasse: '',
      idrole: user.idrole ?? null
    });
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
