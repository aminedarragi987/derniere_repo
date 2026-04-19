namespace Service.DTO;

public class FactureDto
{
    public int Idfacture { get; set; }

    public int Idcommande { get; set; }

    public DateTime Datefacture { get; set; }

    public decimal Montantttc { get; set; }

    public string Statut { get; set; } = string.Empty;
}