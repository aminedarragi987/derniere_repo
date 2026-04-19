using DAL;
using DAL.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Service;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Charger la configuration AVEC les variables d'environnement Docker
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();   

// Configurer Serilog
Log.Logger = new LoggerConfiguration()
               .ReadFrom.Configuration(builder.Configuration)
               .CreateLogger();

builder.Services.AddSingleton(Log.Logger);

// Injection de la config de la DB
builder.Services.Configure<DbContextSettings>(builder.Configuration);

// Ajouter les services DAL/Service avec la bonne configuration
builder.Services.AddService(builder.Configuration);
builder.Services.AddHttpClient();

// JWT
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSettings = jwtSection.Get<JwtSettings>()!;
builder.Services.AddSingleton(jwtSettings);

var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

// Authentification
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(30),
        RoleClaimType = "role"
    };
});

// Authorization
builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSPolicy", pb =>
            pb.AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
              .SetIsOriginAllowed(_ => true));
});

// Controllers
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors("CORSPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();