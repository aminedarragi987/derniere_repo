namespace Service.DTO;

public class FactureDetailDto
{
    public int Idfacture { get; set; }

    public int Idcommande { get; set; }

    public int Idclient { get; set; }

    public string NomClient { get; set; } = string.Empty;

    public DateTime Datecommande { get; set; }

    public DateTime Datefacture { get; set; }

    public decimal Totalcommande { get; set; }

    public decimal Montantttc { get; set; }

    public string Statut { get; set; } = string.Empty;
}
