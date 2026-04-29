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

    public string? Sexe { get; set; }          // Homme / Femme / Unisexe / Enfant
    public string? Typevetement { get; set; }  // T-shirt / Pull / Pantalon / Chaussure
    public string? Marque { get; set; }        // Zara / Nike / etc
    public string? Couleur { get; set; }       // Noir / Bleu / Blanc
    public string? Taille { get; set; }        // S / M / L / XL

    public int? Idcategorie { get; set; }

    public virtual Categorie? IdcategorieNavigation { get; set; }

    public virtual ICollection<ArticleFournisseur> ArticleFournisseurs { get; set; } = new List<ArticleFournisseur>();
}