/* src/app/shared/models/fournisseur.model.ts */
export interface FournisseurDto {
  idfournisseur?: number;
  nom: string;
  email?: string | null;
  telephone?: string | null;
}
