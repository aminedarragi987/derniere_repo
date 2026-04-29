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
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  infoMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.route.queryParams.subscribe(params => {
      if (params['expired']) {
        this.infoMessage = 'Votre session a expiré.';
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const { Username, Password, rememberMe } = this.form.getRawValue();

    this.authService.login({ Username, Password }, rememberMe).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/articles';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = (err.status === 401 || err.status === 404) 
          ? 'Utilisateur ou mot de passe incorrect.' 
          : 'Le serveur est inaccessible.';
      },
      complete: () => this.isSubmitting = false
    });
  }

  get emailControl() { return this.form.controls['Username']; }
  get passwordControl() { return this.form.controls['Password']; }
}
