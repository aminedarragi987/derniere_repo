namespace Service.DTO;

public class ClientCreateDto
{
    public string Nom { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string? Telephone { get; set; }

    public string? Adresse { get; set; }
}
