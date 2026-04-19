FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier les projets (en remontant d’un dossier)
COPY Core/*.csproj ./Core/
COPY DAL/*.csproj ./DAL/
COPY Service/*.csproj ./Service/
COPY Auth.API/*.csproj ./Auth.API/

RUN dotnet restore Auth.API/Auth.API.csproj

# Copier tout le code
COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY Auth.API ./Auth.API

WORKDIR /src/Auth.API
RUN dotnet publish Auth.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Auth.API.dll"]