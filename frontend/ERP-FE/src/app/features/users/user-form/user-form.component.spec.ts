import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { UserIamService } from '../../../core/services/user-iam.service';

import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  const userIamServiceMock = {
    getRoles: jasmine.createSpy('getRoles').and.returnValue(of([{ idrole: 1, nom: 'Gestionnaire' }])),
    getUsers: jasmine.createSpy('getUsers').and.returnValue(of([])),
    addUser: jasmine.createSpy('addUser').and.returnValue(of({ Message: 'ok' })),
    updateUser: jasmine.createSpy('updateUser').and.returnValue(of({ Message: 'ok' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        provideRouter([]),
        { provide: UserIamService, useValue: userIamServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser on save when form is valid', () => {
    component.form.patchValue({
      userName: 'admin',
      email: 'admin@erp.tn',
      nom: 'Admin',
      prenom: 'ERP',
      idrole: 1,
      motdepasse: 'secret12'
    });

    component.save();
    expect(userIamServiceMock.addUser).toHaveBeenCalled();
  });
});
