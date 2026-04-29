using Core.Entities;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using Commande.Service.DTO;
using Commande.Service.IService;

namespace Commande.Service.Services;

public class CommandeService : ICommandeService
{
    private readonly IRepositoryAsync<Article> _articleRepository;
    private readonly IRepositoryAsync<Client> _clientRepository;
    private readonly IRepositoryAsync<Core.Entities.Commande> _commandeRepository;
    private readonly IRepositoryAsync<LigneCommande> _ligneCommandeRepository;

    public CommandeService(
        IRepositoryAsync<Article> articleRepository,
        IRepositoryAsync<Client> clientRepository,
        IRepositoryAsync<Core.Entities.Commande> commandeRepository,
        IRepositoryAsync<LigneCommande> ligneCommandeRepository)
    {
        _articleRepository = articleRepository;
        _clientRepository = clientRepository;
        _commandeRepository = commandeRepository;
        _ligneCommandeRepository = ligneCommandeRepository;
    }

    public async Task<CommandeDto?> CreateCommande(CommandeCreateDto commande)
    {
        var clientExists = await _clientRepository.Exists(c => c.Idclient == commande.Idclient);
        if (!clientExists)
        {
            return null;
        }

        var entity = new Core.Entities.Commande
        {
            Idclient = commande.Idclient,
            Datecommande = DateTime.UtcNow,
            Totalcommande = 0,
            Statut = "Brouillon"
        };

        await _commandeRepository.Add(entity);

        return new CommandeDto
        {
            Idcommande = entity.Idcommande,
            Idclient = entity.Idclient,
            Datecommande = entity.Datecommande,
            Totalcommande = entity.Totalcommande,
            Statut = entity.Statut
        };
    }

    public async Task<CommandeDto?> AddLigneCommande(int idcommande, LigneCommandeDto ligne)
    {
        if (ligne.Quantite <= 0)
        {
            throw new InvalidOperationException("La quantite doit etre superieure a zero.");
        }

        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        var article = await _articleRepository.GetById(ligne.Idarticle);
        if (article == null)
        {
            throw new InvalidOperationException("L'article selectionne n'existe pas.");
        }

        var existingLigne = await _ligneCommandeRepository.GetFirstOrDefault(
            l => l.Idcommande == idcommande && l.Idarticle == ligne.Idarticle,
            disableTracking: false);

        if (existingLigne != null)
        {
            existingLigne.Quantite += ligne.Quantite;
            existingLigne.Prixunitaire = article.Prix;
            existingLigne.Montantligne = existingLigne.Quantite * existingLigne.Prixunitaire;
            await _ligneCommandeRepository.Update(existingLigne);
        }
        else
        {
            var nouvelleLigne = new LigneCommande
            {
                Idcommande = idcommande,
                Idarticle = ligne.Idarticle,
                Quantite = ligne.Quantite,
                Prixunitaire = article.Prix,
                Montantligne = ligne.Quantite * article.Prix
            };

            await _ligneCommandeRepository.Add(nouvelleLigne);
        }

        var total = await _ligneCommandeRepository.GetAll()
            .Where(l => l.Idcommande == idcommande)
            .SumAsync(l => l.Montantligne);

        commande.Totalcommande = total;
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

    public async Task<CommandeDto?> ValiderCommande(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        if (commande.Totalcommande <= 0)
        {
            throw new InvalidOperationException("Impossible de valider une commande vide.");
        }

        commande.Statut = "Validee";
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

    public async Task<IEnumerable<CommandeDto>> GetCommandes(CommandeFilterDto filter)
    {
        var query = _commandeRepository.GetAll().AsQueryable();

        if (filter.Idcommande.HasValue)
        {
            query = query.Where(c => c.Idcommande == filter.Idcommande.Value);
        }

        if (filter.Datecommande.HasValue)
        {
            var date = filter.Datecommande.Value.Date;
            query = query.Where(c => c.Datecommande.Date == date);
        }

        var commandes = await query
            .OrderByDescending(c => c.Datecommande)
            .ToListAsync();

        return commandes.Select(c => new CommandeDto
        {
            Idcommande = c.Idcommande,
            Idclient = c.Idclient,
            Datecommande = c.Datecommande,
            Totalcommande = c.Totalcommande,
            Statut = c.Statut
        });
    }

    public async Task<CommandeStatusDto?> GetCommandeStatus(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        return new CommandeStatusDto
        {
            Idcommande = commande.Idcommande,
            Statut = commande.Statut
        };
    }

    public async Task<bool> DeleteCommande(int idcommande)
    {
        var exists = await _commandeRepository.Exists(c => c.Idcommande == idcommande);
        if (!exists)
        {
            return false;
        }

        await _commandeRepository.Delete(idcommande);
        return true;
    }
}
