import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommandeListComponent } from './commande-list.component';
import { CommandeService } from '../../services/commande.service';

describe('CommandeListComponent', () => {
  let component: CommandeListComponent;
  let fixture: ComponentFixture<CommandeListComponent>;

  const commandeServiceMock = {
    getCommandes: jasmine.createSpy('getCommandes').and.returnValue(
      of([{ idcommande: 12, datecommande: '2026-04-21T10:00:00Z', statut: 'Validee', idclient: 4, total: 125 }])
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeListComponent],
      providers: [{ provide: CommandeService, useValue: commandeServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(CommandeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load commandes on init', () => {
    expect(component.commandes.length).toBe(1);
    expect(commandeServiceMock.getCommandes).toHaveBeenCalled();
  });
});
