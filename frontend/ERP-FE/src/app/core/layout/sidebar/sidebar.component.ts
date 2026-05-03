import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuDto } from '../../../features/auth/models/user.models';
import { MenuService } from '../../../shared/services/menu.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  readonly menus$: Observable<MenuDto[]>;

  constructor(private menuService: MenuService) {
    this.menus$ = this.menuService.menus$;
  }

  ngOnInit(): void {
    this.menuService.loadMyMenus().subscribe();
  }
}
