using Core.Entities;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using Service.DTO;
using Service.IService;

namespace Service.Service;

public class FacturationService : IFacturationService
{
    private readonly IRepositoryAsync<Facture> _factureRepository;
    private readonly IRepositoryAsync<Commande> _commandeRepository;
    private readonly IRepositoryAsync<Paiement> _paiementRepository;

    public FacturationService(
        IRepositoryAsync<Facture> factureRepository,
        IRepositoryAsync<Commande> commandeRepository,
        IRepositoryAsync<Paiement> paiementRepository)
    {
        _factureRepository = factureRepository;
        _commandeRepository = commandeRepository;
        _paiementRepository = paiementRepository;
    }

    // ================= FACTURE =================

    public async Task<FactureDto?> GenererFacture(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null) return null;

        var facture = new Facture
        {
            Idcommande = idcommande,
            Datefacture = DateTime.UtcNow,
            Montantttc = commande.Totalcommande,
            Statut = "Générée"
        };

        await _factureRepository.Add(facture);

        return new FactureDto
        {
            Idfacture = facture.Idfacture,
            Idcommande = facture.Idcommande,
            Datefacture = facture.Datefacture,
            Montantttc = facture.Montantttc,
            Statut = facture.Statut
        };
    }

    // ================= PAIEMENT =================

    public async Task<PaiementDto?> AddPaiement(int idfacture, PaiementCreateDto dto)
    {
        var facture = await _factureRepository.GetById(idfacture);
        if (facture == null) return null;

        var paiement = new Paiement
        {
            Idfacture = idfacture,
            Montant = dto.Montant,
            Modepaiement = dto.Modepaiement,
            Datepaiement = DateTime.UtcNow
        };

        await _paiementRepository.Add(paiement);

        return new PaiementDto
        {
            Idpaiement = paiement.Idpaiement,
            Idfacture = paiement.Idfacture,
            Montant = paiement.Montant,
            Modepaiement = paiement.Modepaiement,
            Datepaiement = paiement.Datepaiement
        };
    }

    // ================= CARTE =================

    public async Task<PaiementDto?> ProcessCardPayment(int idfacture, CardPaymentDto dto)
    {
        if (dto.Montant <= 0)
            throw new InvalidOperationException("Montant invalide");

        if (string.IsNullOrWhiteSpace(dto.CardHolderName))
            throw new InvalidOperationException("Nom carte requis");

        var paiement = new PaiementCreateDto
        {
            Montant = dto.Montant,
            Modepaiement = "CarteBancaire",
            Reference = $"CB-{DateTime.UtcNow:yyyyMMddHHmmss}"
        };

        return await AddPaiement(idfacture, paiement);
    }

    // ================= LISTE FACTURES =================

    public async Task<List<FactureDetailDto>> GetFactures(FactureFilterDto filter)
    {
        var query = _factureRepository.GetAll()
            .Include(f => f.IdcommandeNavigation)
            .ThenInclude(c => c.IdclientNavigation)
            .AsQueryable();

        var list = await query.ToListAsync();

        return list.Select(f => new FactureDetailDto
        {
            Idfacture = f.Idfacture,
            Idcommande = f.Idcommande,
            Montantttc = f.Montantttc,
            Statut = f.Statut
        }).ToList();
    }
}