using System;
using System.Collections.Generic;

namespace Core.Entities;

public partial class Refreshtoken
{
    public int Id { get; set; }

    public string Token { get; set; }

    public DateTime? Expiresatutc { get; set; }

    public bool? Revoked { get; set; }

    public int? Iduser { get; set; }

    public virtual Utilisateur IduserNavigation { get; set; }
}
