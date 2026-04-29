using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public class PaiementCreateDto
{
    [Range(typeof(decimal), "0.01", "999999999")]
    public decimal Montant { get; set; }

    [StringLength(50)]
    public string? Modepaiement { get; set; }

    [StringLength(100)]
    public string? Reference { get; set; }
}