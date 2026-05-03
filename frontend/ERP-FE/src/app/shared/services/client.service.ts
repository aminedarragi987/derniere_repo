import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ClientDto, ClientCreateDto, ClientUpdateDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private api = `${environment.gatewayUrl}/Client`;

  constructor(private http: HttpClient) {}

  getClients(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(this.api);
  }

  addClient(payload: ClientCreateDto): Observable<ClientDto> {
    return this.http.post<ClientDto>(this.api, payload);
  }

  updateClient(id: number, payload: ClientUpdateDto): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, payload);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
