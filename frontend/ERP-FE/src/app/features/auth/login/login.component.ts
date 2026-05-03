import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, NotificationService } from '../../../shared/services';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      Username: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.route.queryParams.subscribe(params => {
      if (params['expired']) {
        this.notificationService.info('Votre session a expiré.');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { Username, Password, rememberMe } = this.form.getRawValue();

    this.authService.login({ Username, Password }, rememberMe).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const user = this.authService.currentUserValue;
        
        // Si DG, forcer dashboard
        // Vérifier le rôle sans accent pour éviter les problèmes de normalisation
        const hasDGRole = user && user.roles && user.roles.some(role => 
          role.toLowerCase().includes('directeur') && (role.toLowerCase().includes('general') || role.toLowerCase().includes('generale'))
        );
        
        this.notificationService.success('Connexion réussie.');
        
        if (hasDGRole) {
          this.router.navigateByUrl('/dashboard');
        } else if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigateByUrl('/articles');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const errorMsg = (err.status === 401 || err.status === 404) 
          ? 'Utilisateur ou mot de passe incorrect.' 
          : 'Le serveur est inaccessible.';
        this.notificationService.error(errorMsg);
      },
      complete: () => this.isSubmitting = false
    });
  }

  get emailControl() { return this.form.controls['Username']; }
  get passwordControl() { return this.form.controls['Password']; }
}
