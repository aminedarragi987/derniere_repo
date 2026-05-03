namespace Service.DTO;

public class ArticleFilterDto
{
    public string? Search { get; set; }

    public int? Idcategorie { get; set; }
    public int? Idfournisseur { get; set; }

    public string? Sexe { get; set; }
    public string? Typevetement { get; set; }
    public string? Marque { get; set; }
    public string? Couleur { get; set; }
    public string? Taille { get; set; }

    public decimal? PrixMin { get; set; }
    public decimal? PrixMax { get; set; }

    // E-commerce filters
    public string? Statut { get; set; }
    public bool? IsFeatured { get; set; }
    public string? Matiere { get; set; }
}