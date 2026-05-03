import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RolesDto, UtilisateurDto } from '../../auth/models/user.models';
import { UserIamService, NotificationService } from '../../../shared/services';

/**
 * Composant pour AJOUTER un nouvel utilisateur
 */
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  roles: RolesDto[] = [];

  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userIamService: UserIamService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nom: ['', Validators.required],
      prenom: [''],
      telephone: [''],
      idrole: [null, Validators.required],
      motdepasse: ['', Validators.minLength(6)]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const value = this.form.getRawValue();
    const payload: UtilisateurDto = {
      iduser: 0,
      userName: value.userName ?? '',
      email: value.email ?? '',
      nom: value.nom ?? '',
      prenom: value.prenom ?? '',
      telephone: value.telephone ?? '',
      idrole: value.idrole ? Number(value.idrole) : undefined,
      motdepasse: value.motdepasse ?? ''
    };

    this.userIamService.addUser(payload).subscribe({
      next: () => {
        this.notificationService.success('Utilisateur créé avec succès.');
        setTimeout(() => this.goBack(), 1500);
      },
      error: () => {
        this.notificationService.error('Echec de création utilisateur.');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  private loadRoles(): void {
    this.userIamService.getRoles().subscribe({
      next: (roles) => {
        this.roles = this.uniqueRolesByName(roles).sort((a, b) => a.nom.localeCompare(b.nom));
        if (this.roles.length <= 1) {
          this.notificationService.warning(
            'Un seul role est disponible dans les donnees API. Verifie la table des roles backend (Gestionnaire, Comptable, DG, ...).'
          );
        }
      },
      error: () => {
        this.notificationService.error('Impossible de charger les roles.');
      }
    });
  }

  private uniqueRolesByName(roles: RolesDto[]): RolesDto[] {
    const seen = new Set<string>();
    return roles.filter((role) => {
      const key = role.nom.trim().toLowerCase();
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
