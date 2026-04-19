using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;

namespace Service.DTO;

public partial class CategorieDto : IMapFrom<Categorie>
{
    public int Idcategorie { get; set; }

    public string Nom { get; set; }

    public string? Description { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Categorie, CategorieDto>().ReverseMap();
    }
}
