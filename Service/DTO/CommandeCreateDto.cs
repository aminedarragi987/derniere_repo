using System.ComponentModel.DataAnnotations;

namespace Service.DTO;

public class CommandeCreateDto
{
    [Range(1, int.MaxValue)]
    public int Idclient { get; set; }
}