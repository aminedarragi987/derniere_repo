using System;

namespace Core.Entities;

public partial class Paiement
{
    public int Idpaiement { get; set; }

    public int Idfacture { get; set; }

    public DateTime Datepaiement { get; set; }

    public decimal Montant { get; set; }

    public string? Modepaiement { get; set; }

    public string? Reference { get; set; }

    public virtual Facture IdfactureNavigation { get; set; } = null!;
}