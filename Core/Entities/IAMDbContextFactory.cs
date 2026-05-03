using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Core.Entities;

public class IAMDbContextFactory : IDesignTimeDbContextFactory<IAMDbContext>
{
    public IAMDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<IAMDbContext>();

        // Pour container Docker: postgresdb (résolvable dans le réseau Docker)
        var connectionString =
            "Host=postgresdb;Port=5432;Database=IAM;Username=postgres;Password=data2010.";

        optionsBuilder.UseNpgsql(connectionString);

        return new IAMDbContext(optionsBuilder.Options);
    }
}