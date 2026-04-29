using Service.DTO;

namespace Service.IService;

public interface IClientService
{
    Task<ClientDto> AddClient(ClientCreateDto dto);
    Task<bool> UpdateClient(int idclient, ClientUpdateDto dto);
    Task<IEnumerable<ClientDto>> GetClients();
    Task<bool> DeleteClient(int idclient);
}
