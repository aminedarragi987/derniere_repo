using AutoMapper;
using Core.Entities;
using DAL.Config;
using DAL.IRepository;
using Microsoft.IdentityModel.Tokens;
using Service.DTO;
using Service.IService;
using Service.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Service.Service;

public class AuthService : ServiceAsync<Refreshtoken, RefreshtokenDto>, IAuthService
{
    private readonly IServiceAsync<Refreshtoken, RefreshtokenDto> _srvRefresh;
    private readonly JwtSettings _settings;
    private readonly SymmetricSecurityKey _key;

    public AuthService(
        IRepositoryAsync<Refreshtoken> repo,
        IServiceAsync<Refreshtoken, RefreshtokenDto> srvRefresh,
        JwtSettings settings,
        IMapper mapper)
        : base(repo, mapper)
    {
        _srvRefresh = srvRefresh;
        _settings = settings;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key));
    }

    // ================= ACCESS TOKEN =================

    public AccessTkn GenerateAccessToken(UtilisateurDto user)
    {
        var role = user.IdroleNavigation?.Nom ?? "";

        var claims = new List<Claim>
{
    new(ClaimTypes.NameIdentifier, user.Iduser.ToString()),
    new(ClaimTypes.Email, user.Email ?? ""),
    new(ClaimTypes.Role, role)
};

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_settings.LifetimeMinutes),
            signingCredentials: new SigningCredentials(_key, SecurityAlgorithms.HmacSha256)
        );

        return new AccessTkn
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
            ExpireIn = _settings.LifetimeMinutes * 60
        };
    }

    // ================= REFRESH TOKEN =================

    public string GenerateSecureRefreshToken(int size = 64)
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(size));

    public async Task<RefreshtokenDto> IssueRefreshTokenAsync(UtilisateurDto user, int validityDays)
    {
        var token = new RefreshtokenDto
        {
            Token = GenerateSecureRefreshToken(),
            Iduser = user.Iduser,
            Expiresatutc = DateTime.UtcNow.AddDays(validityDays)
        };

        await _srvRefresh.Add(token);
        return token;
    }

    public async Task InvalidateRefreshTokenAsync(string token)
    {
        var rt = await _srvRefresh.GetFirstOrDefault(x => x.Token == token);

        if (rt != null)
        {
            rt.Revoked = true;
            await _srvRefresh.Update(rt);
        }
    }

    // ================= VALIDATION JWT =================

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();

        try
        {
            return handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _settings.Issuer,

                ValidateAudience = true,
                ValidAudience = _settings.Audience,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _key,

                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromSeconds(30),

                // Use standard role claim type
                RoleClaimType = ClaimTypes.Role
            }, out _);
        }
        catch
        {
            return null;
        }
    }
}