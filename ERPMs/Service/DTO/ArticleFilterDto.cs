namespace Service.DTO;

public class ArticleFilterDto
{
    public string? Search { get; set; }

    public int? Idcategorie { get; set; }

    public int? Idfournisseur { get; set; }

    public decimal? PrixMin { get; set; }

    public decimal? PrixMax { get; set; }
}
