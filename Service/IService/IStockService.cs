using Service.DTO;

namespace Service.IService;

public interface IStockService
{
    // ===== ARTICLES =====
    Task<ArticleDto> AddArticle(ArticleDto dto);
    Task<bool> UpdateArticle(int id, ArticleDto dto);
    Task<bool> DeleteArticle(int id);
    Task<IEnumerable<ArticleDto>> GetArticles(ArticleFilterDto filter);
    Task<StockNiveauDto?> GetStockNiveau(int idArticle);

    // ===== FOURNISSEURS =====
    Task<FournisseurDto> AddFournisseur(FournisseurDto dto);
    Task<IEnumerable<FournisseurDto>> GetFournisseurs();
    Task<bool> UpdateFournisseur(int id, FournisseurDto dto);
    Task<bool> DeleteFournisseur(int id);

    // ===== CATEGORIES =====
    Task<CategorieDto> AddCategorie(CategorieDto dto);
    Task<IEnumerable<CategorieDto>> GetCategories();
    Task<bool> UpdateCategorie(int id, CategorieDto dto);
    Task<bool> DeleteCategorie(int id);

    // ===== DASHBOARD =====
    Task<DashboardStockDto> GetDashboard();
}