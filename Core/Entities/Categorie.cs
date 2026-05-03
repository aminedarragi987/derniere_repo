using System.Collections.Generic;

namespace Core.Entities;

public partial class Categorie
{
    public int Idcategorie { get; set; }

    public string Nom { get; set; }

    public string? Description { get; set; }

    public string? Sexe { get; set; }

    public string? Typevetement { get; set; }

    public string? Couleur { get; set; }

    public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
}
