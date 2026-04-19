FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Core/*.csproj ./Core/
COPY DAL/*.csproj ./DAL/
COPY Service/*.csproj ./Service/
COPY Commande.API/*.csproj ./Commande.API/

RUN dotnet restore Commande.API/Commande.API.csproj

COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY Commande.API ./Commande.API

WORKDIR /src/Commande.API
RUN dotnet publish Commande.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Commande.API.dll"]