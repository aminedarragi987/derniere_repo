import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RolesDto, UtilisateurDto } from '../../auth/models/user.models';
import { UserIamService, NotificationService } from '../../../shared/services';

/**
 * Composant pour MODIFIER un utilisateur existant
 */
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  isEditMode = true;
  isLoading = false;
  isSaving = false;
  editingId: number | null = null;
  roles: RolesDto[] = [];

  readonly form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isNaN(id) && id > 0) {
      this.editingId = id;
      this.loadUser(id);
    } else {
      this.notificationService.error('Utilisateur introuvable.');
      this.router.navigate(['/users']);
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const value = this.form.getRawValue();
    const payload: UtilisateurDto = {
      iduser: this.editingId ?? 0,
      userName: value.userName ?? '',
      email: value.email ?? '',
      nom: value.nom ?? '',
      prenom: value.prenom ?? '',
      telephone: value.telephone ?? '',
      idrole: value.idrole ? Number(value.idrole) : undefined,
      motdepasse: value.motdepasse ?? ''
    };

    this.userIamService.updateUser(payload).subscribe({
      next: () => {
        this.notificationService.success('Utilisateur mis a jour avec succes.');
        setTimeout(() => this.goBack(), 1500);
      },
      error: () => {
        this.notificationService.error('Echec de mise a jour utilisateur.');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  private loadUser(id: number): void {
    this.isLoading = true;

    this.userIamService.getUsers().subscribe({
      next: (users) => {
        const user = users.find((item) => item.iduser === id);
        if (!user) {
          this.notificationService.error('Utilisateur introuvable.');
          return;
        }

        this.form.patchValue({
          userName: user.userName ?? '',
          email: user.email ?? '',
          nom: user.nom ?? '',
          prenom: user.prenom ?? '',
          telephone: user.telephone ?? '',
          idrole: user.idrole ?? null,
          motdepasse: ''
        });
      },
      error: () => {
        this.notificationService.error('Impossible de charger les donnees utilisateur.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
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
