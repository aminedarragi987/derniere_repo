using Service.DTO;

namespace Service.IService;

public interface ICommandeService
{
    Task<CommandeDto?> CreateCommande(CommandeCreateDto dto);
    Task<CommandeDto?> AddLigneCommande(int idCommande, LigneCommandeDto dto);
    Task<CommandeDto?> ValiderCommande(int idCommande);
    Task<List<CommandeDto>> GetCommandes(CommandeFilterDto filter);
    Task<CommandeStatusDto?> GetCommandeStatus(int idCommande);
    Task<bool> DeleteCommande(int idCommande);
}