namespace Service.DTO;

public class VenteMensuelleDto
{
    public int Annee { get; set; }

    public int Mois { get; set; }

    public int NombreCommandes { get; set; }

    public decimal TotalCommandes { get; set; }

    public decimal TotalFactures { get; set; }

    public decimal TotalPaiements { get; set; }
}
