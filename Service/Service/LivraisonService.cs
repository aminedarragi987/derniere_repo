using Core.Entities;
using DAL.IRepository;
using Service.DTO;
using Service.IService;

namespace Service.Service;

public class LivraisonService : ILivraisonService
{
    private readonly IRepositoryAsync<Livraison> _livraisonRepository;
    private readonly IRepositoryAsync<Commande> _commandeRepository;
    private readonly IRepositoryAsync<Client> _clientRepository;

    public LivraisonService(
        IRepositoryAsync<Livraison> livraisonRepository,
        IRepositoryAsync<Commande> commandeRepository,
        IRepositoryAsync<Client> clientRepository)
    {
        _livraisonRepository = livraisonRepository;
        _commandeRepository = commandeRepository;
        _clientRepository = clientRepository;
    }

    // ================= GENERER LIVRAISON =================

    public async Task<LivraisonDto?> GenererLivraison(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null) return null;

        if (!string.Equals(commande.Statut, "Validée", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Commande non validée.");

        var client = await _clientRepository.GetById(commande.Idclient);

        var livraison = new Livraison
        {
            Idcommande = idcommande,
            Datelivraison = DateTime.UtcNow,
            Adresse = client?.Adresse,
            Statut = "Préparée"
        };

        await _livraisonRepository.Add(livraison);

        return new LivraisonDto
        {
            Idlivraison = livraison.Idlivraison,
            Idcommande = livraison.Idcommande,
            Datelivraison = livraison.Datelivraison,
            Adresse = livraison.Adresse,
            Statut = livraison.Statut
        };
    }

    // ================= GET LIVRAISON =================

    public async Task<LivraisonDto?> GetLivraison(int idlivraison)
    {
        var livraison = await _livraisonRepository.GetById(idlivraison);
        if (livraison == null) return null;

        return new LivraisonDto
        {
            Idlivraison = livraison.Idlivraison,
            Idcommande = livraison.Idcommande,
            Datelivraison = livraison.Datelivraison,
            Adresse = livraison.Adresse,
            Statut = livraison.Statut
        };
    }

    // ================= EXPORT COMPTA =================

    public async Task<ComptabiliteExportDto?> EnvoyerComptabilite(int idlivraison)
    {
        var livraison = await _livraisonRepository.GetById(idlivraison);
        if (livraison == null) return null;

        return new ComptabiliteExportDto
        {
            Idlivraison = livraison.Idlivraison,
            Idcommande = livraison.Idcommande,
            Datelivraison = livraison.Datelivraison,
            Adresse = livraison.Adresse,
            StatutLivraison = livraison.Statut,
            EnvoyeLeUtc = DateTime.UtcNow,
            StatutEnvoi = "Envoyé"
        };
    }
}