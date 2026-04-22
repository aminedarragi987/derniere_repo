import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { FournisseurDto } from '../models/article.model';

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

  update(idfournisseur: number, fournisseur: FournisseurDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${this.api}/Fournisseur/${idfournisseur}`, fournisseur);
  }

  delete(idfournisseur: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${this.api}/Fournisseur/${idfournisseur}`);
  }
}
