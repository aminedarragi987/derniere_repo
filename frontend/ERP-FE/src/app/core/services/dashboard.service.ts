import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardStockDto } from '../../features/dashboard/models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly api = 'http://localhost:5100/Stock';

  constructor(private http: HttpClient) {}

  private readonly demoDashboard: DashboardStockDto = {
    nombreArticles: 5,
    nombreFournisseurs: 3,
    nombreCommandes: 12,
    nombreCommandesValidees: 8,
    nombreArticlesEnAlerte: 1,
    chiffreAffaires: 2450.75
  };

  getDashboard(): Observable<DashboardStockDto> {
    return this.http.get<DashboardStockDto>(`${this.api}/Dashboard`).pipe(
      catchError(() => of(this.demoDashboard))
    );
  }
}