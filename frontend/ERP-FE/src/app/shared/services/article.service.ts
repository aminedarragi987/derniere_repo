/* src/app/shared/services/article.service.ts */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ArticleDto, ArticleFilterDto, FournisseurDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private api = `${environment.gatewayUrl}/Stock`;

  constructor(private http: HttpClient) {}

  getArticles(filter?: ArticleFilterDto): Observable<ArticleDto[]> {
    let params = new HttpParams();

    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.idcategorie != null) params = params.set('idcategorie', filter.idcategorie.toString());
      if (filter.idfournisseur != null) params = params.set('idfournisseur', filter.idfournisseur.toString());
      if (filter.sexe) params = params.set('sexe', filter.sexe);
      if (filter.typevetement) params = params.set('typevetement', filter.typevetement);
      if (filter.marque) params = params.set('marque', filter.marque);
      if (filter.couleur) params = params.set('couleur', filter.couleur);
      if (filter.taille) params = params.set('taille', filter.taille);
      if (filter.prixMin != null) params = params.set('prixMin', filter.prixMin.toString());
      if (filter.prixMax != null) params = params.set('prixMax', filter.prixMax.toString());
    }

    return this.http.get<ArticleDto[]>(`${this.api}/Articles`, { params });
  }

  getAll(): Observable<ArticleDto[]> {
    return this.http.get<ArticleDto[]>(`${this.api}/Articles`);
  }

  create(data: ArticleDto): Observable<ArticleDto> {
    return this.http.post<ArticleDto>(`${this.api}/Article`, data);
  }

  update(id: number, data: ArticleDto): Observable<void> {
    return this.http.put<void>(`${this.api}/Article/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/Article/${id}`);
  }

  getFournisseurs(): Observable<FournisseurDto[]> {
    return this.http.get<FournisseurDto[]>(`${this.api}/Fournisseurs`);
  }
}
