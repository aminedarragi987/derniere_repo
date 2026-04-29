using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public partial class CategorieDto : IMapFrom<Categorie>
{
    public int Idcategorie { get; set; }

    [Required]
    [StringLength(120)]
    public string Nom { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Categorie, CategorieDto>().ReverseMap();
    }
}
