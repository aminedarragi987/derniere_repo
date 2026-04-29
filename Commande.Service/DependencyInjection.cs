using DAL.Injections;
using Microsoft.Extensions.DependencyInjection;
using Commande.Service.IService;
using Commande.Service.Services;

namespace Commande.Service;

public static class DependencyInjection
{
    public static IServiceCollection AddCommandeService(this IServiceCollection services)
    {
        services.InjectPersistence();
        services.AddScoped<ICommandeService, CommandeService>();
        return services;
    }
}
