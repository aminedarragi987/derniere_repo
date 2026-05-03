import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { MenuDto } from '../../features/auth/models/user.models';
import { MenuService, AuthService } from '../../shared/services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  readonly menus$: Observable<MenuDto[]>;

  constructor(
    private menuService: MenuService,
    private authService: AuthService
  ) {
    this.menus$ = this.menuService.menus$;
  }

  ngOnInit(): void {
    this.authService
      .currentUser$
      .pipe(
        filter((user) => !!user),
        switchMap(() => this.menuService.loadMyMenus())
      )
      .subscribe({ error: () => undefined });

    if (!this.authService.currentUserValue) {
      this.authService.loadConnectedUser().subscribe({ error: () => undefined });
    }
  }
}
