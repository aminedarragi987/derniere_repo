using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;
using Service.Models;


namespace User.API.Controllers
{
    [Produces("application/json")]
    [Route("User")]
    [EnableCors("CORSPolicy")]
    [Authorize(Roles = "Administrateur")]
    [ApiController]
    public class UtilisateurController : ControllerBase
    {

        private readonly IUtilisateurService _service;
        private readonly Serilog.ILogger _logger;

        public UtilisateurController(IUtilisateurService service, Serilog.ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        [Route("Logout")]
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Logout([FromBody] RevokeRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.refreshToken))
            {
                return BadRequest(new { Message = "Refresh token invalide." });
            }

            var success = await _service.Logout(request.refreshToken);
            if (!success)
            {
                return BadRequest(new { Message = "Echec de déconnexion." });
            }

            return Ok(new { Message = "Déconnexion réussie." });
        }

        [Route("ChangePassword/{iduser:int}")]
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> ChangePassword(int iduser, [FromBody] ChangePasswordDto changePassword)
        {
            var updated = await _service.ChangePassword(iduser, changePassword);
            if (!updated)
            {
                return BadRequest(new { Message = "Echec changement mot de passe." });
            }

            return Ok(new { Message = "Mot de passe modifié." });
        }



        /// <summary>
        /// Islogin.
        /// </summary>
        /// <param name="login">Connection.</param>
        /// <returns></returns>
        [Route("IsLogin")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ResponseLogin?>> isLogin(Login login)
        {
            if (login == null || string.IsNullOrWhiteSpace(login.Username) || string.IsNullOrWhiteSpace(login.Password))
            {
                return BadRequest(new { Message = "Login invalide." });
            }

            Dictionary<string, string> dict = new Dictionary<string, string>();
            try
            {
                var usr = await _service.Islogin(login).ConfigureAwait(false);
                if (!String.IsNullOrEmpty(usr?.AccessToken)) 
                {
                    return new OkObjectResult(usr);
                }
                else
                {
                    dict.Add("Message", "Echec de connection");
                    return Unauthorized(dict);
                }
                
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Erreur Islogin");
                var showmessage = "Erreur" + ex.Message;
                dict.Add("Message", showmessage);
                return BadRequest(dict);
            }
        }

        /// <summary>
        /// Ajout Utilisateur
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [Route("AddUser")]
        [HttpPost]
        public async Task<ActionResult> Ajout(UtilisateurDto usr)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            try
            {
                var Ajt = await _service.AddUtilisateur(usr).ConfigureAwait(false);
                if (Ajt)
                {
                    dict.Add("Message", "Succée d'insertion");
                    return Ok(dict);
                }
                else
                {
                    dict.Add("Message", "Echec d'Insertion");
                    return NotFound (dict);
                }
                    
            }
            catch (Exception ex)
            {

                _logger.Error("Erreur Ajout Utilisateur <==> " + ex.ToString());
                var showmessage = "Erreur" + ex.Message;
                dict.Add("Message", showmessage);
                return BadRequest(dict);
            }
        }

        /// <summary>
        /// Modification Utilisateur
        /// </summary>
        /// <param name="usr"></param>
        /// <returns></returns>
        
