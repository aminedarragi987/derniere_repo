FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier les projets nécessaires
COPY Core/*.csproj ./Core/
COPY DAL/*.csproj ./DAL/
COPY Service/*.csproj ./Service/
COPY User.API/*.csproj ./User.API/

RUN dotnet restore User.API/User.API.csproj

# Copier tout le code
COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY User.API ./User.API

WORKDIR /src/User.API
RUN dotnet publish User.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "User.API.dll"]
