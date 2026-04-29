export interface Livraison {
  idlivraison: number;
  idcommande: number;
  datelivraison: string;
  adresse: string;
  statut: string;
}

export interface ComptabiliteExport {
  idlivraison: number;
  idcommande: number;
  datelivraison: string;
  adresse: string;
  statutLivraison: string;
  envoyeLeUtc: string;
  statutEnvoi: string;
}