        [Route("UpdUser")]
        [HttpPut]
        public async Task<ActionResult> Modif(UtilisateurDto usr)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            try
            {
                var Ajt = await _service.UpdUtilisateur(usr).ConfigureAwait(false);
                if (Ajt)
                {
                    dict.Add("Message", "Succée de MAJ");
                    return Ok(dict);
                }
                else
                {
                    dict.Add("Message", "Echec de MAJ");
                    return NotFound(dict);
                }

            }
            catch (Exception ex)
            {

                _logger.Error("Erreur Modification Utilisateur <==> " + ex.ToString());
                var showmessage = "Erreur" + ex.Message;
                dict.Add("Message", showmessage);
                return BadRequest(dict);
            }
        }


        /// <summary>
        /// Liste de tous les Utilisateurs
        /// </summary>
        /// <param name="usr"></param>
        /// <returns></returns>

        [Authorize]
        [Route("Users")]
        [HttpGet]
        public async Task<ActionResult<List<UtilisateurDto>>> GetAll()
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            try
            {
                var usrs = _service.GetAll();
                if(usrs.Count() != 0)
                {
                    return new OkObjectResult(usrs);
                }
                else
                {
                    dict.Add("Message", "Liste vide");
                    return NotFound(dict);
                }

            }
            catch (Exception ex)
            {

                _logger.Error("Erreur GetAll Utilisateur <==> " + ex.ToString());
                var showmessage = "Erreur" + ex.Message;
                dict.Add("Message", showmessage);
                return BadRequest(dict);
            }
        }

        [Route("Roles")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolesDto>>> GetRoles()
        {
            var roles = await _service.GetRoles();
            return Ok(roles);
        }

        [Route("Role")]
        [HttpPost]
        public async Task<ActionResult<RolesDto>> AddRole([FromBody] RolesDto role)
        {
            var created = await _service.AddRole(role);
            if (created == null)
            {
                return BadRequest(new { Message = "Données role invalides." });
            }

            return Ok(created);
        }

        [Route("Role/{idrole:int}")]
        [HttpPut]
        public async Task<ActionResult> UpdateRole(int idrole, [FromBody] RolesDto role)
        {
            var updated = await _service.UpdateRole(idrole, role);
            if (!updated)
            {
                return NotFound(new { Message = "Role introuvable ou données invalides." });
            }

            return Ok(new { Message = "Role mis à jour." });
        }

        [Route("Role/{idrole:int}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteRole(int idrole)
        {
            var deleted = await _service.DeleteRole(idrole);
            if (!deleted)
            {
                return NotFound(new { Message = "Role introuvable." });
            }

            return Ok(new { Message = "Role supprimé." });
        }

        [Route("Role/{idrole:int}/Menus")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetRoleMenus(int idrole)
        {
            var menus = await _service.GetMenusByRole(idrole);
            return Ok(menus);
        }

        [Route("Role/{idrole:int}/Menus")]
        [HttpPut]
        public async Task<ActionResult> AssignRoleMenus(int idrole, [FromBody] RoleMenuAssignDto request)
        {
            var updated = await _service.AssignMenusToRole(idrole, request?.MenuIds ?? new List<int>());
            if (!updated)
            {
                return NotFound(new { Message = "Role introuvable ou menus invalides." });
            }

            return Ok(new { Message = "Menus assignés au role." });
        }

        [Route("Profiles")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProfileDto>>> GetProfiles()
        {
            var profiles = await _service.GetProfiles();
            return Ok(profiles);
        }

        [Route("Profile")]
        [HttpPost]
        public async Task<ActionResult<ProfileDto>> AddProfile([FromBody] ProfileDto profile)
        {
            var created = await _service.AddProfile(profile);
            if (created == null)
            {
                return BadRequest(new { Message = "Données profile invalides." });
            }

            return Ok(created);
        }

        [Route("Profile/{idprofil:int}")]
        [HttpPut]
        public async Task<ActionResult> UpdateProfile(int idprofil, [FromBody] ProfileDto profile)
        {
            var updated = await _service.UpdateProfile(idprofil, profile);
            if (!updated)
            {
                return NotFound(new { Message = "Profile introuvable." });
            }

            return Ok(new { Message = "Profile mis à jour." });
        }

        [Route("Profile/{idprofil:int}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteProfile(int idprofil)
        {
            var deleted = await _service.DeleteProfile(idprofil);
            if (!deleted)
            {
                return NotFound(new { Message = "Profile introuvable." });
            }

            return Ok(new { Message = "Profile supprimé." });
        }

        [Route("Menus")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            var menus = await _service.GetMenus();
            return Ok(menus);
        }

        [Route("Menu")]
        [HttpPost]
        public async Task<ActionResult<MenuDto>> AddMenu([FromBody] MenuDto menu)
        {
            var created = await _service.AddMenu(menu);
            if (created == null)
            {
                return BadRequest(new { Message = "Données menu invalides." });
            }

            return Ok(created);
        }

        [Route("Menu/{idmenu:int}")]
        [HttpPut]
        public async Task<ActionResult> UpdateMenu(int idmenu, [FromBody] MenuDto menu)
        {
            var updated = await _service.UpdateMenu(idmenu, menu);
            if (!updated)
            {
                return NotFound(new { Message = "Menu introuvable." });
            }

            return Ok(new { Message = "Menu mis à jour." });
        }

        [Route("Menu/{idmenu:int}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteMenu(int idmenu)
        {
            var deleted = await _service.DeleteMenu(idmenu);
            if (!deleted)
            {
                return NotFound(new { Message = "Menu introuvable." });
            }

            return Ok(new { Message = "Menu supprimé." });
        }

    }
}
