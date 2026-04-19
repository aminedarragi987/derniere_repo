using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;

namespace Client.API.Controllers;

[Produces("application/json")]
[Route("Client")]
[EnableCors("CORSPolicy")]
[Authorize(Roles = "Gestionnaire")]
[ApiController]
public class ClientController : ControllerBase
{
    private readonly IGestionStockService _gestionStockService;

    public ClientController(IGestionStockService gestionStockService)
    {
        _gestionStockService = gestionStockService;
    }

    [HttpPost]
    public async Task<IActionResult> AjouterClient([FromBody] ClientCreateDto client)
    {
        var created = await _gestionStockService.AddClient(client);
        return Ok(created);
    }

    [HttpPut("{idclient:int}")]
    public async Task<IActionResult> ModifierClient(int idclient, [FromBody] ClientUpdateDto client)
    {
        var updated = await _gestionStockService.UpdateClient(idclient, client);
        if (!updated)
        {
            return NotFound(new { Message = "Client introuvable." });
        }

        return Ok(new { Message = "Client mis à jour." });
    }

    [HttpGet]
    public async Task<IActionResult> GetClients()
    {
        var clients = await _gestionStockService.GetClients();
        return Ok(clients);
    }

    [HttpDelete("{idclient:int}")]
    public async Task<IActionResult> SupprimerClient(int idclient)
    {
        var deleted = await _gestionStockService.DeleteClient(idclient);
        if (!deleted)
        {
            return NotFound(new { Message = "Client introuvable." });
        }

        return Ok(new { Message = "Client supprimé." });
    }
}