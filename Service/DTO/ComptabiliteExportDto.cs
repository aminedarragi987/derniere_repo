namespace Service.DTO;

public class ComptabiliteExportDto
{
    public int Idlivraison { get; set; }

    public int Idcommande { get; set; }

    public DateTime Datelivraison { get; set; }

    public string? Adresse { get; set; }

    public string? StatutLivraison { get; set; }

    public DateTime EnvoyeLeUtc { get; set; }

    public string StatutEnvoi { get; set; } = "Envoyé";
}
