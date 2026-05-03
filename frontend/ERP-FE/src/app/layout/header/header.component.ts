import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUserState } from '../../features/auth/models/user.models';
import { AuthService } from '../../shared/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly user$: Observable<AuthUserState | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
