using Core.Entities;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using Service.DTO;
using Service.IService;

namespace Service.Service;

public class GestionStockService : IGestionStockService
{
    private readonly IRepositoryAsync<Article> _articleRepository;
    private readonly IRepositoryAsync<Fournisseur> _fournisseurRepository;
    private readonly IRepositoryAsync<Categorie> _categorieRepository;
    private readonly IRepositoryAsync<ArticleFournisseur> _articleFournisseurRepository;
    private readonly IRepositoryAsync<Client> _clientRepository;
    private readonly IRepositoryAsync<Commande> _commandeRepository;
    private readonly IRepositoryAsync<LigneCommande> _ligneCommandeRepository;
    private readonly IRepositoryAsync<Facture> _factureRepository;
    private readonly IRepositoryAsync<Paiement> _paiementRepository;
    private readonly IRepositoryAsync<Livraison> _livraisonRepository;

    public GestionStockService(
        IRepositoryAsync<Article> articleRepository,
        IRepositoryAsync<Fournisseur> fournisseurRepository,
        IRepositoryAsync<Categorie> categorieRepository,
        IRepositoryAsync<ArticleFournisseur> articleFournisseurRepository,
        IRepositoryAsync<Client> clientRepository,
        IRepositoryAsync<Commande> commandeRepository,
        IRepositoryAsync<LigneCommande> ligneCommandeRepository,
        IRepositoryAsync<Facture> factureRepository,
        IRepositoryAsync<Paiement> paiementRepository,
        IRepositoryAsync<Livraison> livraisonRepository)
    {
        _articleRepository = articleRepository;
        _fournisseurRepository = fournisseurRepository;
        _categorieRepository = categorieRepository;
        _articleFournisseurRepository = articleFournisseurRepository;
        _clientRepository = clientRepository;
        _commandeRepository = commandeRepository;
        _ligneCommandeRepository = ligneCommandeRepository;
        _factureRepository = factureRepository;
        _paiementRepository = paiementRepository;
        _livraisonRepository = livraisonRepository;
    }

    public async Task<ArticleDto> AddArticle(ArticleDto article)
    {
        if (article.Idcategorie.HasValue)
        {
            var categorieExists = await _categorieRepository.Exists(c => c.Idcategorie == article.Idcategorie.Value);
            if (!categorieExists)
            {
                throw new InvalidOperationException("La catégorie sélectionnée n'existe pas.");
            }
        }

        var entity = new Article
        {
            Nom = article.Nom,
            Description = article.Description,
            Prix = article.Prix,
            Quantitestock = article.Quantitestock,
            Seuilminimum = article.Seuilminimum,
            Idcategorie = article.Idcategorie
        };

        await _articleRepository.Add(entity);

        if (article.FournisseurIds.Count != 0)
        {
            var links = article.FournisseurIds
                .Distinct()
                .Select(fournisseurId => new ArticleFournisseur
                {
                    Idarticle = entity.Idarticle,
                    Idfournisseur = fournisseurId
                });

            await _articleFournisseurRepository.Add(links);
        }

        article.Idarticle = entity.Idarticle;
        return article;
    }

    public async Task<bool> UpdateArticle(int idarticle, ArticleDto article)
    {
        var existing = await _articleRepository.GetAll()
            .Include(a => a.ArticleFournisseurs)
            .FirstOrDefaultAsync(a => a.Idarticle == idarticle);

        if (existing == null)
        {
            return false;
        }

        existing.Nom = article.Nom;
        existing.Description = article.Description;
        existing.Prix = article.Prix;
        existing.Quantitestock = article.Quantitestock;
        existing.Seuilminimum = article.Seuilminimum;
        existing.Idcategorie = article.Idcategorie;

        await _articleRepository.Update(existing);

        if (article.FournisseurIds.Count != 0)
        {
            var currentLinks = existing.ArticleFournisseurs.ToList();
            if (currentLinks.Count != 0)
            {
                await _articleFournisseurRepository.Delete(currentLinks);
            }

            var links = article.FournisseurIds
                .Distinct()
                .Select(fournisseurId => new ArticleFournisseur
                {
                    Idarticle = idarticle,
                    Idfournisseur = fournisseurId
                });

            await _articleFournisseurRepository.Add(links);
        }

        return true;
    }

