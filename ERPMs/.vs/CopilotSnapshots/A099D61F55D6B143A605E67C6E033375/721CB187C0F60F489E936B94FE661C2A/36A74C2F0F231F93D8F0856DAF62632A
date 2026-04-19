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



        /// <summary>
        /// Islogin.
        /// </summary>
        /// <param name="login">Connection.</param>
        /// <returns></returns>
        [Route("IsLogin")]
        [HttpPost]
        public async Task<ActionResult<ResponseLogin?>> isLogin(Login login)
        {
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
                    return NotFound(dict);
                }
                
            }
            catch (Exception ex)
            {

                _logger.Error("Erreur  Islogin <==> " + ex.ToString());
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

    }
}
