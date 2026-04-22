import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  infoMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.nonNullable.group({
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    const expired = this.route.snapshot.queryParamMap.get('expired');
    if (expired) {
      this.infoMessage = 'Session expiree, reconnecte-toi.';
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const formValue = this.form.getRawValue();
    const loginPayload = { Username: formValue.Username, Password: formValue.Password };
    const rememberMe = formValue.rememberMe ?? false;

    this.authService.login(loginPayload, rememberMe).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/articles';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: { status?: number }) => {
        this.errorMessage =
          error?.status === 404 || error?.status === 401
            ? 'Identifiants invalides.'
            : 'Erreur serveur. Reessaie dans quelques instants.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  get emailControl() {
    return this.form.controls['Username'];
  }

  get passwordControl() {
    return this.form.controls['Password'];
  }
}