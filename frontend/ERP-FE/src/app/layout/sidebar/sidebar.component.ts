import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuDto } from '../../features/auth/models/user.models';
import { MenuService } from '../../core/services/menu.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  readonly menus$: Observable<MenuDto[]>;

  constructor(private menuService: MenuService) {
    this.menus$ = this.menuService.menus$;
  }
}
