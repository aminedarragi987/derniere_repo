using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;

namespace Facturation.API.Controllers;

[Route("Facture")]
[Authorize(Roles = "Comptable,Administrateur")]
[ApiController]
public class FacturationController : ControllerBase
{
    private readonly IFacturationService _service;

    public FacturationController(IFacturationService service)
    {
        _service = service;
    }

    [HttpPost("Commande/{id:int}")]
    public async Task<IActionResult> Generer(int id)
    {
        var res = await _service.GenererFacture(id);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost("{id:int}/Paiement")]
    public async Task<IActionResult> Paiement(int id, PaiementCreateDto dto)
    {
        var res = await _service.AddPaiement(id, dto);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpPost("{id:int}/Carte")]
    public async Task<IActionResult> PaiementCarte(int id, CardPaymentDto dto)
    {
        var res = await _service.ProcessCardPayment(id, dto);
        return res == null ? NotFound() : Ok(res);
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] FactureFilterDto filter)
        => Ok(await _service.GetFactures(filter));
}