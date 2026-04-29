using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.IService;
using Service.Service;

namespace Livraison.API.Controllers;

[Route("Livraison")]
[Authorize(Roles = "Gestionnaire,Administrateur")]
[ApiController]
public class LivraisonController : ControllerBase
{
    private readonly ILivraisonService _service;

    public LivraisonController(ILivraisonService service)
    {
        _service = service;
    }

    [HttpPost("Commande/{id:int}")]
    public async Task<IActionResult> Generer(int id)
    {
        var res = await _service.GenererLivraison(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var res = await _service.GetLivraison(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost("{id:int}/Comptabilite")]
    public async Task<IActionResult> Export(int id)
    {
        var res = await _service.EnvoyerComptabilite(id);
        return res == null ? NotFound() : Ok(res);
    }
}