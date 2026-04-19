using System.Collections.Generic;

namespace Core.Entities;

public partial class Fournisseur
{
    public int Idfournisseur { get; set; }

    public string Nom { get; set; }

    public string? Email { get; set; }

    public string? Telephone { get; set; }

    public virtual ICollection<ArticleFournisseur> ArticleFournisseurs { get; set; } = new List<ArticleFournisseur>();
}
