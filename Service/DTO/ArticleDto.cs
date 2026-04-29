using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public class ArticleDto
{
    public int Idarticle { get; set; }

    [Required]
    [StringLength(120)]
    public string Nom { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal Prix { get; set; }

    [Range(0, int.MaxValue)]
    public int Quantitestock { get; set; }

    [Range(0, int.MaxValue)]
    public int Seuilminimum { get; set; }

    public int? Idcategorie { get; set; }

    public string? CategorieNom { get; set; }

    public List<int> FournisseurIds { get; set; } = new();
}
