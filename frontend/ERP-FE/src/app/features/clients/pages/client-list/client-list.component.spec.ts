import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ClientListComponent } from './client-list.component';
import { ClientService } from '../../services/client.service';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;

  const clientServiceMock = {
    getClients: jasmine.createSpy('getClients').and.returnValue(
      of([
        { idclient: 1, nom: 'Client A', email: 'a@test.tn' },
        { idclient: 2, nom: 'Client B', email: 'b@test.tn' }
      ])
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientListComponent],
      providers: [{ provide: ClientService, useValue: clientServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter clients by search term', () => {
    component.search = 'client a';
    component.applyFilter();

    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0].nom).toBe('Client A');
  });
});
