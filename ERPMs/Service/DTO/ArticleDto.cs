namespace Service.DTO;

public class ArticleDto
{
    public int Idarticle { get; set; }

    public string Nom { get; set; }

    public string? Description { get; set; }

    public decimal Prix { get; set; }

    public int Quantitestock { get; set; }

    public int Seuilminimum { get; set; }

    public int? Idcategorie { get; set; }

    public string? CategorieNom { get; set; }

    public List<int> FournisseurIds { get; set; } = new();
}
