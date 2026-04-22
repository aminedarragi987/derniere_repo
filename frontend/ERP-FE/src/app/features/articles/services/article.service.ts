import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ArticleDto, ArticleFilterDto, FournisseurDto } from '../models/article.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  private api = `${environment.gatewayUrl}/Stock`;

  constructor(private http: HttpClient) {}

  getArticles(filter?: ArticleFilterDto): Observable<ArticleDto[]> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.idcategorie) params = params.set('idcategorie', filter.idcategorie.toString());
      if (filter.idfournisseur) params = params.set('idfournisseur', filter.idfournisseur.toString());
      if (filter.prixMin) params = params.set('prixMin', filter.prixMin.toString());
      if (filter.prixMax) params = params.set('prixMax', filter.prixMax.toString());
    }

    return this.http.get<ArticleDto[]>(`${this.api}/Articles`, { params });
  }

  getAll(): Observable<ArticleDto[]> {
    return this.getArticles();
  }

  getStock(id: number): Observable<number> {
    return this.http.get<number>(`${this.api}/Article/${id}/NiveauStock`);
  }

  create(data: ArticleDto): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(`${this.api}/Article`, data);
  }

  update(id: number, data: ArticleDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${this.api}/Article/${id}`, data);
  }

  delete(id: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${this.api}/Article/${id}`);
  }

  getFournisseurs(): Observable<FournisseurDto[]> {
    return this.http.get<FournisseurDto[]>(`${this.api}/Fournisseurs`);
  }

  associateFournisseur(idarticle: number, idfournisseur: number): Observable<{ Message: string }> {
    return this.http.post<{ Message: string }>(`${this.api}/Article/${idarticle}/Fournisseur/${idfournisseur}`, {});
  }
}