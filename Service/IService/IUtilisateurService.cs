using Core.Entities;
using Microsoft.AspNetCore.Http;
using Service.DTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Service.IService
{
    public  interface IUtilisateurService : IServiceAsync<Utilisateur, UtilisateurDto>
    {
        //IQueryable<UtilisateurDto> GetUtilisateurs();
        //Task<UtilisateurDto> GetUtilisateur(int NumUtilisateur);

        Task<ResponseLogin?> Islogin(Login login, CancellationToken ct = default);

        /// Operation de MAJ        
        Task<bool> AddUtilisateur(UtilisateurDto Utilisateur);
        Task<bool> UpdUtilisateur(UtilisateurDto Utilisateur);
        Task<bool> ChangePassword(int iduser, ChangePasswordDto changePassword);
        Task<bool> Logout(string refreshToken);

        Task<IEnumerable<RolesDto>> GetRoles();
        Task<RolesDto?> AddRole(RolesDto role);
        Task<bool> UpdateRole(int idrole, RolesDto role);
        Task<bool> DeleteRole(int idrole);

        Task<IEnumerable<ProfileDto>> GetProfiles();
        Task<ProfileDto?> AddProfile(ProfileDto profile);
        Task<bool> UpdateProfile(int idprofil, ProfileDto profile);
        Task<bool> DeleteProfile(int idprofil);

        Task<IEnumerable<MenuDto>> GetMenus();
        Task<MenuDto?> AddMenu(MenuDto menu);
        Task<bool> UpdateMenu(int idmenu, MenuDto menu);
        Task<bool> DeleteMenu(int idmenu);
        Task<bool> AssignMenusToRole(int idrole, IEnumerable<int> menuIds);
        Task<IEnumerable<MenuDto>> GetMenusByRole(int idrole);
        //Task<bool> delUtilisateur(UtilisateurDto Utilisateur);



    }
}
