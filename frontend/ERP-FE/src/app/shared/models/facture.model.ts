export interface FactureFilter {
  statut?: string;
  idcommande?: number;
}

export interface Facture {
  idfacture: number;
  idcommande: number;
  datefacture?: string;
  montantttc: number;
  statut: string;
}

export interface FactureDetail {
  idfacture: number;
  idcommande: number;
  montantttc: number;
  statut: string;
}

export interface PaiementCreate {
  montant: number;
  modepaiement: string;
  reference?: string;
}

export interface Paiement {
  idpaiement: number;
  idfacture: number;
  montant: number;
  modepaiement: string;
  datepaiement: string;
}
