namespace Service.DTO;

public class PaiementDto
{
    public int Idpaiement { get; set; }

    public int Idfacture { get; set; }

    public DateTime Datepaiement { get; set; }

    public decimal Montant { get; set; }

    public string? Modepaiement { get; set; }

    public string? Reference { get; set; }
}