    public async Task<bool> DeleteArticle(int idarticle)
    {
        var exists = await _articleRepository.Exists(a => a.Idarticle == idarticle);
        if (!exists)
        {
            return false;
        }

        await _articleRepository.Delete(idarticle);
        return true;
    }

    public async Task<IEnumerable<ArticleDto>> GetArticles(ArticleFilterDto filter)
    {
        var query = _articleRepository.GetAll()
            .Include(a => a.IdcategorieNavigation)
            .Include(a => a.ArticleFournisseurs)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim().ToLower();
            query = query.Where(a =>
                a.Nom.ToLower().Contains(search) ||
                (a.Description != null && a.Description.ToLower().Contains(search)));
        }

        if (filter.Idcategorie.HasValue)
        {
            query = query.Where(a => a.Idcategorie == filter.Idcategorie.Value);
        }

        if (filter.Idfournisseur.HasValue)
        {
            query = query.Where(a => a.ArticleFournisseurs.Any(af => af.Idfournisseur == filter.Idfournisseur.Value));
        }

        if (filter.PrixMin.HasValue)
        {
            query = query.Where(a => a.Prix >= filter.PrixMin.Value);
        }

        if (filter.PrixMax.HasValue)
        {
            query = query.Where(a => a.Prix <= filter.PrixMax.Value);
        }

        var result = await query.OrderBy(a => a.Nom).ToListAsync();

