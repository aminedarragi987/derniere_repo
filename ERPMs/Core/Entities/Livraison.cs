using System;

namespace Core.Entities;

public partial class Livraison
{
    public int Idlivraison { get; set; }

    public int Idcommande { get; set; }

    public DateTime Datelivraison { get; set; }

    public string? Adresse { get; set; }

    public string Statut { get; set; } = string.Empty;

    public virtual Commande IdcommandeNavigation { get; set; } = null!;
}