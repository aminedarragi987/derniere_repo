import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIamService } from '../../../../core/services/user-iam.service';
import { MenuDto } from '../../models/user.models';

@Component({
  selector: 'app-admin-menus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-menus.component.html',
  styleUrl: './admin-menus.component.css'
})
export class AdminMenusComponent implements OnInit {
  menus: MenuDto[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;
  form!: FormGroup;

  constructor(private userIamService: UserIamService, private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      idmenu: [0],
      titre: ['', Validators.required],
      description: [''],
      memRouterlink: [''],
      memHref: [''],
      memIcon: [''],
      memTarget: [''],
      hassubmenu: [false],
      parentid: [null as number | null]
    });
  }

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.isLoading = true;
    this.userIamService.getMenus().subscribe({
      next: (menus) => {
        this.menus = menus;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des menus.';
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
    const isEdit = formValue.idmenu > 0;

    if (isEdit) {
      this.userIamService.updateMenu(formValue.idmenu, formValue).subscribe({
        next: () => {
          this.successMessage = 'Menu mis à jour.';
          this.loadMenus();
          this.toggleForm();
        },
        error: () => {
          this.errorMessage = "Erreur lors de l'opération.";
        }
      });
      return;
    }

    this.userIamService.addMenu(formValue).subscribe({
      next: () => {
        this.successMessage = 'Menu créé.';
        this.loadMenus();
        this.toggleForm();
      },
      error: () => {
        this.errorMessage = "Erreur lors de l'opération.";
      }
    });
  }

  edit(menu: MenuDto): void {
    this.form.patchValue(menu);
    this.showForm = true;
  }

  delete(idmenu: number): void {
    if (!confirm('Êtes-vous sûr ?')) return;
    this.userIamService.deleteMenu(idmenu).subscribe({
      next: () => {
        this.successMessage = 'Menu supprimé.';
        this.loadMenus();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression.';
      }
    });
  }
}
