import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livraison, ComptabiliteExport } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private readonly api = 'http://localhost:5100/Livraison';

  constructor(private http: HttpClient) {}

  generer(idCommande: number): Observable<Livraison> {
    return this.http.post<Livraison>(`${this.api}/Commande/${idCommande}`, {});
  }

  getById(idLivraison: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.api}/${idLivraison}`);
  }

  exportComptabilite(idLivraison: number): Observable<ComptabiliteExport> {
    return this.http.post<ComptabiliteExport>(`${this.api}/${idLivraison}/Comptabilite`, {});
  }
}
