using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;

namespace Facturation.API.Controllers;

[Produces("application/json")]
[Route("Facture")]
[EnableCors("CORSPolicy")]
[Authorize(Roles = "Comptable")]
[ApiController]
public class FacturationController : ControllerBase
{
    private readonly IGestionStockService _gestionStockService;

    public FacturationController(IGestionStockService gestionStockService)
    {
        _gestionStockService = gestionStockService;
    }

    [HttpPost("Commande/{idcommande:int}")]
    public async Task<IActionResult> GenererFacture(int idcommande)
    {
        var facture = await _gestionStockService.GenererFacture(idcommande);
        if (facture == null)
        {
            return NotFound(new { Message = "Commande introuvable." });
        }

        return Ok(facture);
    }

    [HttpPost("{idfacture:int}/Paiement")]
    public async Task<IActionResult> AjouterPaiement(int idfacture, [FromBody] PaiementCreateDto paiement)
    {
        try
        {
            var created = await _gestionStockService.AddPaiement(idfacture, paiement);
            if (created == null)
            {
                return NotFound(new { Message = "Facture introuvable." });
            }

            return Ok(created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("{idfacture:int}/Paiement/Carte")]
    public async Task<IActionResult> PayerParCarte(int idfacture, [FromBody] CardPaymentDto paiementCarte)
    {
        try
        {
            var created = await _gestionStockService.ProcessCardPayment(idfacture, paiementCarte);
            if (created == null)
            {
                return NotFound(new { Message = "Facture introuvable." });
            }

            return Ok(created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetFactures([FromQuery] FactureFilterDto filter)
    {
        var factures = await _gestionStockService.GetFactures(filter);
        return Ok(factures);
    }
}