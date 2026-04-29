using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;
using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public partial class FournisseurDto : IMapFrom<Fournisseur>
{
    public int Idfournisseur { get; set; }

    [Required]
    [StringLength(120)]
    public string Nom { get; set; } = string.Empty;

    [EmailAddress]
    [StringLength(200)]
    public string? Email { get; set; }

    [Phone]
    [StringLength(30)]
    public string? Telephone { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Fournisseur, FournisseurDto>().ReverseMap();
    }
}
