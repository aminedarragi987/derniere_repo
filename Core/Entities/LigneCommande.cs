namespace Core.Entities;

public partial class LigneCommande
{
    public int Idlignecommande { get; set; }

    public int Idcommande { get; set; }

    public int Idarticle { get; set; }

    public int Quantite { get; set; }

    public decimal Prixunitaire { get; set; }

    public decimal Montantligne { get; set; }

    public virtual Article IdarticleNavigation { get; set; } = null!;

    public virtual Commande IdcommandeNavigation { get; set; } = null!;
}