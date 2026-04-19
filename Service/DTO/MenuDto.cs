using AutoMapper;
using Core.Entities;
using Service.Common.Mappings;


#nullable disable

namespace Service.DTO
{
    public partial class MenuDto : IMapFrom<Menu>
    {
        public int Idmenu { get; set; }

        public string Titre { get; set; }

        public string Description { get; set; }

        public string MemRouterlink { get; set; }

        public string MemHref { get; set; }

        public string MemIcon { get; set; }

        public string MemTarget { get; set; }

        public bool? Hassubmenu { get; set; }

        public int? Parentid { get; set; }

        public virtual ICollection<MenuDto> InverseParent { get; set; } = new List<MenuDto>();

        public virtual MenuDto Parent { get; set; }

        public virtual ICollection<RolesDto> Idroles { get; set; } = new List<RolesDto>();



        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<Menu, MenuDto>().ReverseMap();

        }
    }
}
