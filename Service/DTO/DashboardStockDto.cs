namespace Service.DTO;

public class DashboardStockDto
{
    public int NombreArticles { get; set; }
    public int NombreFournisseurs { get; set; }

    public int NombreCommandes { get; set; }
    public int NombreCommandesValidees { get; set; }

    public int NombreArticlesEnAlerte { get; set; }

    public decimal ChiffreAffaires { get; set; }
}