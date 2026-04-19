FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Core/*.csproj ./Core/
COPY DAL/*.csproj ./DAL/
COPY Service/*.csproj ./Service/
COPY Gestion_de_stock.API/*.csproj ./Gestion_de_stock.API/

RUN dotnet restore Gestion_de_stock.API/Gestion_de_stock.API.csproj

COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY Gestion_de_stock.API ./Gestion_de_stock.API

WORKDIR /src/Gestion_de_stock.API
RUN dotnet publish Gestion_de_stock.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Gestion_de_stock.API.dll"]
