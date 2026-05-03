import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FournisseurDto } from '../models';

@Injectable({ providedIn: 'root' })
export class FournisseurService {

  private api = `${environment.gatewayUrl}/Stock`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FournisseurDto[]> {
    return this.http.get<FournisseurDto[]>(`${this.api}/Fournisseurs`);
  }

  create(fournisseur: FournisseurDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(`${this.api}/Fournisseur`, fournisseur);
  }

  update(id: number, fournisseur: FournisseurDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${this.api}/Fournisseur/${id}`, fournisseur);
  }

  delete(id: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${this.api}/Fournisseur/${id}`);
  }
}
