using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class Profile
{
    public int Idprofil { get; set; }

    public string Nom { get; set; }

    public string Description { get; set; }

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
