using AutoMapper;
using BCrypt.Net;
using Core.Entities;
using DAL;
using DAL.Config;
using DAL.IRepository;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NuGet.Protocol.Plugins;
using Service.DTO;
using Service.IService;
using Service.Models;
//using Service.Modeles;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Reflection;
using System.Runtime.CompilerServices;
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
        //private readonly IHttpClientFactory _httpClientFactory;
        //private readonly ServeurSetting _options;






        public UtilisateurService(IRepositoryAsync<Utilisateur> UtilisateurRepository,
             IRepositoryAsync<Role> roleRepository,
             IRepositoryAsync<Core.Entities.Profile> profileRepository,
             IRepositoryAsync<Menu> menuRepository,
             IServiceAsync<Utilisateur, UtilisateurDto> srvUtilisateur,
             IAuthService _authService,
             IMapper mapper)
            : base(UtilisateurRepository, mapper)
        {

            this.UtilisateurRepository = UtilisateurRepository;
            RoleRepository = roleRepository;
            ProfileRepository = profileRepository;
            MenuRepository = menuRepository;
            this.srvUtilisateur = srvUtilisateur;
            authService = _authService;
            this.mapper = mapper;



        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        private async Task<UtilisateurDto?> GetUserByUsername(string username)
        {
            var usr = await srvUtilisateur.GetFirstOrDefault(
                predicate: (i => i.Username == username),
                include:(p => p.Include(s => s.IdroleNavigation)),
                disableTracking: true
                );

            return usr;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="login"></param>
        /// <returns></returns>
        public async Task<ResponseLogin?> Islogin(Login login, CancellationToken ct = default)
        {
            bool valid;

            ResponseLogin responseLogin = new ResponseLogin();

            var usr = await GetUserByUsername(login.Username);
            if (usr != null)
            {
                valid = BCrypt.Net.BCrypt.Verify(login.Password, usr.Motpass);
                if (valid)
                {
                    var tkn = authService.GenerateAccessToken(usr);
                    
                    //var Serveur = _options.Serveur!;
                    //var client = _httpClientFactory.CreateClient();
                    //client.BaseAddress = new Uri(Serveur);
                    //client.DefaultRequestHeaders.Add("Accept", "application/json");
                    //client.Timeout = TimeSpan.FromMinutes(2);


                    //var response = await client.PostAsJsonAsync("/Auth/GenToken", usr, ct);

                    //if (!response.IsSuccessStatusCode)
                    //    return null;

                    //ResponseLogin? tkn = await response.Content.ReadFromJsonAsync<ResponseLogin?>(cancellationToken: ct);



                    responseLogin = new ResponseLogin
                    {
                       AccessToken = tkn.AccessToken,
                       Iduser = usr.Iduser,
                       Nom = usr.Nom,
                       Email = usr.Email,
                       Idrole = usr.Idrole,
                       TokenType = "Bearer",
                       ExpireIn = tkn.ExpireIn,
                    };
                    
                    

                }
                return responseLogin;
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> ChangePassword(int iduser, ChangePasswordDto changePassword)
        {
            if (string.IsNullOrWhiteSpace(changePassword.NewPassword))
            {
                return false;
            }

            var usr = await srvUtilisateur.GetById(iduser);
            if (usr == null)
            {
                return false;
            }

            var valid = BCrypt.Net.BCrypt.Verify(changePassword.CurrentPassword, usr.Motpass);
            if (!valid)
            {
                return false;
            }

            usr.Motpass = BCrypt.Net.BCrypt.HashPassword(changePassword.NewPassword);
            await srvUtilisateur.UpdateDetachedAsync(usr);
            return true;
        }

        public async Task<bool> Logout(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return false;
            }

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
            {
                return null;
            }

            if (role.Idprofile.HasValue)
            {
                var profileExists = await ProfileRepository.Exists(p => p.Idprofil == role.Idprofile.Value);
                if (!profileExists)
                {
                    return null;
                }
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
                {
                    entity.Idmenus.Add(menu);
                }
            }

            await RoleRepository.Add(entity);

            var created = await RoleRepository.GetFirstOrDefault(
                predicate: r => r.Idrole == entity.Idrole,
                include: q => q.Include(r => r.IdprofileNavigation).Include(r => r.Idmenus));

            return created == null ? null : MapRole(created);
        }

        public async Task<bool> UpdateRole(int idrole, RolesDto role)
        {
            var db = RoleRepository.DbContextCMC();
            var existing = await db.Roles
                .Include(r => r.Idmenus)
                .FirstOrDefaultAsync(r => r.Idrole == idrole);

            if (existing == null)
            {
                return false;
            }

            if (role.Idprofile.HasValue)
            {
                var profileExists = await ProfileRepository.Exists(p => p.Idprofil == role.Idprofile.Value);
                if (!profileExists)
                {
                    return false;
                }
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
                    {
                        existing.Idmenus.Add(menu);
                    }
                }
            }

            await RoleRepository.Update(existing);
            return true;
        }

        public async Task<bool> DeleteRole(int idrole)
        {
            var exists = await RoleRepository.Exists(r => r.Idrole == idrole);
            if (!exists)
            {
                return false;
            }

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
            {
                return null;
            }

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
            {
                return false;
            }

            existing.Nom = profile.Nom;
            existing.Description = profile.Description;
            await ProfileRepository.Update(existing);
            return true;
        }

        public async Task<bool> DeleteProfile(int idprofil)
        {
            var exists = await ProfileRepository.Exists(p => p.Idprofil == idprofil);
            if (!exists)
            {
                return false;
            }

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
            {
                return null;
            }

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
            {
                return false;
            }

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
            {
                return false;
            }

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
            {
                return false;
            }

            var ids = menuIds?.Distinct().ToList() ?? new List<int>();
            var menus = await db.Menus.Where(m => ids.Contains(m.Idmenu)).ToListAsync();
            if (ids.Count != menus.Count)
            {
                return false;
            }

            role.Idmenus.Clear();
            foreach (var menu in menus)
            {
                role.Idmenus.Add(menu);
            }

            await RoleRepository.Update(role);
            return true;
        }

        public async Task<IEnumerable<MenuDto>> GetMenusByRole(int idrole)
        {
            var role = await RoleRepository.GetFirstOrDefault(
                predicate: r => r.Idrole == idrole,
                include: q => q.Include(r => r.Idmenus));

            if (role == null)
            {
                return Enumerable.Empty<MenuDto>();
            }

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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Utilisateur"></param>
        /// <returns></returns>
        public async Task<bool> AddUtilisateur(UtilisateurDto Utilisateur)
        {
            var usr = await GetUserByEmail(Utilisateur.Email);
            if (usr == null)
            {
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(Utilisateur.Motpass);
                Utilisateur.Motpass = passwordHash;
                await srvUtilisateur.Add(Utilisateur);
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public async Task<UtilisateurDto> GetUserByEmail(string email)
        {
            var usr = await srvUtilisateur.GetFirstOrDefault(
                predicate: (i => i.Email == email),
                disableTracking: true
                );
            return usr;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Utilisateur"></param>
        /// <returns></returns>
        public async Task<bool> UpdUtilisateur(UtilisateurDto utilisateur)
        {
            var usr = await srvUtilisateur.GetById(utilisateur.Iduser);
            if (usr != null)
            {
                if (!String.IsNullOrEmpty(usr.Motpass))
                {
                    bool valid = BCrypt.Net.BCrypt.Verify(utilisateur.Motpass, usr.Motpass);
                    if (!valid)
                    {
                        string passwordHash = BCrypt.Net.BCrypt.HashPassword(utilisateur.Motpass);
                        utilisateur.Motpass = passwordHash;
                    }
                }

                await srvUtilisateur.UpdateDetachedAsync(utilisateur);
                
                return true;
            }
            else
            {
                return false;
            }
        }

        
    }
}