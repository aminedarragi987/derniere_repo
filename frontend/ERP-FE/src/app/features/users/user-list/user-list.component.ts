import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilisateurDto } from '../../auth/models/user.models';
import { UserIamService, NotificationService } from '../../../shared/services';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: UtilisateurDto[] = [];
  isLoading = false;

  constructor(
    private userIamService: UserIamService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;

    this.userIamService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.notificationService.error('Impossible de charger les utilisateurs.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
