using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class Commande
{
    public int Idcommande { get; set; }

    public DateTime Datecommande { get; set; }

    public int Idclient { get; set; }

    public decimal Totalcommande { get; set; }

    public string Statut { get; set; } = string.Empty;

    public virtual Client IdclientNavigation { get; set; } = null!;

    public virtual ICollection<LigneCommande> LigneCommandes { get; set; } = new List<LigneCommande>();

    public virtual ICollection<Facture> Factures { get; set; } = new List<Facture>();

    public virtual ICollection<Livraison> Livraisons { get; set; } = new List<Livraison>();
}