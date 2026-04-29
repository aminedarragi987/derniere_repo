using Service.DTO;

namespace Service.IService;

public interface IFacturationService

{
    Task<FactureDto?> GenererFacture(int idCommande);
    Task<PaiementDto?> AddPaiement(int idFacture, PaiementCreateDto dto);
    Task<PaiementDto?> ProcessCardPayment(int idFacture, CardPaymentDto dto);
    Task<List<FactureDetailDto>> GetFactures(FactureFilterDto filter);
}

