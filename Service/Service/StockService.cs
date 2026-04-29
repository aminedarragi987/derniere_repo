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
        var entity = new Article
        {
            Nom = dto.Nom,
            Description = dto.Description,
            Prix = dto.Prix,
            Quantitestock = dto.Quantitestock,
            Seuilminimum = dto.Seuilminimum,
            Idcategorie = dto.Idcategorie
        };

        await _articleRepo.Add(entity);
        dto.Idarticle = entity.Idarticle;

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
        entity.Idcategorie = dto.Idcategorie;

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
        var query = _articleRepo.GetAll().AsQueryable();

        if (!string.IsNullOrEmpty(filter.Search))
            query = query.Where(a => a.Nom.Contains(filter.Search));

        var list = await query.ToListAsync();

        return list.Select(a => new ArticleDto
        {
            Idarticle = a.Idarticle,
            Nom = a.Nom,
            Description = a.Description,
            Prix = a.Prix,
            Quantitestock = a.Quantitestock,
            Seuilminimum = a.Seuilminimum,
            Idcategorie = a.Idcategorie
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
            Description = dto.Description
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
            Description = c.Description
        });
    }

    public async Task<bool> UpdateCategorie(int id, CategorieDto dto)
    {
        var c = await _categorieRepo.GetById(id);
        if (c == null) return false;

        c.Nom = dto.Nom;
        c.Description = dto.Description;

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
        return new DashboardStockDto
        {
            NombreArticles = await _articleRepo.Count(),
            NombreFournisseurs = await _fournisseurRepo.Count()
        };
    }
}