import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CommandeCreateDto, CommandeDto, CommandeFilterDto, CommandeStatusDto, LigneCommandeDto } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private readonly api = `${environment.gatewayUrl}/Commande`;

  constructor(private http: HttpClient) {}

  getCommandes(filter?: CommandeFilterDto): Observable<CommandeDto[]> {
    let params = new HttpParams();
    if (filter?.idclient) {
      params = params.set('idclient', filter.idclient.toString());
    }
    if (filter?.statut) {
      params = params.set('statut', filter.statut);
    }

    return this.http.get<CommandeDto[]>(this.api, { params });
  }

  createCommande(payload: CommandeCreateDto): Observable<CommandeDto> {
    return this.http.post<CommandeDto>(this.api, payload);
  }

  addLigneCommande(idcommande: number, payload: LigneCommandeDto): Observable<CommandeDto> {
    return this.http.post<CommandeDto>(`${this.api}/${idcommande}/Article`, payload);
  }

  validateCommande(idcommande: number): Observable<CommandeDto> {
    return this.http.patch<CommandeDto>(`${this.api}/${idcommande}/Valider`, {});
  }

  getCommandeStatus(idcommande: number): Observable<CommandeStatusDto> {
    return this.http.get<CommandeStatusDto>(`${this.api}/${idcommande}/Statut`);
  }

  deleteCommande(idcommande: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${this.api}/${idcommande}`);
  }
}
