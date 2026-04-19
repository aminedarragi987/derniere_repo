using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;


#nullable disable

namespace Service.DTO
{
    public partial class ProfileDto : IMapFrom<Core.Entities.Profile>
    {
        public int Idprofil { get; set; }

        public string Nom { get; set; }

        public string Description { get; set; }

        public virtual ICollection<RolesDto> Roles { get; set; } = new List<RolesDto>();



        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<Core.Entities.Profile, ProfileDto>().ReverseMap();

        }
    }
}
