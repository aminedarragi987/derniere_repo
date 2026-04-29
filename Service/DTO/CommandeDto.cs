namespace Service.DTO;

public class CommandeDto
{
    public int Idcommande { get; set; }
    public int Idclient { get; set; }
    public DateTime Datecommande { get; set; }
    public decimal Totalcommande { get; set; }
    public string Statut { get; set; } = string.Empty;
}