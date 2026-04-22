export interface ClientDto {
  idclient: number;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
}

export interface ClientCreateDto {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
}

export interface ClientUpdateDto {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
}
