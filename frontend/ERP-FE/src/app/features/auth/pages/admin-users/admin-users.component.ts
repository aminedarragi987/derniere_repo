import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIamService } from '../../../../core/services/user-iam.service';
import { UtilisateurDto } from '../../models/user.models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: UtilisateurDto[] = [];
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
      motdepasse: [''],
      roles: [[] as string[]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
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

    (isEdit ? 
      this.userIamService.updateUser(formValue) :
      this.userIamService.addUser(formValue)
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
    this.form.patchValue(user);
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
