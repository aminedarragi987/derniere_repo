namespace Service.DTO;

public class DashboardDirectionDto
{
    public int NombreCommandes { get; set; }

    public int NombreCommandesValidees { get; set; }

    public int NombreFactures { get; set; }

    public int NombreFacturesPayees { get; set; }

    public decimal ChiffreAffairesCommandes { get; set; }

    public decimal ChiffreAffairesFactures { get; set; }

    public decimal MontantTotalPaiements { get; set; }

    public IEnumerable<VenteMensuelleDto> VentesMensuelles { get; set; } = Enumerable.Empty<VenteMensuelleDto>();
}
