using Service.DTO;

namespace Service.IService;

public interface ILivraisonService
{
    Task<LivraisonDto?> GenererLivraison(int idCommande);
    Task<LivraisonDto?> GetLivraison(int idLivraison);
    Task<ComptabiliteExportDto?> EnvoyerComptabilite(int idLivraison);
}