using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;


#nullable disable

namespace Service.DTO
{
    public partial class UtilisateurDto : IMapFrom<Utilisateur>
    {
        public int Iduser { get; set; }

        public string Nom { get; set; }

        public string Username { get; set; }

        public string Motpass { get; set; }

        public string Email { get; set; }

        public string Telephone { get; set; }

        public int? Idrole { get; set; }

        public virtual RolesDto IdroleNavigation { get; set; }
        public virtual ICollection<RefreshtokenDto> Refreshtokens { get; set; } = new List<RefreshtokenDto>();




        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<Utilisateur, UtilisateurDto>().ReverseMap();

        }
    }
}
