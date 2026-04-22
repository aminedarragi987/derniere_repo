export interface LigneCommandeDto {
  idarticle: number;
  quantite: number;
}

export interface CommandeCreateDto {
  idclient: number;
}

export interface CommandeFilterDto {
  idclient?: number;
  statut?: string;
}

export interface CommandeDto {
  idcommande: number;
  datecommande: string;
  statut?: string;
  idclient?: number;
  total?: number;
}

export interface CommandeStatusDto {
  idcommande: number;
  statut: string;
}
