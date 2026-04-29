using AutoMapper;
using BCrypt.Net;
using Core.Entities;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using Service.DTO;
using Service.IService;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Service.Service
{
    public class UtilisateurService : ServiceAsync<Utilisateur, UtilisateurDto>, IUtilisateurService
    {
        private readonly IRepositoryAsync<Utilisateur> UtilisateurRepository;
        private readonly IRepositoryAsync<Role> RoleRepository;
        private readonly IRepositoryAsync<Core.Entities.Profile> ProfileRepository;
        private readonly IRepositoryAsync<Menu> MenuRepository;
        private readonly IServiceAsync<Utilisateur, UtilisateurDto> srvUtilisateur;
        private readonly IMapper mapper;
        private readonly IAuthService authService;

        public UtilisateurService(
            IRepositoryAsync<Utilisateur> utilisateurRepository,
            IRepositoryAsync<Role> roleRepository,
            IRepositoryAsync<Core.Entities.Profile> profileRepository,
            IRepositoryAsync<Menu> menuRepository,
            IServiceAsync<Utilisateur, UtilisateurDto> srvUtilisateur,
            IAuthService authService,
            IMapper mapper)
            : base(utilisateurRepository, mapper)
        {
            UtilisateurRepository = utilisateurRepository;
            RoleRepository = roleRepository;
            ProfileRepository = profileRepository;
            MenuRepository = menuRepository;
            this.srvUtilisateur = srvUtilisateur;
            this.authService = authService;
            this.mapper = mapper;
        }

        private async Task<UtilisateurDto?> GetUserByUsername(string username)
        {
            return await srvUtilisateur.GetFirstOrDefault(
                predicate: u => u.Username == username,
                include: q => q.Include(x => x.IdroleNavigation),
                disableTracking: true
            );
        }

        public async Task<UtilisateurDto?> GetUserByEmail(string email)
        {
            return await srvUtilisateur.GetFirstOrDefault(
                predicate: u => u.Email == email,
                disableTracking: true
            );
        }

        public async Task<ResponseLogin?> Islogin(Login login, CancellationToken ct = default)
        {
            var usr = await GetUserByUsername(login.Username);

            if (usr == null)
                return null;

            bool valid = BCrypt.Net.BCrypt.Verify(login.Password, usr.Motpass);

            if (!valid)
                return null;

            var tkn = authService.GenerateAccessToken(usr);
            var refreshToken = await authService.IssueRefreshTokenAsync(usr, 7);

            return new ResponseLogin
            {
                AccessToken = tkn.AccessToken,
                RefreshToken = refreshToken.Token,
                Iduser = usr.Iduser,
                Nom = usr.Nom,
                Email = usr.Email,
                Idrole = usr.Idrole,
                TokenType = "Bearer",
                ExpireIn = tkn.ExpireIn
            };
        }

        public async Task<bool> AddUtilisateur(UtilisateurDto utilisateur)
        {
            var usr = await GetUserByEmail(utilisateur.Email);

            if (usr != null)
                return false;

            utilisateur.Motpass = BCrypt.Net.BCrypt.HashPassword(utilisateur.Motpass);
            await srvUtilisateur.Add(utilisateur);

            return true;
        }

        public async Task<bool> UpdUtilisateur(UtilisateurDto utilisateur)
        {
            var usr = await srvUtilisateur.GetById(utilisateur.Iduser);

            if (usr == null)
                return false;

            if (!string.IsNullOrWhiteSpace(utilisateur.Motpass) &&
                !BCrypt.Net.BCrypt.Verify(utilisateur.Motpass, usr.Motpass))
            {
                utilisateur.Motpass = BCrypt.Net.BCrypt.HashPassword(utilisateur.Motpass);
            }
            else
            {
                utilisateur.Motpass = usr.Motpass;
            }

            await srvUtilisateur.UpdateDetachedAsync(utilisateur);
            return true;
        }

        public async Task<bool> ChangePassword(int iduser, ChangePasswordDto changePassword)
        {
            if (string.IsNullOrWhiteSpace(changePassword.NewPassword))
                return false;

            var usr = await srvUtilisateur.GetById(iduser);

            if (usr == null)
                return false;

            bool valid = BCrypt.Net.BCrypt.Verify(changePassword.CurrentPassword, usr.Motpass);

            if (!valid)
                return false;

            usr.Motpass = BCrypt.Net.BCrypt.HashPassword(changePassword.NewPassword);
            await srvUtilisateur.UpdateDetachedAsync(usr);

            return true;
        }

        public async Task<bool> Logout(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return false;

            await authService.InvalidateRefreshTokenAsync(refreshToken);
            return true;
        }

        public async Task<IEnumerable<RolesDto>> GetRoles()
        {
            var roles = await RoleRepository.GetMuliple(
                include: q => q
                    .Include(r => r.IdprofileNavigation)
                    .Include(r => r.Idmenus)
                    .Include(r => r.IdroleparentNavigation),
                orderBy: q => q.OrderBy(r => r.Nom));

            return roles.Select(MapRole).ToList();
        }

        public async Task<RolesDto?> AddRole(RolesDto role)
        {
            if (role == null)
                return null;

            if (role.Idprofile.HasValue)
            {
                var profileExists = await ProfileRepository.Exists(p => p.Idprofil == role.Idprofile.Value);
                if (!profileExists)
                    return null;
            }

            var entity = new Role
            {
                Nom = role.Nom,
                Description = role.Description,
                Idprofile = role.Idprofile,
                Idroleparent = role.Idroleparent
            };

            var menuIds = role.Idmenus?.Select(m => m.Idmenu).Distinct().ToList() ?? new List<int>();

            if (menuIds.Count != 0)
            {
                var db = RoleRepository.DbContextCMC();
                var menus = await db.Menus.Where(m => menuIds.Contains(m.Idmenu)).ToListAsync();

                foreach (var menu in menus)
                    entity.Idmenus.Add(menu);
            }

            await RoleRepository.Add(entity);

            var created = await RoleRepository.GetFirstOrDefault(
                predicate: r => r.Idrole == entity.Idrole,
                include: q => q.Include(r => r.IdprofileNavigation)
                               .Include(r => r.Idmenus));

            return created == null ? null : MapRole(created);
        }

        public async Task<bool> UpdateRole(int idrole, RolesDto role)
        {
            var db = RoleRepository.DbContextCMC();

            var existing = await db.Roles
                .Include(r => r.Idmenus)
                .FirstOrDefaultAsync(r => r.Idrole == idrole);

            if (existing == null)
                return false;

            if (role.Idprofile.HasValue)
            {
                var profileExists = await ProfileRepository.Exists(p => p.Idprofil == role.Idprofile.Value);
                if (!profileExists)
                    return false;
            }

            existing.Nom = role.Nom;
            existing.Description = role.Description;
            existing.Idprofile = role.Idprofile;
            existing.Idroleparent = role.Idroleparent;

            if (role.Idmenus != null)
            {
                existing.Idmenus.Clear();

                var menuIds = role.Idmenus.Select(m => m.Idmenu).Distinct().ToList();

                if (menuIds.Count != 0)
                {
                    var menus = await db.Menus.Where(m => menuIds.Contains(m.Idmenu)).ToListAsync();

                    foreach (var menu in menus)
                        existing.Idmenus.Add(menu);
                }
            }

            await RoleRepository.Update(existing);
            return true;
        }

        public async Task<bool> DeleteRole(int idrole)
        {
            var exists = await RoleRepository.Exists(r => r.Idrole == idrole);

            if (!exists)
                return false;

            await RoleRepository.Delete(idrole);
            return true;
        }

        public async Task<IEnumerable<ProfileDto>> GetProfiles()
        {
            var profiles = await ProfileRepository.GetMuliple(orderBy: q => q.OrderBy(p => p.Nom));
            return profiles.Select(MapProfile).ToList();
        }

        public async Task<ProfileDto?> AddProfile(ProfileDto profile)
        {
            if (profile == null)
                return null;

            var entity = new Core.Entities.Profile
            {
                Nom = profile.Nom,
                Description = profile.Description
            };

            await ProfileRepository.Add(entity);
            return MapProfile(entity);
        }

        public async Task<bool> UpdateProfile(int idprofil, ProfileDto profile)
        {
            var existing = await ProfileRepository.GetById(idprofil);

            if (existing == null)
                return false;

            existing.Nom = profile.Nom;
            existing.Description = profile.Description;

            await ProfileRepository.Update(existing);
            return true;
        }

        public async Task<bool> DeleteProfile(int idprofil)
        {
            var exists = await ProfileRepository.Exists(p => p.Idprofil == idprofil);

            if (!exists)
                return false;

            await ProfileRepository.Delete(idprofil);
            return true;
        }

        public async Task<IEnumerable<MenuDto>> GetMenus()
        {
            var menus = await MenuRepository.GetMuliple(orderBy: q => q.OrderBy(m => m.Titre));
            return menus.Select(MapMenu).ToList();
        }

        public async Task<MenuDto?> AddMenu(MenuDto menu)
        {
            if (menu == null)
                return null;

            var entity = new Menu
            {
                Titre = menu.Titre,
                Description = menu.Description,
                MemRouterlink = menu.MemRouterlink,
                MemHref = menu.MemHref,
                MemIcon = menu.MemIcon,
                MemTarget = menu.MemTarget,
                Hassubmenu = menu.Hassubmenu,
                Parentid = menu.Parentid
            };

            await MenuRepository.Add(entity);
            return MapMenu(entity);
        }

        public async Task<bool> UpdateMenu(int idmenu, MenuDto menu)
        {
            var existing = await MenuRepository.GetById(idmenu);

            if (existing == null)
                return false;

            existing.Titre = menu.Titre;
            existing.Description = menu.Description;
            existing.MemRouterlink = menu.MemRouterlink;
            existing.MemHref = menu.MemHref;
            existing.MemIcon = menu.MemIcon;
            existing.MemTarget = menu.MemTarget;
            existing.Hassubmenu = menu.Hassubmenu;
            existing.Parentid = menu.Parentid;

            await MenuRepository.Update(existing);
            return true;
        }

        public async Task<bool> DeleteMenu(int idmenu)
        {
            var exists = await MenuRepository.Exists(m => m.Idmenu == idmenu);

            if (!exists)
                return false;

            await MenuRepository.Delete(idmenu);
            return true;
        }

        public async Task<bool> AssignMenusToRole(int idrole, IEnumerable<int> menuIds)
        {
            var db = RoleRepository.DbContextCMC();

            var role = await db.Roles
                .Include(r => r.Idmenus)
                .FirstOrDefaultAsync(r => r.Idrole == idrole);

            if (role == null)
                return false;

            var ids = menuIds?.Distinct().ToList() ?? new List<int>();
            var menus = await db.Menus.Where(m => ids.Contains(m.Idmenu)).ToListAsync();

            if (ids.Count != menus.Count)
                return false;

            role.Idmenus.Clear();

            foreach (var menu in menus)
                role.Idmenus.Add(menu);

            await RoleRepository.Update(role);
            return true;
        }

        public async Task<IEnumerable<MenuDto>> GetMenusByRole(int idrole)
        {
            var role = await RoleRepository.GetFirstOrDefault(
                predicate: r => r.Idrole == idrole,
                include: q => q.Include(r => r.Idmenus));

            if (role == null)
                return Enumerable.Empty<MenuDto>();

            return role.Idmenus.Select(MapMenu).OrderBy(m => m.Titre).ToList();
        }

        private static RolesDto MapRole(Role role)
        {
            return new RolesDto
            {
                Idrole = role.Idrole,
                Nom = role.Nom,
                Description = role.Description,
                Idprofile = role.Idprofile,
                Idroleparent = role.Idroleparent,
                IdprofileNavigation = role.IdprofileNavigation == null
                    ? null
                    : new ProfileDto
                    {
                        Idprofil = role.IdprofileNavigation.Idprofil,
                        Nom = role.IdprofileNavigation.Nom,
                        Description = role.IdprofileNavigation.Description
                    },
                Idmenus = role.Idmenus?.Select(MapMenu).ToList() ?? new List<MenuDto>()
            };
        }

        private static ProfileDto MapProfile(Core.Entities.Profile profile)
        {
            return new ProfileDto
            {
                Idprofil = profile.Idprofil,
                Nom = profile.Nom,
                Description = profile.Description
            };
        }

        private static MenuDto MapMenu(Menu menu)
        {
            return new MenuDto
            {
                Idmenu = menu.Idmenu,
                Titre = menu.Titre,
                Description = menu.Description,
                MemRouterlink = menu.MemRouterlink,
                MemHref = menu.MemHref,
                MemIcon = menu.MemIcon,
                MemTarget = menu.MemTarget,
                Hassubmenu = menu.Hassubmenu,
                Parentid = menu.Parentid
            };
        }
    }
}