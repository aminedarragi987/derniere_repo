using Core.Entities;
using DAL.IRepository;
using Microsoft.EntityFrameworkCore;
using Service.DTO;
using Service.IService;

namespace Service.Service;

public class StockService : IStockService
{
    private readonly IRepositoryAsync<Article> _articleRepo;
    private readonly IRepositoryAsync<Fournisseur> _fournisseurRepo;
    private readonly IRepositoryAsync<Categorie> _categorieRepo;

    public StockService(
        IRepositoryAsync<Article> articleRepo,
        IRepositoryAsync<Fournisseur> fournisseurRepo,
        IRepositoryAsync<Categorie> categorieRepo)
    {
        _articleRepo = articleRepo;
        _fournisseurRepo = fournisseurRepo;
        _categorieRepo = categorieRepo;
    }

    // ================= ARTICLES =================

    public async Task<ArticleDto> AddArticle(ArticleDto dto)
    {
        var slug = GenerateSlug(dto.Slug ?? dto.Nom);

        var entity = new Article
        {
            Nom = dto.Nom,
            Description = dto.Description,
            Prix = dto.Prix,
            Quantitestock = dto.Quantitestock,
            Seuilminimum = dto.Seuilminimum,

            Sexe = dto.Sexe,
            Typevetement = dto.Typevetement,
            Marque = dto.Marque,
            Couleur = dto.Couleur,
            Taille = dto.Taille,

            Idcategorie = dto.Idcategorie,

            ImageUrl = dto.ImageUrl,
            Sku = dto.Sku,
            Statut = dto.Statut ?? "Actif",
            Slug = slug,
            IsFeatured = dto.IsFeatured,
            Matiere = dto.Matiere
        };

        await _articleRepo.Add(entity);
        dto.Idarticle = entity.Idarticle;
        dto.Slug = slug;

        return dto;
    }

    public async Task<bool> UpdateArticle(int id, ArticleDto dto)
    {
        var entity = await _articleRepo.GetById(id);
        if (entity == null) return false;

        entity.Nom = dto.Nom;
        entity.Description = dto.Description;
        entity.Prix = dto.Prix;
        entity.Quantitestock = dto.Quantitestock;
        entity.Seuilminimum = dto.Seuilminimum;

        entity.Sexe = dto.Sexe;
        entity.Typevetement = dto.Typevetement;
        entity.Marque = dto.Marque;
        entity.Couleur = dto.Couleur;
        entity.Taille = dto.Taille;

        entity.Idcategorie = dto.Idcategorie;

        entity.ImageUrl = dto.ImageUrl;
        entity.Sku = dto.Sku;
        entity.Statut = dto.Statut ?? "Actif";
        entity.Slug = GenerateSlug(dto.Slug ?? dto.Nom);
        entity.IsFeatured = dto.IsFeatured;
        entity.Matiere = dto.Matiere;

        await _articleRepo.Update(entity);
        return true;
    }

    public async Task<bool> DeleteArticle(int id)
    {
        if (!await _articleRepo.Exists(a => a.Idarticle == id))
            return false;

        await _articleRepo.Delete(id);
        return true;
    }

    public async Task<IEnumerable<ArticleDto>> GetArticles(ArticleFilterDto filter)
    {
        var query = _articleRepo.GetAll()
            .Include(a => a.IdcategorieNavigation)
            .Include(a => a.ArticleFournisseurs)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
            query = query.Where(a => a.Nom.Contains(filter.Search));

        if (filter.Idcategorie.HasValue)
            query = query.Where(a => a.Idcategorie == filter.Idcategorie);

        if (!string.IsNullOrWhiteSpace(filter.Sexe))
            query = query.Where(a => a.Sexe == filter.Sexe);

        if (!string.IsNullOrWhiteSpace(filter.Typevetement))
            query = query.Where(a => a.Typevetement == filter.Typevetement);

        if (!string.IsNullOrWhiteSpace(filter.Marque))
            query = query.Where(a => a.Marque == filter.Marque);

        if (!string.IsNullOrWhiteSpace(filter.Couleur))
            query = query.Where(a => a.Couleur == filter.Couleur);

        if (!string.IsNullOrWhiteSpace(filter.Taille))
            query = query.Where(a => a.Taille == filter.Taille);

        if (filter.PrixMin.HasValue)
            query = query.Where(a => a.Prix >= filter.PrixMin.Value);

        if (filter.PrixMax.HasValue)
            query = query.Where(a => a.Prix <= filter.PrixMax.Value);

        if (!string.IsNullOrWhiteSpace(filter.Statut))
            query = query.Where(a => a.Statut == filter.Statut);

        if (filter.IsFeatured.HasValue)
            query = query.Where(a => a.IsFeatured == filter.IsFeatured.Value);

        if (!string.IsNullOrWhiteSpace(filter.Matiere))
            query = query.Where(a => a.Matiere == filter.Matiere);

        var list = await query.ToListAsync();

        return list.Select(a => new ArticleDto
        {
            Idarticle = a.Idarticle,
            Nom = a.Nom,
            Description = a.Description,
            Prix = a.Prix,
            Quantitestock = a.Quantitestock,
            Seuilminimum = a.Seuilminimum,

            Sexe = a.Sexe,
            Typevetement = a.Typevetement,
            Marque = a.Marque,
            Couleur = a.Couleur,
            Taille = a.Taille,

            Idcategorie = a.Idcategorie,

            CategorieNom = a.IdcategorieNavigation != null
                ? a.IdcategorieNavigation.Nom
                : null,

            ImageUrl = a.ImageUrl,
            Sku = a.Sku,
            Statut = a.Statut,
            Slug = a.Slug,
            IsFeatured = a.IsFeatured,
            Matiere = a.Matiere,

            FournisseurIds = a.ArticleFournisseurs != null
                ? a.ArticleFournisseurs.Select(f => f.Idfournisseur).ToList()
                : new List<int>()
        });
    }

