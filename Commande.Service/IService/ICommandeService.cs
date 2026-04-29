using Commande.Service.DTO;

namespace Commande.Service.IService;

public interface ICommandeService
{
    Task<CommandeDto?> CreateCommande(CommandeCreateDto commande);
    Task<CommandeDto?> AddLigneCommande(int idcommande, LigneCommandeDto ligne);
    Task<CommandeDto?> ValiderCommande(int idcommande);
    Task<IEnumerable<CommandeDto>> GetCommandes(CommandeFilterDto filter);
    Task<CommandeStatusDto?> GetCommandeStatus(int idcommande);
    Task<bool> DeleteCommande(int idcommande);
}
