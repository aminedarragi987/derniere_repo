using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;

namespace Service.DTO;

public partial class FournisseurDto : IMapFrom<Fournisseur>
{
    public int Idfournisseur { get; set; }

    public string Nom { get; set; }

    public string? Email { get; set; }

    public string? Telephone { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Fournisseur, FournisseurDto>().ReverseMap();
    }
}
