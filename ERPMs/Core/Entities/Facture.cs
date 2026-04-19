using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class Facture
{
    public int Idfacture { get; set; }

    public int Idcommande { get; set; }

    public DateTime Datefacture { get; set; }

    public decimal Montantttc { get; set; }

    public string Statut { get; set; } = string.Empty;

    public virtual Commande IdcommandeNavigation { get; set; } = null!;

    public virtual ICollection<Paiement> Paiements { get; set; } = new List<Paiement>();
}