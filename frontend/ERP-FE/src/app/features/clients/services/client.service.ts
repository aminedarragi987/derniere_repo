import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientCreateDto, ClientDto, ClientUpdateDto } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly api = `${environment.gatewayUrl}/Client`;

  constructor(private http: HttpClient) {}

  getClients(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(this.api);
  }

  addClient(payload: ClientCreateDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(this.api, payload);
  }

  updateClient(idclient: number, payload: ClientUpdateDto): Observable<{ Message: string }> {
    return this.http.put<{ Message: string }>(`${this.api}/${idclient}`, payload);
  }

  deleteClient(idclient: number): Observable<{ Message: string }> {
    return this.http.delete<{ Message: string }>(`${this.api}/${idclient}`);
  }
}
