using Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
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
        //Task<bool> delUtilisateur(UtilisateurDto Utilisateur);



    }
}
