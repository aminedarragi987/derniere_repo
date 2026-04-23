namespace Service.DTO;

public class CardPaymentDto
{
    public decimal Montant { get; set; }

    public string CardNumber { get; set; } = string.Empty;

    public string CardHolderName { get; set; } = string.Empty;

    public int ExpiryMonth { get; set; }

    public int ExpiryYear { get; set; }

    public string Cvv { get; set; } = string.Empty;

    public string? Reference { get; set; }
}
