using Core.Entities;
using DAL.IRepository;
using Service.DTO;
using Service.IService;

namespace Service.Service;

public class ClientService : IClientService
{
    private readonly IRepositoryAsync<Client> _clientRepository;

    public ClientService(IRepositoryAsync<Client> clientRepository)
    {
        _clientRepository = clientRepository;
    }

    public async Task<ClientDto> AddClient(ClientCreateDto dto)
    {
        var entity = new Client
        {
            Nom = dto.Nom,
            Email = dto.Email,
            Telephone = dto.Telephone,
            Adresse = dto.Adresse
        };

        await _clientRepository.Add(entity);

        return new ClientDto
        {
            Idclient = entity.Idclient,
            Nom = entity.Nom,
            Email = entity.Email,
            Telephone = entity.Telephone,
            Adresse = entity.Adresse
        };
    }

    public async Task<bool> UpdateClient(int idclient, ClientUpdateDto dto)
    {
        var entity = await _clientRepository.GetById(idclient);
        if (entity == null)
            return false;

        entity.Nom = dto.Nom;
        entity.Email = dto.Email;
        entity.Telephone = dto.Telephone;
        entity.Adresse = dto.Adresse;

        await _clientRepository.Update(entity);
        return true;
    }

    public async Task<IEnumerable<ClientDto>> GetClients()
    {
        var list = await _clientRepository.GetMuliple();

        return list.Select(c => new ClientDto
        {
            Idclient = c.Idclient,
            Nom = c.Nom,
            Email = c.Email,
            Telephone = c.Telephone,
            Adresse = c.Adresse
        });
    }

    public async Task<bool> DeleteClient(int idclient)
    {
        if (!await _clientRepository.Exists(c => c.Idclient == idclient))
            return false;

        await _clientRepository.Delete(idclient);
        return true;
    }
}
