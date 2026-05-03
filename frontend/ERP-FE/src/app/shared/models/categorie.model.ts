/* src/app/shared/models/categorie.model.ts */
export interface CategorieDto {
  idcategorie?: number;
  nom: string;
  description?: string | null;
  sexe?: string | null;
  typevetement?: string | null;
  couleur?: string | null;
}
