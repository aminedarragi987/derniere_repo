using AutoMapper;
using BCrypt.Net;
using Core.Entities;
using DAL;
using DAL.Config;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using NuGet.Protocol.Plugins;
using Service.DTO;
using Service.IService;
using Service.Models;
//using Service.Modeles;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;


namespace Service.Service
{
    public class AuthService : ServiceAsync<Refreshtoken, RefreshtokenDto>, IAuthService
    {

        private readonly IRepositoryAsync<Refreshtoken> RefreshtokenRepository;
        private readonly IServiceAsync<Refreshtoken, RefreshtokenDto> srvRefreshtoken;
        private readonly IMapper mapper;
        private readonly IConfiguration _config;
        private readonly SymmetricSecurityKey _key;
        private readonly JwtSettings _settings;






        public AuthService(IRepositoryAsync<Refreshtoken> RefreshtokenRepository,
             IServiceAsync<Refreshtoken, RefreshtokenDto> srvRefreshtoken,
             IConfiguration config,
             JwtSettings settings,
             IMapper mapper)
            : base(RefreshtokenRepository, mapper)
        {
            this.RefreshtokenRepository = RefreshtokenRepository;
            this.srvRefreshtoken = srvRefreshtoken;
            _config = config;
            _settings = settings;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
            this.mapper = mapper;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
         
        public AccessTkn GenerateAccessToken(UtilisateurDto user)
        {
            var accessTkn = new AccessTkn();

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Iduser.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new("role", user.IdroleNavigation.Nom),
                new("uid", user.Iduser.ToString())
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);
            var now = DateTime.UtcNow;
            var expires = now.AddMinutes(_settings.LifetimeMinutes);


            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                notBefore: now,
                expires: expires,
                signingCredentials: creds
            );

            accessTkn=new AccessTkn 
            {
                AccessToken= new JwtSecurityTokenHandler().WriteToken(token),
                ExpireIn = _settings.LifetimeMinutes * 60
            };

            return accessTkn;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="size"></param>
        /// <returns></returns>
        
        public string GenerateSecureRefreshToken(int size = 64)
        {
            var bytes = RandomNumberGenerator.GetBytes(size);
            return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
      
        public async Task InvalidateRefreshTokenAsync(string token)
        {

            var rt = await srvRefreshtoken.GetFirstOrDefault(
                   predicate: (i => i.Token==token),
                   disableTracking:true
                ); 
                
            if (rt != null)
            {
                rt.Revoked = true;
                await srvRefreshtoken.Save();
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <param name="validityDays"></param>
        /// <returns></returns>
        public async Task<RefreshtokenDto> IssueRefreshTokenAsync(UtilisateurDto user, int validityDays)
        {

            var token = new RefreshtokenDto
            {
                Token = GenerateSecureRefreshToken(),
                Expiresatutc = DateTime.UtcNow.AddDays(validityDays),
                Iduser = user.Iduser
            };
            await srvRefreshtoken.Add(token);
            return token;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public ClaimsPrincipal? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            try
            {
                return tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = _settings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _settings.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = _key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30)
                }, out _);
            }
            catch
            {
                return null;
            }
        }
    }
}