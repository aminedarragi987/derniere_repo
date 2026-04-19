namespace Service.DTO;

public class LivraisonDto
{
    public int Idlivraison { get; set; }

    public int Idcommande { get; set; }

    public DateTime Datelivraison { get; set; }

    public string? Adresse { get; set; }

    public string Statut { get; set; } = string.Empty;
}