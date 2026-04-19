namespace Service.DTO;

public class PaiementCreateDto
{
    public decimal Montant { get; set; }

    public string? Modepaiement { get; set; }

    public string? Reference { get; set; }
}