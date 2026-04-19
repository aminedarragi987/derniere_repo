FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Core/*.csproj ./Core/
COPY DAL/*.csproj ./DAL/
COPY Service/*.csproj ./Service/
COPY Livraison.API/*.csproj ./Livraison.API/

RUN dotnet restore Livraison.API/Livraison.API.csproj

COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY Livraison.API ./Livraison.API

WORKDIR /src/Livraison.API
RUN dotnet publish Livraison.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Livraison.API.dll"]