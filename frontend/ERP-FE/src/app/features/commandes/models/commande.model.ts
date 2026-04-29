export interface LigneCommandeDto {
  idarticle: number;
  quantite: number;
}

export interface CommandeCreateDto {
  idclient: number;
}

export interface CommandeFilterDto {
  idcommande?: number;
  datecommande?: string;
}

export interface CommandeDto {
  idcommande: number;
  idclient: number;
  datecommande: string;
  totalcommande: number;
  statut: string;
}

export interface CommandeStatusDto {
  idcommande: number;
  statut: string;
}
