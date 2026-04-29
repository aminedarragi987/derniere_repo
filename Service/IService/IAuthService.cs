using Core.Entities;
using Service.DTO;
using Service.Models;
using System.Security.Claims;

namespace Service.IService;

public interface IAuthService : IServiceAsync<Refreshtoken, RefreshtokenDto>
{
    AccessTkn GenerateAccessToken(UtilisateurDto user);

    string GenerateSecureRefreshToken(int size = 64);

    Task<RefreshtokenDto> IssueRefreshTokenAsync(UtilisateurDto user, int validityDays);

    Task InvalidateRefreshTokenAsync(string token);

    ClaimsPrincipal? ValidateToken(string token);
}