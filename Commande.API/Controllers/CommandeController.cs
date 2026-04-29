using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;

namespace Commande.API.Controllers;

[Route("Commande")]
// Autorise les deux rôles
[Authorize(Roles = "Administrateur,Gestionnaire")]

[ApiController]
public class CommandeController : ControllerBase
{
    private readonly ICommandeService _service;

    public CommandeController(ICommandeService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CommandeCreateDto dto)
    {
        var res = await _service.CreateCommande(dto);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost("{id:int}/Article")]
    public async Task<IActionResult> AddArticle(int id, LigneCommandeDto dto)
    {
        var res = await _service.AddLigneCommande(id, dto);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPatch("{id:int}/Valider")]
    public async Task<IActionResult> Valider(int id)
    {
        var res = await _service.ValiderCommande(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] CommandeFilterDto filter)
        => Ok(await _service.GetCommandes(filter));

    [HttpGet("{id:int}/Statut")]
    public async Task<IActionResult> Status(int id)
    {
        var res = await _service.GetCommandeStatus(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => (await _service.DeleteCommande(id)) ? Ok() : NotFound();
}