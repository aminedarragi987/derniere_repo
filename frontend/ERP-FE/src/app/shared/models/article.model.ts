export interface ArticleDto {
  idarticle?: number;
  nom: string;
  description?: string | null;
  prix: number;
  quantitestock: number;
  seuilminimum: number;

  sexe?: string | null;
  typevetement?: string | null;
  marque?: string | null;
  couleur?: string | null;
  taille?: string | null;

  imageUrl?: string | null;
  sku?: string | null;
  statut?: string | null;
  slug?: string | null;
  isFeatured?: boolean;
  matiere?: string | null;

  idcategorie?: number | null;
  categorieNom?: string | null;

  fournisseurIds?: number[];
}

export interface ArticleFilterDto {
  search?: string | null;
  idcategorie?: number | null;
  idfournisseur?: number | null;
  sexe?: string | null;
  typevetement?: string | null;
  marque?: string | null;
  couleur?: string | null;
  taille?: string | null;
  prixMin?: number | null;
  prixMax?: number | null;
}