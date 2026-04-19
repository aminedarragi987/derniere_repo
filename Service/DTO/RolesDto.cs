using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;


#nullable disable

namespace Service.DTO
{
    public partial class RolesDto : IMapFrom<Role>
    {
        public int Idrole { get; set; }

        public string Nom { get; set; }

        public string Description { get; set; }

        public int? Idprofile { get; set; }

        public int? Idroleparent { get; set; }

        public virtual ProfileDto IdprofileNavigation { get; set; }

        public virtual RolesDto IdroleparentNavigation { get; set; }

        public virtual ICollection<RolesDto> InverseIdroleparentNavigation { get; set; } = new List<RolesDto>();

        public virtual ICollection<UtilisateurDto> Utilisateurs { get; set; } = new List<UtilisateurDto>();

        public virtual ICollection<MenuDto> Idmenus { get; set; } = new List<MenuDto>();




        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<Role, RolesDto>().ReverseMap();

        }
    }
}
