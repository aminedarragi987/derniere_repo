using Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Service.DTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service.IService
{
    public  interface IAuthService : IServiceAsync<Refreshtoken, RefreshtokenDto>
    {
        AccessTkn GenerateAccessToken(UtilisateurDto user);
        string GenerateSecureRefreshToken(int size = 64);
        Task<RefreshtokenDto> IssueRefreshTokenAsync(UtilisateurDto user, int validityDays);
        Task InvalidateRefreshTokenAsync(string token);
        ClaimsPrincipal? ValidateToken(string token);
    }
}
