import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	Facture,
	FactureDetail,
	FactureFilter,
	Paiement,
	PaiementCreate
} from '../../features/factures/models/facture.model';

@Injectable({
	providedIn: 'root'
})
export class FactureService {
	private readonly api = 'http://localhost:5100/Facture';

	constructor(private http: HttpClient) {}

	getFactures(filter?: FactureFilter): Observable<FactureDetail[]> {
		let params = new HttpParams();

		if (filter?.statut) {
			params = params.set('statut', filter.statut);
		}

		if (filter?.idcommande) {
			params = params.set('idcommande', filter.idcommande);
		}

		return this.http.get<FactureDetail[]>(this.api, { params });
	}

	genererFacture(idCommande: number): Observable<Facture> {
		return this.http.post<Facture>(`${this.api}/Commande/${idCommande}`, {});
	}

	ajouterPaiement(idFacture: number, payload: PaiementCreate): Observable<Paiement> {
		return this.http.post<Paiement>(`${this.api}/${idFacture}/Paiement`, payload);
	}
}
