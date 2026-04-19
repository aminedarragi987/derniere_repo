using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class Menu
{
    public int Idmenu { get; set; }

    public string Titre { get; set; }

    public string Description { get; set; }

    public string MemRouterlink { get; set; }

    public string MemHref { get; set; }

    public string MemIcon { get; set; }

    public string MemTarget { get; set; }

    public bool? Hassubmenu { get; set; }

    public int? Parentid { get; set; }

    public virtual ICollection<Menu> InverseParent { get; set; } = new List<Menu>();

    public virtual Menu Parent { get; set; }

    public virtual ICollection<Role> Idroles { get; set; } = new List<Role>();
}
