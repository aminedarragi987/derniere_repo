using Core.Entities;
using Service.Common.Mappings;
using System;
using System.Collections.Generic;

namespace Service.DTO;

public partial class RefreshtokenDto : IMapFrom<Refreshtoken>
{
    public int Id { get; set; }

    public string Token { get; set; }

    public DateTime? Expiresatutc { get; set; }

    public bool? Revoked { get; set; }

    public int? Iduser { get; set; }

    public virtual UtilisateurDto IduserNavigation { get; set; }

    public void Mapping(AutoMapper.Profile profile)
    {
        profile.CreateMap<Refreshtoken, RefreshtokenDto>().ReverseMap();

    }

}
