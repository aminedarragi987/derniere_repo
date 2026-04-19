FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Core/*.csproj ./Core/
COPY DAL/*.csproj ./DAL/
COPY Service/*.csproj ./Service/
COPY Facturation.API/*.csproj ./Facturation.API/

RUN dotnet restore Facturation.API/Facturation.API.csproj

COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY Facturation.API ./Facturation.API

WORKDIR /src/Facturation.API
RUN dotnet publish Facturation.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Facturation.API.dll"]