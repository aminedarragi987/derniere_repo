import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticleService } from '../../services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleDto, FournisseurDto } from '../../models/article.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.css'
})
export class ArticleFormComponent implements OnInit {

  form!: FormGroup;
  fournisseurs: FournisseurDto[] = [];
  isEdit = false;
  id!: number;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.nonNullable.group({
      idarticle: [0],
      nom: ['', Validators.required],
      description: [''],
      prix: [0, Validators.required],
      quantitestock: [0, Validators.required],
      seuilminimum: [0, Validators.required],
      idcategorie: [null as number | null],
      fournisseurIds: [[] as number[]]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.service.getFournisseurs().subscribe({
      next: (res) => {
        this.fournisseurs = res;
      },
      error: () => {
        this.fournisseurs = [];
      }
    });

    if (this.id) {
      this.isEdit = true;
      this.service.getAll().subscribe((list) => {
        const article = list.find((a) => a.idarticle === +this.id);
        if (article) {
          this.form.patchValue({
            idarticle: article.idarticle,
            nom: article.nom,
            description: article.description ?? '',
            prix: article.prix,
            quantitestock: article.quantitestock,
            seuilminimum: article.seuilminimum,
            idcategorie: article.idcategorie ?? null,
            fournisseurIds: article.fournisseurIds ?? []
          });
        }
      });
    }
  }

  onSelectFournisseurs(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map((option) => Number(option.value));
    this.form.patchValue({ fournisseurIds: selected });
  }

  isSelectedFournisseur(id: number | undefined): boolean {
    if (!id) return false;
    const selected = this.form.get('fournisseurIds')?.value as number[];
    return selected?.includes(id) ?? false;
  }

  save(): void {
    if (!this.canManageArticles) {
      this.errorMessage = "Action refusee: le role Gestionnaire est requis pour enregistrer un article.";
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.form.getRawValue();

    if (this.isEdit) {
      this.service.update(this.id, formValue).subscribe({
        next: () => {
          this.router.navigate(['/articles']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.status === 403
            ? "Enregistrement refuse: le role Gestionnaire est requis."
            : "Erreur lors de l'enregistrement.";
          this.isSubmitting = false;
        }
      });
      return;
    }

    this.service.create(formValue).subscribe({
      next: () => {
        this.router.navigate(['/articles']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 403
          ? "Enregistrement refuse: le role Gestionnaire est requis."
          : "Erreur lors de l'enregistrement.";
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/articles']);
  }

  get canManageArticles(): boolean {
    return this.authService.hasAnyRole(['Gestionnaire']);
  }
}