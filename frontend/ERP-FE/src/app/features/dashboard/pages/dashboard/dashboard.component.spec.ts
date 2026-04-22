import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserIamService } from '../../../../core/services/user-iam.service';
import { ArticleService } from '../../../articles/services/article.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let userIamServiceMock: {
    getUsers: jasmine.Spy;
  };

  let articleServiceMock: {
    getAll: jasmine.Spy;
    getFournisseurs: jasmine.Spy;
  };

  beforeEach(async () => {
    userIamServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(of([{ iduser: 1 }]))
    };

    articleServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(
        of([
          { idarticle: 1, nom: 'A', prix: 10, quantitestock: 2, seuilminimum: 5, fournisseurIds: [] },
          { idarticle: 2, nom: 'B', prix: 12, quantitestock: 8, seuilminimum: 4, fournisseurIds: [] }
        ])
      ),
      getFournisseurs: jasmine.createSpy('getFournisseurs').and.returnValue(of([{ idfournisseur: 1, nom: 'F' }]))
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: UserIamService, useValue: userIamServiceMock },
        { provide: ArticleService, useValue: articleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate KPIs and low stock alerts', () => {
    expect(component.usersCount).toBe(1);
    expect(component.articlesCount).toBe(2);
    expect(component.fournisseursCount).toBe(1);
    expect(component.lowStockAlerts.length).toBe(1);
  });

  it('should mark service health as error when user endpoint fails', () => {
    userIamServiceMock.getUsers.and.returnValue(throwError(() => new Error('boom')));
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.usersHealth).toBe('error');
  });
});
