using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Service.DTO;
using Service.IService;

namespace Gestion_de_stock.API.Controllers;

[Produces("application/json")]
[Route("Stock")]
[EnableCors("CORSPolicy")]
[Authorize]
[ApiController]
public class GestionStockController : ControllerBase
{
    private readonly IGestionStockService _gestionStockService;

    public GestionStockController(IGestionStockService gestionStockService)
    {
        _gestionStockService = gestionStockService;
    }

    [HttpPost("Article")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> AjouterArticle([FromBody] ArticleDto article)
    {
        var created = await _gestionStockService.AddArticle(article);
        return Ok(created);
    }

    [HttpPut("Article/{idarticle:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> ModifierArticle(int idarticle, [FromBody] ArticleDto article)
    {
        var updated = await _gestionStockService.UpdateArticle(idarticle, article);
        if (!updated)
        {
            return NotFound(new { Message = "Article introuvable." });
        }

        return Ok(new { Message = "Article mis à jour." });
    }

    [HttpDelete("Article/{idarticle:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> SupprimerArticle(int idarticle)
    {
        var deleted = await _gestionStockService.DeleteArticle(idarticle);
        if (!deleted)
        {
            return NotFound(new { Message = "Article introuvable." });
        }

        return Ok(new { Message = "Article supprimé." });
    }

    [HttpGet("Articles")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetArticles([FromQuery] ArticleFilterDto filter)
    {
        var articles = await _gestionStockService.GetArticles(filter);
        return Ok(articles);
    }

    [HttpGet("Article/{idarticle:int}/NiveauStock")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetNiveauStock(int idarticle)
    {
        var niveau = await _gestionStockService.GetStockNiveau(idarticle);
        if (niveau == null)
        {
            return NotFound(new { Message = "Article introuvable." });
        }

        return Ok(niveau);
    }

    [HttpPost("Article/{idarticle:int}/Fournisseur/{idfournisseur:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> AssocierFournisseur(int idarticle, int idfournisseur)
    {
        var linked = await _gestionStockService.AssocierFournisseur(idarticle, idfournisseur);
        if (!linked)
        {
            return NotFound(new { Message = "Article ou fournisseur introuvable." });
        }

        return Ok(new { Message = "Association créée." });
    }

    [HttpPost("Fournisseur")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> AjouterFournisseur([FromBody] FournisseurDto fournisseur)
    {
        var created = await _gestionStockService.AddFournisseur(fournisseur);
        return Ok(created);
    }

    [HttpPut("Fournisseur/{idfournisseur:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> ModifierFournisseur(int idfournisseur, [FromBody] FournisseurDto fournisseur)
    {
        var updated = await _gestionStockService.UpdateFournisseur(idfournisseur, fournisseur);
        if (!updated)
        {
            return NotFound(new { Message = "Fournisseur introuvable." });
        }

        return Ok(new { Message = "Fournisseur mis à jour." });
    }

    [HttpGet("Fournisseurs")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetFournisseurs()
    {
        var fournisseurs = await _gestionStockService.GetFournisseurs();
        return Ok(fournisseurs);
    }

    [HttpDelete("Fournisseur/{idfournisseur:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> SupprimerFournisseur(int idfournisseur)
    {
        var deleted = await _gestionStockService.DeleteFournisseur(idfournisseur);
        if (!deleted)
        {
            return NotFound(new { Message = "Fournisseur introuvable." });
        }

        return Ok(new { Message = "Fournisseur supprimé." });
    }

    [HttpPost("Categorie")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> AjouterCategorie([FromBody] CategorieDto categorie)
    {
        var created = await _gestionStockService.AddCategorie(categorie);
        return Ok(created);
    }

    [HttpPut("Categorie/{idcategorie:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> ModifierCategorie(int idcategorie, [FromBody] CategorieDto categorie)
    {
        var updated = await _gestionStockService.UpdateCategorie(idcategorie, categorie);
        if (!updated)
        {
            return NotFound(new { Message = "Catégorie introuvable." });
        }

        return Ok(new { Message = "Catégorie mise à jour." });
    }

    [HttpGet("Categories")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _gestionStockService.GetCategories();
        return Ok(categories);
    }

    [HttpDelete("Categorie/{idcategorie:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> SupprimerCategorie(int idcategorie)
    {
        try
        {
            var deleted = await _gestionStockService.DeleteCategorie(idcategorie);
            if (!deleted)
            {
                return NotFound(new { Message = "Catégorie introuvable." });
            }

            return Ok(new { Message = "Catégorie supprimée." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("Facture/{idfacture:int}/Paiement/Carte")]
    [Authorize(Roles = "Comptable")]
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

    [HttpGet("Dashboard")]
    [Authorize(Roles = "Gestionnaire,DirecteurGeneral")]
    public async Task<IActionResult> Dashboard()
    {
        var dashboard = await _gestionStockService.GetDashboard();
        return Ok(dashboard);
    }

    [HttpGet("Dashboard/Direction")]
    [Authorize(Roles = "DirecteurGeneral")]
    public async Task<IActionResult> DashboardDirection()
    {
        var dashboard = await _gestionStockService.GetDashboardDirection();
        return Ok(dashboard);
    }

    [HttpPost("Client")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> AjouterClient([FromBody] ClientCreateDto client)
    {
        var created = await _gestionStockService.AddClient(client);
        return Ok(created);
    }

    [HttpPut("Client/{idclient:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> ModifierClient(int idclient, [FromBody] ClientUpdateDto client)
    {
        var updated = await _gestionStockService.UpdateClient(idclient, client);
        if (!updated)
        {
            return NotFound(new { Message = "Client introuvable." });
        }

        return Ok(new { Message = "Client mis à jour." });
    }

    [HttpGet("Clients")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetClients()
    {
        var clients = await _gestionStockService.GetClients();
        return Ok(clients);
    }

    [HttpDelete("Client/{idclient:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> SupprimerClient(int idclient)
    {
        var deleted = await _gestionStockService.DeleteClient(idclient);
        if (!deleted)
        {
            return NotFound(new { Message = "Client introuvable." });
        }

        return Ok(new { Message = "Client supprimé." });
    }

    [HttpPost("Commande")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> CreerCommande([FromBody] CommandeCreateDto commande)
    {
        var created = await _gestionStockService.CreateCommande(commande);
        if (created == null)
        {
            return NotFound(new { Message = "Client introuvable." });
        }

        return Ok(created);
    }

    [HttpPost("Commande/{idcommande:int}/Article")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> AjouterArticleCommande(int idcommande, [FromBody] LigneCommandeDto ligne)
    {
        try
        {
            var updated = await _gestionStockService.AddLigneCommande(idcommande, ligne);
            if (updated == null)
            {
                return NotFound(new { Message = "Commande introuvable." });
            }

            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPatch("Commande/{idcommande:int}/Valider")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> ValiderCommande(int idcommande)
    {
        try
        {
            var updated = await _gestionStockService.ValiderCommande(idcommande);
            if (updated == null)
            {
                return NotFound(new { Message = "Commande introuvable." });
            }

            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("Commandes")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetCommandes([FromQuery] CommandeFilterDto filter)
    {
        var commandes = await _gestionStockService.GetCommandes(filter);
        return Ok(commandes);
    }

    [HttpGet("Commande/{idcommande:int}/Statut")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetStatutCommande(int idcommande)
    {
        var statut = await _gestionStockService.GetCommandeStatus(idcommande);
        if (statut == null)
        {
            return NotFound(new { Message = "Commande introuvable." });
        }

        return Ok(statut);
    }

    [HttpDelete("Commande/{idcommande:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> SupprimerCommande(int idcommande)
    {
        var deleted = await _gestionStockService.DeleteCommande(idcommande);
        if (!deleted)
        {
            return NotFound(new { Message = "Commande introuvable." });
        }

        return Ok(new { Message = "Commande supprimée." });
    }

    [HttpPost("Commande/{idcommande:int}/Facture")]
    [Authorize(Roles = "Comptable")]
    public async Task<IActionResult> GenererFacture(int idcommande)
    {
        var facture = await _gestionStockService.GenererFacture(idcommande);
        if (facture == null)
        {
            return NotFound(new { Message = "Commande introuvable." });
        }

        return Ok(facture);
    }

    [HttpPost("Facture/{idfacture:int}/Paiement")]
    [Authorize(Roles = "Comptable")]
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

    [HttpGet("Factures")]
    [Authorize(Roles = "Comptable")]
    public async Task<IActionResult> GetFactures([FromQuery] FactureFilterDto filter)
    {
        var factures = await _gestionStockService.GetFactures(filter);
        return Ok(factures);
    }

    [HttpPost("Commande/{idcommande:int}/Livraison")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GenererLivraison(int idcommande)
    {
        try
        {
            var livraison = await _gestionStockService.GenererLivraison(idcommande);
            if (livraison == null)
            {
                return NotFound(new { Message = "Commande introuvable." });
            }

            return Ok(livraison);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("Livraison/{idlivraison:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> GetLivraison(int idlivraison)
    {
        var livraison = await _gestionStockService.GetLivraison(idlivraison);
        if (livraison == null)
        {
            return NotFound(new { Message = "Livraison introuvable." });
        }

        return Ok(livraison);
    }

    [HttpPost("Livraison/{idlivraison:int}/Comptabilite")]
    [Authorize(Roles = "Gestionnaire")]
    public async Task<IActionResult> EnvoyerComptabilite(int idlivraison)
    {
        var export = await _gestionStockService.EnvoyerLivraisonComptabilite(idlivraison);
        if (export == null)
        {
            return NotFound(new { Message = "Livraison introuvable." });
        }

        return Ok(export);
    }
}
