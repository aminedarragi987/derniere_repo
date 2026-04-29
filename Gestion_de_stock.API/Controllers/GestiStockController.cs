using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;

namespace Gestion_de_stock.API.Controllers;

[ApiController]
[Route("Stock")]
[EnableCors("CORSPolicy")]
[Authorize(Roles = "Gestionnaire,Administrateur")]
public class GestionStockController : ControllerBase
{
    private readonly IStockService _service;

    public GestionStockController(IStockService service)
    {
        _service = service;
    }

    // ================= ARTICLES =================

    [HttpPost("Article")]
    public async Task<IActionResult> AddArticle(ArticleDto dto)
        => Ok(await _service.AddArticle(dto));

    [HttpPut("Article/{id:int}")]
    public async Task<IActionResult> UpdateArticle(int id, ArticleDto dto)
        => (await _service.UpdateArticle(id, dto)) ? Ok() : NotFound();

    [HttpDelete("Article/{id:int}")]
    public async Task<IActionResult> DeleteArticle(int id)
        => (await _service.DeleteArticle(id)) ? Ok() : NotFound();

    [HttpGet("Articles")]
    public async Task<IActionResult> GetArticles([FromQuery] ArticleFilterDto filter)
        => Ok(await _service.GetArticles(filter));

    [HttpGet("Article/{id:int}/Stock")]
    public async Task<IActionResult> GetStock(int id)
    {
        var res = await _service.GetStockNiveau(id);
        return res == null ? NotFound() : Ok(res);
    }

    // ================= FOURNISSEURS =================

    [HttpPost("Fournisseur")]
    public async Task<IActionResult> AddFournisseur(FournisseurDto dto)
        => Ok(await _service.AddFournisseur(dto));

    [HttpGet("Fournisseurs")]
    public async Task<IActionResult> GetFournisseurs()
        => Ok(await _service.GetFournisseurs());

    [HttpPut("Fournisseur/{id:int}")]
    public async Task<IActionResult> UpdateFournisseur(int id, FournisseurDto dto)
        => (await _service.UpdateFournisseur(id, dto)) ? Ok() : NotFound();

    [HttpDelete("Fournisseur/{id:int}")]
    public async Task<IActionResult> DeleteFournisseur(int id)
        => (await _service.DeleteFournisseur(id)) ? Ok() : NotFound();

    // ================= CATEGORIES =================

    [HttpPost("Categorie")]
    public async Task<IActionResult> AddCategorie(CategorieDto dto)
        => Ok(await _service.AddCategorie(dto));

    [HttpGet("Categories")]
    public async Task<IActionResult> GetCategories()
        => Ok(await _service.GetCategories());

    [HttpPut("Categorie/{id:int}")]
    public async Task<IActionResult> UpdateCategorie(int id, CategorieDto dto)
        => (await _service.UpdateCategorie(id, dto)) ? Ok() : NotFound();

    [HttpDelete("Categorie/{id:int}")]
    public async Task<IActionResult> DeleteCategorie(int id)
        => (await _service.DeleteCategorie(id)) ? Ok() : NotFound();

    // ================= DASHBOARD =================

    [HttpGet("Dashboard")]
    public async Task<IActionResult> Dashboard()
        => Ok(await _service.GetDashboard());

    // ================= DEBUG ROLE =================

    [HttpGet("debug-role")]
    [Authorize]
    public IActionResult DebugRole()
    {
        return Ok(User.Claims.Select(c => new
        {
            c.Type,
            c.Value
        }));
    }
}