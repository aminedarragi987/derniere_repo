var builder = WebApplication.CreateBuilder(args);

//
// 🔥 FORCE le chargement explicite du appsettings.json
//
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

//
// 🔥 YARP Reverse Proxy
//
builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

//
// 🔥 TEST ENDPOINT (debug uniquement)
//
app.MapGet("/test", () => "gateway OK");

//
// 🔥 YARP ROUTING
//
app.MapReverseProxy();

app.Run();