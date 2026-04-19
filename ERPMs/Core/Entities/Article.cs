using System.Collections.Generic;

namespace Core.Entities;

public partial class Article
{
    public int Idarticle { get; set; }

    public string Nom { get; set; }

    public string? Description { get; set; }

    public decimal Prix { get; set; }

    public int Quantitestock { get; set; }

    public int Seuilminimum { get; set; }

    public int? Idcategorie { get; set; }

    public virtual Categorie? IdcategorieNavigation { get; set; }

    public virtual ICollection<ArticleFournisseur> ArticleFournisseurs { get; set; } = new List<ArticleFournisseur>();
}
