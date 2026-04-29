namespace Service.DTO;

public class StockNiveauDto
{
    public int Idarticle { get; set; }

    public string NomArticle { get; set; } = string.Empty;

    public int Quantitestock { get; set; }

    public int Seuilminimum { get; set; }

    public bool AlerteStock { get; set; }
}
