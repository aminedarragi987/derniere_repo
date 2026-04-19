using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;

namespace Auth.API.Controllers
{
    [Produces("application/json")]
    [Route("Auth")]
    [EnableCors("CORSPolicy")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>

        [HttpPost("GenToken")]
        public IActionResult Generate([FromBody] UtilisateurDto user)
        {
            var token = _authService.GenerateAccessToken(user);
            return Ok(new { token });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>

        [HttpPost("ValidateToken")]
        public IActionResult Validate([FromBody] string token)
        {
            var principal = _authService.ValidateToken(token);

            if (principal == null)
                return Unauthorized();

            var claims = principal.Claims.Select(c => new { c.Type, c.Value });
            return Ok(new { valid = true, claims });
        }
    }
}

