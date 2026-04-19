FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY Core/*.csproj ./Core/
COPY DAL/*.csproj ./DAL/
COPY Service/*.csproj ./Service/
COPY Client.API/*.csproj ./Client.API/

RUN dotnet restore Client.API/Client.API.csproj

COPY Core ./Core
COPY DAL ./DAL
COPY Service ./Service
COPY Client.API ./Client.API

WORKDIR /src/Client.API
RUN dotnet publish Client.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Client.API.dll"]