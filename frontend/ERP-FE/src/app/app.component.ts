import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

import { AuthService } from './core/services/auth.service';
import { MenuService } from './core/services/menu.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ERP-FE';
  showShell = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.updateShell(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.updateShell(event.urlAfterRedirects);
      });
  }

  private updateShell(url: string): void {
    // Shell uniquement pour les pages privées
    this.showShell = !url.startsWith('/auth') && url !== '/';

    if (this.showShell && this.authService.isAuthenticated()) {
      this.authService
        .loadConnectedUser()
        .pipe(switchMap(() => this.menuService.loadMyMenus()))
        .subscribe({ error: () => undefined });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}