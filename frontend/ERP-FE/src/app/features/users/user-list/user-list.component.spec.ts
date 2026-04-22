import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserIamService } from '../../../core/services/user-iam.service';
import { provideRouter } from '@angular/router';

import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  const userIamServiceMock = {
    getUsers: jasmine.createSpy('getUsers').and.returnValue(of([{ iduser: 1, userName: 'admin' }]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideRouter([]),
        { provide: UserIamService, useValue: userIamServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(component.users.length).toBe(1);
    expect(userIamServiceMock.getUsers).toHaveBeenCalled();
  });
});
