namespace Core.Entities;

public partial class ArticleFournisseur
{
    public int Idarticle { get; set; }

    public int Idfournisseur { get; set; }

    public virtual Article IdarticleNavigation { get; set; }

    public virtual Fournisseur IdfournisseurNavigation { get; set; }
}
