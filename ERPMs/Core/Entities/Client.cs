using System.Collections.Generic;

namespace Core.Entities;

public partial class Client
{
    public int Idclient { get; set; }

    public string Nom { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? Telephone { get; set; }

    public string? Adresse { get; set; }

    public virtual ICollection<Commande> Commandes { get; set; } = new List<Commande>();
}