        return result.Select(a => new ArticleDto
        {
            Idarticle = a.Idarticle,
            Nom = a.Nom,
            Description = a.Description,
            Prix = a.Prix,
            Quantitestock = a.Quantitestock,
            Seuilminimum = a.Seuilminimum,
            Idcategorie = a.Idcategorie,
            CategorieNom = a.IdcategorieNavigation?.Nom,
            FournisseurIds = a.ArticleFournisseurs.Select(x => x.Idfournisseur).ToList()
        });
    }

    public async Task<StockNiveauDto?> GetStockNiveau(int idarticle)
    {
        var article = await _articleRepository.GetFirstOrDefault(a => a.Idarticle == idarticle);

        if (article == null)
        {
            return null;
        }

        return new StockNiveauDto
        {
            Idarticle = article.Idarticle,
            NomArticle = article.Nom,
            Quantitestock = article.Quantitestock,
            Seuilminimum = article.Seuilminimum,
            AlerteStock = article.Quantitestock <= article.Seuilminimum
        };
    }

    public async Task<bool> AssocierFournisseur(int idarticle, int idfournisseur)
    {
        var articleExists = await _articleRepository.Exists(a => a.Idarticle == idarticle);
        var fournisseurExists = await _fournisseurRepository.Exists(f => f.Idfournisseur == idfournisseur);

        if (!articleExists || !fournisseurExists)
        {
            return false;
        }

        var linkExists = await _articleFournisseurRepository.Exists(af => af.Idarticle == idarticle && af.Idfournisseur == idfournisseur);
        if (linkExists)
        {
            return true;
        }

        await _articleFournisseurRepository.Add(new ArticleFournisseur
        {
            Idarticle = idarticle,
            Idfournisseur = idfournisseur
        });

        return true;
    }

    public async Task<FournisseurDto> AddFournisseur(FournisseurDto fournisseur)
    {
        var entity = new Fournisseur
        {
            Nom = fournisseur.Nom,
            Email = fournisseur.Email,
            Telephone = fournisseur.Telephone
        };

        await _fournisseurRepository.Add(entity);

        fournisseur.Idfournisseur = entity.Idfournisseur;
        return fournisseur;
    }

    public async Task<bool> UpdateFournisseur(int idfournisseur, FournisseurDto fournisseur)
    {
        var existing = await _fournisseurRepository.GetById(idfournisseur);
        if (existing == null)
        {
            return false;
        }

        existing.Nom = fournisseur.Nom;
        existing.Email = fournisseur.Email;
        existing.Telephone = fournisseur.Telephone;

        await _fournisseurRepository.Update(existing);
        return true;
    }

    public async Task<bool> DeleteFournisseur(int idfournisseur)
    {
        var exists = await _fournisseurRepository.Exists(f => f.Idfournisseur == idfournisseur);
        if (!exists)
        {
            return false;
        }

        var links = await _articleFournisseurRepository.GetMuliple(af => af.Idfournisseur == idfournisseur);
        var articleFournisseurs = links.ToList();
        if (articleFournisseurs.Count != 0)
        {
            await _articleFournisseurRepository.Delete(articleFournisseurs);
        }

        await _fournisseurRepository.Delete(idfournisseur);
        return true;
    }

    public async Task<IEnumerable<FournisseurDto>> GetFournisseurs()
    {
        var fournisseurs = await _fournisseurRepository.GetMuliple(orderBy: q => q.OrderBy(f => f.Nom));

        return fournisseurs.Select(f => new FournisseurDto
        {
            Idfournisseur = f.Idfournisseur,
            Nom = f.Nom,
            Email = f.Email,
            Telephone = f.Telephone
        });
    }

    public async Task<CategorieDto> AddCategorie(CategorieDto categorie)
    {
        var entity = new Categorie
        {
            Nom = categorie.Nom,
            Description = categorie.Description
        };

        await _categorieRepository.Add(entity);

        categorie.Idcategorie = entity.Idcategorie;
        return categorie;
    }

    public async Task<bool> UpdateCategorie(int idcategorie, CategorieDto categorie)
    {
        var existing = await _categorieRepository.GetById(idcategorie);
        if (existing == null)
        {
            return false;
        }

        existing.Nom = categorie.Nom;
        existing.Description = categorie.Description;

        await _categorieRepository.Update(existing);
        return true;
    }

    public async Task<bool> DeleteCategorie(int idcategorie)
    {
        var exists = await _categorieRepository.Exists(c => c.Idcategorie == idcategorie);
        if (!exists)
        {
            return false;
        }

        var categoryInUse = await _articleRepository.Exists(a => a.Idcategorie == idcategorie);
        if (categoryInUse)
        {
            throw new InvalidOperationException("Impossible de supprimer une catégorie utilisée par des articles.");
        }

        await _categorieRepository.Delete(idcategorie);
        return true;
    }

    public async Task<IEnumerable<CategorieDto>> GetCategories()
    {
        var categories = await _categorieRepository.GetMuliple(orderBy: q => q.OrderBy(c => c.Nom));

        return categories.Select(c => new CategorieDto
        {
            Idcategorie = c.Idcategorie,
            Nom = c.Nom,
            Description = c.Description
        });
    }

    public async Task<DashboardStockDto> GetDashboard()
    {
        var nombreArticles = await _articleRepository.Count();
        var nombreFournisseurs = await _fournisseurRepository.Count();
        var nombreArticlesEnAlerte = await _articleRepository.Count(a => a.Quantitestock <= a.Seuilminimum);

        return new DashboardStockDto
        {
            NombreArticles = nombreArticles,
            NombreFournisseurs = nombreFournisseurs,
            NombreArticlesEnAlerte = nombreArticlesEnAlerte
        };
    }

    public async Task<ClientDto> AddClient(ClientCreateDto client)
    {
        var entity = new Client
        {
            Nom = client.Nom,
            Email = client.Email,
            Telephone = client.Telephone,
            Adresse = client.Adresse
        };

        await _clientRepository.Add(entity);

        return new ClientDto
        {
            Idclient = entity.Idclient,
            Nom = entity.Nom,
            Email = entity.Email,
            Telephone = entity.Telephone,
            Adresse = entity.Adresse
        };
    }

    public async Task<bool> UpdateClient(int idclient, ClientUpdateDto client)
    {
        var existing = await _clientRepository.GetById(idclient);
        if (existing == null)
        {
            return false;
        }

        existing.Nom = client.Nom;
        existing.Email = client.Email;
        existing.Telephone = client.Telephone;
        existing.Adresse = client.Adresse;

        await _clientRepository.Update(existing);
        return true;
    }

    public async Task<bool> DeleteClient(int idclient)
    {
        var exists = await _clientRepository.Exists(c => c.Idclient == idclient);
        if (!exists)
        {
            return false;
        }

        await _clientRepository.Delete(idclient);
        return true;
    }

    public async Task<IEnumerable<ClientDto>> GetClients()
    {
        var clients = await _clientRepository.GetMuliple(orderBy: q => q.OrderBy(c => c.Nom));

        return clients.Select(c => new ClientDto
        {
            Idclient = c.Idclient,
            Nom = c.Nom,
            Email = c.Email,
            Telephone = c.Telephone,
            Adresse = c.Adresse
        });
    }

    public async Task<CommandeDto?> CreateCommande(CommandeCreateDto commande)
    {
        var clientExists = await _clientRepository.Exists(c => c.Idclient == commande.Idclient);
        if (!clientExists)
        {
            return null;
        }

        var entity = new Commande
        {
            Idclient = commande.Idclient,
            Datecommande = DateTime.UtcNow,
            Totalcommande = 0,
            Statut = "Brouillon"
        };

        await _commandeRepository.Add(entity);

        return new CommandeDto
        {
            Idcommande = entity.Idcommande,
            Idclient = entity.Idclient,
            Datecommande = entity.Datecommande,
            Totalcommande = entity.Totalcommande,
            Statut = entity.Statut
        };
    }

    public async Task<CommandeDto?> ValiderCommande(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        if (commande.Totalcommande <= 0)
        {
            throw new InvalidOperationException("Impossible de valider une commande vide.");
        }

        commande.Statut = "Validée";
        await _commandeRepository.Update(commande);

        return new CommandeDto
        {
            Idcommande = commande.Idcommande,
            Idclient = commande.Idclient,
            Datecommande = commande.Datecommande,
            Totalcommande = commande.Totalcommande,
            Statut = commande.Statut
        };
    }

    public async Task<IEnumerable<CommandeDto>> GetCommandes(CommandeFilterDto filter)
    {
        var query = _commandeRepository.GetAll().AsQueryable();

        if (filter.Idcommande.HasValue)
        {
            query = query.Where(c => c.Idcommande == filter.Idcommande.Value);
        }

        if (filter.Datecommande.HasValue)
        {
            var date = filter.Datecommande.Value.Date;
            query = query.Where(c => c.Datecommande.Date == date);
        }

        var commandes = await query
            .OrderByDescending(c => c.Datecommande)
            .ToListAsync();

        return commandes.Select(c => new CommandeDto
        {
            Idcommande = c.Idcommande,
            Idclient = c.Idclient,
            Datecommande = c.Datecommande,
            Totalcommande = c.Totalcommande,
            Statut = c.Statut
        });
    }

    public async Task<CommandeStatusDto?> GetCommandeStatus(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        return new CommandeStatusDto
        {
            Idcommande = commande.Idcommande,
            Statut = commande.Statut
        };
    }

    public async Task<bool> DeleteCommande(int idcommande)
    {
        var exists = await _commandeRepository.Exists(c => c.Idcommande == idcommande);
        if (!exists)
        {
            return false;
        }

        await _commandeRepository.Delete(idcommande);
        return true;
    }

    public async Task<CommandeDto?> AddLigneCommande(int idcommande, LigneCommandeDto ligne)
    {
        if (ligne.Quantite <= 0)
        {
            throw new InvalidOperationException("La quantité doit être supérieure à zéro.");
        }

        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        var article = await _articleRepository.GetById(ligne.Idarticle);
        if (article == null)
        {
            throw new InvalidOperationException("L'article sélectionné n'existe pas.");
        }

        var existingLigne = await _ligneCommandeRepository.GetFirstOrDefault(
            l => l.Idcommande == idcommande && l.Idarticle == ligne.Idarticle,
            disableTracking: false);

        if (existingLigne != null)
        {
            existingLigne.Quantite += ligne.Quantite;
            existingLigne.Prixunitaire = article.Prix;
            existingLigne.Montantligne = existingLigne.Quantite * existingLigne.Prixunitaire;
            await _ligneCommandeRepository.Update(existingLigne);
        }
        else
        {
            var nouvelleLigne = new LigneCommande
            {
                Idcommande = idcommande,
                Idarticle = ligne.Idarticle,
                Quantite = ligne.Quantite,
                Prixunitaire = article.Prix,
                Montantligne = ligne.Quantite * article.Prix
            };

            await _ligneCommandeRepository.Add(nouvelleLigne);
        }

        var total = await _ligneCommandeRepository.GetAll()
            .Where(l => l.Idcommande == idcommande)
            .SumAsync(l => l.Montantligne);

        commande.Totalcommande = total;
        commande.Statut = "En cours";
        await _commandeRepository.Update(commande);

        return new CommandeDto
        {
            Idcommande = commande.Idcommande,
            Idclient = commande.Idclient,
            Datecommande = commande.Datecommande,
            Totalcommande = commande.Totalcommande,
            Statut = commande.Statut
        };
    }

    public async Task<FactureDto?> GenererFacture(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        var existingFacture = await _factureRepository.GetFirstOrDefault(f => f.Idcommande == idcommande);
        if (existingFacture != null)
        {
            return new FactureDto
            {
                Idfacture = existingFacture.Idfacture,
                Idcommande = existingFacture.Idcommande,
                Datefacture = existingFacture.Datefacture,
                Montantttc = existingFacture.Montantttc,
                Statut = existingFacture.Statut
            };
        }

        var facture = new Facture
        {
            Idcommande = idcommande,
            Datefacture = DateTime.UtcNow,
            Montantttc = commande.Totalcommande,
            Statut = "Générée"
        };

        await _factureRepository.Add(facture);

        return new FactureDto
        {
            Idfacture = facture.Idfacture,
            Idcommande = facture.Idcommande,
            Datefacture = facture.Datefacture,
            Montantttc = facture.Montantttc,
            Statut = facture.Statut
        };
    }

    public async Task<IEnumerable<FactureDetailDto>> GetFactures(FactureFilterDto filter)
    {
        var query = _factureRepository.GetAll()
            .Include(f => f.IdcommandeNavigation)
            .ThenInclude(c => c.IdclientNavigation)
            .AsQueryable();

        if (filter.Idfacture.HasValue)
        {
            query = query.Where(f => f.Idfacture == filter.Idfacture.Value);
        }

        if (filter.Idcommande.HasValue)
        {
            query = query.Where(f => f.Idcommande == filter.Idcommande.Value);
        }

        if (filter.Idclient.HasValue)
        {
            query = query.Where(f => f.IdcommandeNavigation.Idclient == filter.Idclient.Value);
        }

        var factures = await query
            .OrderByDescending(f => f.Datefacture)
            .ToListAsync();

        return factures.Select(f => new FactureDetailDto
        {
            Idfacture = f.Idfacture,
            Idcommande = f.Idcommande,
            Idclient = f.IdcommandeNavigation.Idclient,
            NomClient = f.IdcommandeNavigation.IdclientNavigation.Nom,
            Datecommande = f.IdcommandeNavigation.Datecommande,
            Datefacture = f.Datefacture,
            Totalcommande = f.IdcommandeNavigation.Totalcommande,
            Montantttc = f.Montantttc,
            Statut = f.Statut
        });
    }

    public async Task<PaiementDto?> AddPaiement(int idfacture, PaiementCreateDto paiement)
    {
        if (paiement.Montant <= 0)
        {
            throw new InvalidOperationException("Le montant du paiement doit être supérieur à zéro.");
        }

        var facture = await _factureRepository.GetById(idfacture);
        if (facture == null)
        {
            return null;
        }

        var entity = new Paiement
        {
            Idfacture = idfacture,
            Datepaiement = DateTime.UtcNow,
            Montant = paiement.Montant,
            Modepaiement = paiement.Modepaiement,
            Reference = paiement.Reference
        };

        await _paiementRepository.Add(entity);

        var totalPaye = await _paiementRepository.GetAll()
            .Where(p => p.Idfacture == idfacture)
            .SumAsync(p => p.Montant);

        facture.Statut = totalPaye >= facture.Montantttc ? "Payée" : "Partiellement payée";
        await _factureRepository.Update(facture);

        return new PaiementDto
        {
            Idpaiement = entity.Idpaiement,
            Idfacture = entity.Idfacture,
            Datepaiement = entity.Datepaiement,
            Montant = entity.Montant,
            Modepaiement = entity.Modepaiement,
            Reference = entity.Reference
        };
    }

    public async Task<PaiementDto?> ProcessCardPayment(int idfacture, CardPaymentDto paiementCarte)
    {
        if (paiementCarte.Montant <= 0)
        {
            throw new InvalidOperationException("Le montant du paiement doit être supérieur à zéro.");
        }

        if (string.IsNullOrWhiteSpace(paiementCarte.CardHolderName))
        {
            throw new InvalidOperationException("Le nom du porteur de carte est obligatoire.");
        }

        var cardNumber = (paiementCarte.CardNumber ?? string.Empty).Replace(" ", string.Empty);
        if (cardNumber.Length < 13 || cardNumber.Length > 19 || !cardNumber.All(char.IsDigit))
        {
            throw new InvalidOperationException("Numéro de carte invalide.");
        }

        var cvv = paiementCarte.Cvv ?? string.Empty;
        if ((cvv.Length != 3 && cvv.Length != 4) || !cvv.All(char.IsDigit))
        {
            throw new InvalidOperationException("CVV invalide.");
        }

        if (paiementCarte.ExpiryMonth < 1 || paiementCarte.ExpiryMonth > 12)
        {
            throw new InvalidOperationException("Mois d'expiration invalide.");
        }

        var now = DateTime.UtcNow;
        var currentYear = now.Year;
        var currentMonth = now.Month;
        if (paiementCarte.ExpiryYear < currentYear || (paiementCarte.ExpiryYear == currentYear && paiementCarte.ExpiryMonth < currentMonth))
        {
            throw new InvalidOperationException("La carte bancaire est expirée.");
        }

        var paiement = new PaiementCreateDto
        {
            Montant = paiementCarte.Montant,
            Modepaiement = "CarteBancaire",
            Reference = string.IsNullOrWhiteSpace(paiementCarte.Reference)
                ? $"CB-{DateTime.UtcNow:yyyyMMddHHmmss}"
                : paiementCarte.Reference
        };

        return await AddPaiement(idfacture, paiement);
    }

    public async Task<LivraisonDto?> GenererLivraison(int idcommande)
    {
        var commande = await _commandeRepository.GetById(idcommande);
        if (commande == null)
        {
            return null;
        }

        if (!string.Equals(commande.Statut, "Validée", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("La commande doit être validée avant de générer une livraison.");
        }

        var existingLivraison = await _livraisonRepository.GetFirstOrDefault(l => l.Idcommande == idcommande);
        if (existingLivraison != null)
        {
            return new LivraisonDto
            {
                Idlivraison = existingLivraison.Idlivraison,
                Idcommande = existingLivraison.Idcommande,
                Datelivraison = existingLivraison.Datelivraison,
                Adresse = existingLivraison.Adresse,
                Statut = existingLivraison.Statut
            };
        }

        var client = await _clientRepository.GetById(commande.Idclient);

        var livraison = new Livraison
        {
            Idcommande = idcommande,
            Datelivraison = DateTime.UtcNow,
            Adresse = client?.Adresse,
            Statut = "Préparée"
        };

        await _livraisonRepository.Add(livraison);

        return new LivraisonDto
        {
            Idlivraison = livraison.Idlivraison,
            Idcommande = livraison.Idcommande,
            Datelivraison = livraison.Datelivraison,
            Adresse = livraison.Adresse,
            Statut = livraison.Statut
        };
    }

    public async Task<LivraisonDto?> GetLivraison(int idlivraison)
    {
        var livraison = await _livraisonRepository.GetById(idlivraison);
        if (livraison == null)
        {
            return null;
        }

        return new LivraisonDto
        {
            Idlivraison = livraison.Idlivraison,
            Idcommande = livraison.Idcommande,
            Datelivraison = livraison.Datelivraison,
            Adresse = livraison.Adresse,
            Statut = livraison.Statut
        };
    }

    public async Task<ComptabiliteExportDto?> EnvoyerLivraisonComptabilite(int idlivraison)
    {
        var livraison = await _livraisonRepository.GetById(idlivraison);
        if (livraison == null)
        {
            return null;
        }

        return new ComptabiliteExportDto
        {
            Idlivraison = livraison.Idlivraison,
            Idcommande = livraison.Idcommande,
            Datelivraison = livraison.Datelivraison,
            Adresse = livraison.Adresse,
            StatutLivraison = livraison.Statut,
            EnvoyeLeUtc = DateTime.UtcNow,
            StatutEnvoi = "Envoyé"
        };
    }

    public async Task<DashboardDirectionDto> GetDashboardDirection()
    {
        var commandes = await _commandeRepository.GetMuliple();
        var factures = await _factureRepository.GetMuliple();
        var paiements = await _paiementRepository.GetMuliple();

        var commandeList = commandes.ToList();
        var factureList = factures.ToList();
        var paiementList = paiements.ToList();

        var ventesMensuelles = commandeList
            .GroupBy(c => new { c.Datecommande.Year, c.Datecommande.Month })
            .Select(g =>
            {
                var totalFacturesMois = factureList
                    .Where(f => f.Datefacture.Year == g.Key.Year && f.Datefacture.Month == g.Key.Month)
                    .Sum(f => f.Montantttc);

                var totalPaiementsMois = paiementList
                    .Where(p => p.Datepaiement.Year == g.Key.Year && p.Datepaiement.Month == g.Key.Month)
                    .Sum(p => p.Montant);

                return new VenteMensuelleDto
                {
                    Annee = g.Key.Year,
                    Mois = g.Key.Month,
                    NombreCommandes = g.Count(),
                    TotalCommandes = g.Sum(x => x.Totalcommande),
                    TotalFactures = totalFacturesMois,
                    TotalPaiements = totalPaiementsMois
                };
            })
            .OrderBy(v => v.Annee)
            .ThenBy(v => v.Mois)
            .ToList();

        return new DashboardDirectionDto
        {
            NombreCommandes = commandeList.Count,
            NombreCommandesValidees = commandeList.Count(c => string.Equals(c.Statut, "Validée", StringComparison.OrdinalIgnoreCase)),
            NombreFactures = factureList.Count,
            NombreFacturesPayees = factureList.Count(f => string.Equals(f.Statut, "Payée", StringComparison.OrdinalIgnoreCase)),
            ChiffreAffairesCommandes = commandeList.Sum(c => c.Totalcommande),
            ChiffreAffairesFactures = factureList.Sum(f => f.Montantttc),
            MontantTotalPaiements = paiementList.Sum(p => p.Montant),
            VentesMensuelles = ventesMensuelles
        };
    }
}
