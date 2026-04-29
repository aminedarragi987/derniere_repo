using AutoMapper;
using AutoMapper.Extensions.ExpressionMapping;
using DAL.Injections;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Service.Common.Mappings;
using Service.IService;
using Service.Service;

namespace Service
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddExpressionMapping();
                cfg.AddProfile<MappingProfile>();
            });

            services.InjectPersistence();
            services.AddAllService();

            return services;
        }
    }
}