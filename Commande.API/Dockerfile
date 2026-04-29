FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copier solution + projets séparés
COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY Commande.API ./Commande.API

RUN dotnet restore Commande.API/Commande.API.csproj

RUN dotnet publish Commande.API/Commande.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Commande.API.dll"]