export interface ArticleDto {
  idarticle?: number;
  nom: string;
  description?: string;
  prix: number;
  quantitestock: number;
  seuilminimum: number;
  idcategorie?: number | null;
  categorieNom?: string;
  fournisseurIds: number[];
}

export interface ArticleFilterDto {
  search?: string | null;
  idcategorie?: number | null;
  idfournisseur?: number | null;
  prixMin?: number | null;
  prixMax?: number | null;
}

export interface FournisseurDto {
  idfournisseur?: number;
  nom: string;
  email?: string;
  telephone?: string;
}

export interface CategorieDto {
  idcategorie?: number;
  nom: string;
  description?: string;
}