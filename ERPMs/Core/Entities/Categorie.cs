using System.Collections.Generic;

namespace Core.Entities;

public partial class Categorie
{
    public int Idcategorie { get; set; }

    public string Nom { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
}
