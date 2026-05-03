/* src/app/shared/services/categorie.service.ts */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategorieDto } from '../models';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private api = `${environment.gatewayUrl}/Stock`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategorieDto[]> {
    return this.http.get<CategorieDto[]>(`${this.api}/Categories`);
  }

  addCategorie(data: CategorieDto): Observable<CategorieDto> {
    return this.http.post<CategorieDto>(`${this.api}/Categorie`, data);
  }

  updateCategorie(id: number, data: CategorieDto): Observable<void> {
    return this.http.put<void>(`${this.api}/Categorie/${id}`, data);
  }

  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/Categorie/${id}`);
  }
}
