using Core.Entities;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using Service.DTO;
using Service.IService;

namespace Service.Service;

public class CommandeService : ICommandeService
{
    private readonly IRepositoryAsync<Commande> _commandeRepository;
    private readonly IRepositoryAsync<LigneCommande> _ligneRepository;
    private readonly IRepositoryAsync<Article> _articleRepository;
    private readonly IRepositoryAsync<Client> _clientRepository;

    public CommandeService(
        IRepositoryAsync<Commande> commandeRepository,
        IRepositoryAsync<LigneCommande> ligneRepository,
        IRepositoryAsync<Article> articleRepository,
        IRepositoryAsync<Client> clientRepository)
    {
        _commandeRepository = commandeRepository;
        _ligneRepository = ligneRepository;
        _articleRepository = articleRepository;
        _clientRepository = clientRepository;
    }

    public async Task<CommandeDto?> CreateCommande(CommandeCreateDto dto)
    {
        if (!await _clientRepository.Exists(c => c.Idclient == dto.Idclient))
            return null;

        var commande = new Commande
        {
            Idclient = dto.Idclient,
            Datecommande = DateTime.UtcNow,
            Statut = "Brouillon",
            Totalcommande = 0
        };

        await _commandeRepository.Add(commande);

        return new CommandeDto
        {
            Idcommande = commande.Idcommande,
            Idclient = commande.Idclient,
            Datecommande = commande.Datecommande,
            Totalcommande = commande.Totalcommande,
            Statut = commande.Statut
        };
    }

    public async Task<CommandeDto?> AddLigneCommande(int id, LigneCommandeDto dto)
    {
        var commande = await _commandeRepository.GetById(id);
        if (commande == null) return null;

        var article = await _articleRepository.GetById(dto.Idarticle);
        if (article == null)
            throw new InvalidOperationException("Article introuvable");

        var ligne = new LigneCommande
        {
            Idcommande = id,
            Idarticle = dto.Idarticle,
            Quantite = dto.Quantite,
            Prixunitaire = article.Prix,
            Montantligne = dto.Quantite * article.Prix
        };

        await _ligneRepository.Add(ligne);

        commande.Totalcommande += ligne.Montantligne;
        commande.Statut = "En cours";

        await _commandeRepository.Update(commande);

        return new CommandeDto
        {
            Idcommande = commande.Idcommande,
            Idclient = commande.Idclient,
            Datecommande = commande.Datecommande,
            Totalcommande = commande.Totalcommande,
            Statut = commande.Statut
        };
    }

    public async Task<CommandeDto?> ValiderCommande(int id)
    {
        var commande = await _commandeRepository.GetById(id);
        if (commande == null) return null;

        if (commande.Totalcommande <= 0)
            throw new InvalidOperationException("Commande vide");

        commande.Statut = "Validée";
        await _commandeRepository.Update(commande);

        return new CommandeDto
        {
            Idcommande = commande.Idcommande,
            Idclient = commande.Idclient,
            Datecommande = commande.Datecommande,
            Totalcommande = commande.Totalcommande,
            Statut = commande.Statut
        };
    }

    public async Task<List<CommandeDto>> GetCommandes(CommandeFilterDto filter)
    {
        var query = _commandeRepository.GetAll().AsQueryable();

        if (filter.Idcommande.HasValue)
            query = query.Where(c => c.Idcommande == filter.Idcommande);

        var list = await query.ToListAsync();

        return list.Select(c => new CommandeDto
        {
            Idcommande = c.Idcommande,
            Idclient = c.Idclient,
            Datecommande = c.Datecommande,
            Totalcommande = c.Totalcommande,
            Statut = c.Statut
        }).ToList();
    }

    public async Task<CommandeStatusDto?> GetCommandeStatus(int id)
    {
        var commande = await _commandeRepository.GetById(id);
        if (commande == null) return null;

        return new CommandeStatusDto
        {
            Idcommande = commande.Idcommande,
            Statut = commande.Statut
        };
    }

    public async Task<bool> DeleteCommande(int id)
    {
        if (!await _commandeRepository.Exists(c => c.Idcommande == id))
            return false;

        await _commandeRepository.Delete(id);
        return true;
    }
}