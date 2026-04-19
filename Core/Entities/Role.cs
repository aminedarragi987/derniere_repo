using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class Role
{
    public int Idrole { get; set; }

    public string Nom { get; set; }

    public string Description { get; set; }

    public int? Idprofile { get; set; }

    public int? Idroleparent { get; set; }

    public virtual Profile IdprofileNavigation { get; set; }

    public virtual Role IdroleparentNavigation { get; set; }

    public virtual ICollection<Role> InverseIdroleparentNavigation { get; set; } = new List<Role>();

    public virtual ICollection<Utilisateur> Utilisateurs { get; set; } = new List<Utilisateur>();

    public virtual ICollection<Menu> Idmenus { get; set; } = new List<Menu>();
}