    public async Task<StockNiveauDto?> GetStockNiveau(int idArticle)
    {
        var a = await _articleRepo.GetById(idArticle);
        if (a == null) return null;

        return new StockNiveauDto
        {
            Idarticle = a.Idarticle,
            NomArticle = a.Nom,
            Quantitestock = a.Quantitestock,
            Seuilminimum = a.Seuilminimum,
            AlerteStock = a.Quantitestock <= a.Seuilminimum
        };
    }

    // ================= FOURNISSEURS =================

    public async Task<FournisseurDto> AddFournisseur(FournisseurDto dto)
    {
        var entity = new Fournisseur
        {
            Nom = dto.Nom,
            Email = dto.Email,
            Telephone = dto.Telephone
        };

        await _fournisseurRepo.Add(entity);
        dto.Idfournisseur = entity.Idfournisseur;

        return dto;
    }

    public async Task<IEnumerable<FournisseurDto>> GetFournisseurs()
    {
        var list = await _fournisseurRepo.GetMuliple();

        return list.Select(f => new FournisseurDto
        {
            Idfournisseur = f.Idfournisseur,
            Nom = f.Nom,
            Email = f.Email,
            Telephone = f.Telephone
        });
    }

    public async Task<bool> UpdateFournisseur(int id, FournisseurDto dto)
    {
        var f = await _fournisseurRepo.GetById(id);
        if (f == null) return false;

        f.Nom = dto.Nom;
        f.Email = dto.Email;
        f.Telephone = dto.Telephone;

        await _fournisseurRepo.Update(f);
        return true;
    }

    public async Task<bool> DeleteFournisseur(int id)
    {
        if (!await _fournisseurRepo.Exists(f => f.Idfournisseur == id))
            return false;

        await _fournisseurRepo.Delete(id);
        return true;
    }

    // ================= CATEGORIES =================

    public async Task<CategorieDto> AddCategorie(CategorieDto dto)
    {
        var entity = new Categorie
        {
            Nom = dto.Nom,
            Description = dto.Description,
            Sexe = dto.Sexe,
            Typevetement = dto.Typevetement,
            Couleur = dto.Couleur
        };

        await _categorieRepo.Add(entity);
        dto.Idcategorie = entity.Idcategorie;

        return dto;
    }

    public async Task<IEnumerable<CategorieDto>> GetCategories()
    {
        var list = await _categorieRepo.GetMuliple();

        return list.Select(c => new CategorieDto
        {
            Idcategorie = c.Idcategorie,
            Nom = c.Nom,
            Description = c.Description,
            Sexe = c.Sexe,
            Typevetement = c.Typevetement,
            Couleur = c.Couleur
        });
    }

    public async Task<bool> UpdateCategorie(int id, CategorieDto dto)
    {
        var c = await _categorieRepo.GetById(id);
        if (c == null) return false;

        c.Nom = dto.Nom;
        c.Description = dto.Description;
        c.Sexe = dto.Sexe;
        c.Typevetement = dto.Typevetement;
        c.Couleur = dto.Couleur;

        await _categorieRepo.Update(c);
        return true;
    }

    public async Task<bool> DeleteCategorie(int id)
    {
        if (!await _categorieRepo.Exists(c => c.Idcategorie == id))
            return false;

        await _categorieRepo.Delete(id);
        return true;
    }

    // ================= DASHBOARD =================

    public async Task<DashboardStockDto> GetDashboard()
    {
        var articles = await _articleRepo.GetAll().ToListAsync();
        var articlesEnAlerte = articles.Count(a => a.Quantitestock <= a.Seuilminimum);

        return new DashboardStockDto
        {
            NombreArticles = articles.Count,
            NombreFournisseurs = await _fournisseurRepo.Count(),
            NombreCommandes = 0,
            NombreCommandesValidees = 0,
            NombreArticlesEnAlerte = articlesEnAlerte,
            ChiffreAffaires = 0
        };
    }

    // ================= HELPERS =================

    private string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Normalize text
        string slug = text.ToLowerInvariant();

        // Remove special characters and replace spaces with hyphens
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^\w\s-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", "-");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-");

        // Trim hyphens
        slug = slug.Trim('-');

        // Limit length to 160 characters
        if (slug.Length > 160)
            slug = slug.Substring(0, 160).TrimEnd('-');

        return slug;
    }
}