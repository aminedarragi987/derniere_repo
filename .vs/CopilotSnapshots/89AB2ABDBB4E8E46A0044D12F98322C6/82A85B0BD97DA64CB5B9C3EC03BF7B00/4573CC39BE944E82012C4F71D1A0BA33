using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Core.Entities;

public partial class IAMDbContext : DbContext
{
    public IAMDbContext()
    {
    }

    public IAMDbContext(DbContextOptions<IAMDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Profile> Profiles { get; set; }

    public virtual DbSet<Refreshtoken> Refreshtokens { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Utilisateur> Utilisateurs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=postgresdb;Port=5432;Database=IAM;Username=postgres;Password=data2010.");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.Idmenu).HasName("menu_pkey");

            entity.ToTable("menu");

            entity.Property(e => e.Idmenu).HasColumnName("idmenu");
            entity.Property(e => e.Description)
                .HasColumnType("character varying")
                .HasColumnName("description");
            entity.Property(e => e.Hassubmenu).HasColumnName("hassubmenu");
            entity.Property(e => e.MemHref)
                .HasColumnType("character varying")
                .HasColumnName("mem_href");
            entity.Property(e => e.MemIcon)
                .HasColumnType("character varying")
                .HasColumnName("mem_icon");
            entity.Property(e => e.MemRouterlink)
                .HasColumnType("character varying")
                .HasColumnName("mem_routerlink");
            entity.Property(e => e.MemTarget)
                .HasColumnType("character varying")
                .HasColumnName("mem_target");
            entity.Property(e => e.Parentid).HasColumnName("parentid");
            entity.Property(e => e.Titre)
                .HasColumnType("character varying")
                .HasColumnName("titre");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.Parentid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("menu_parentid_fkey");
        });

        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(e => e.Idprofil).HasName("pk_profile");

            entity.ToTable("profile");

            entity.Property(e => e.Idprofil).HasColumnName("idprofil");
            entity.Property(e => e.Description)
                .HasColumnType("character varying")
                .HasColumnName("description");
            entity.Property(e => e.Nom)
                .HasColumnType("character varying")
                .HasColumnName("nom");
        });

        modelBuilder.Entity<Refreshtoken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("refreshtoken_pkey");

            entity.ToTable("refreshtoken");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Expiresatutc)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("expiresatutc");
            entity.Property(e => e.Iduser).HasColumnName("iduser");
            entity.Property(e => e.Revoked).HasColumnName("revoked");
            entity.Property(e => e.Token)
                .HasColumnType("character varying")
                .HasColumnName("token");

            entity.HasOne(d => d.IduserNavigation).WithMany(p => p.Refreshtokens)
                .HasForeignKey(d => d.Iduser)
                .HasConstraintName("refreshtoken_iduser_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Idrole).HasName("roles_pkey");

            entity.ToTable("roles");

            entity.Property(e => e.Idrole).HasColumnName("idrole");
            entity.Property(e => e.Description)
                .HasColumnType("character varying")
                .HasColumnName("description");
            entity.Property(e => e.Idprofile).HasColumnName("idprofile");
            entity.Property(e => e.Idroleparent).HasColumnName("idroleparent");
            entity.Property(e => e.Nom)
                .HasColumnType("character varying")
                .HasColumnName("nom");

            entity.HasOne(d => d.IdprofileNavigation).WithMany(p => p.Roles)
                .HasForeignKey(d => d.Idprofile)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("roles_idprofile_fkey");

            entity.HasOne(d => d.IdroleparentNavigation).WithMany(p => p.InverseIdroleparentNavigation)
                .HasForeignKey(d => d.Idroleparent)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("roles_idroleparent_fkey");

            entity.HasMany(d => d.Idmenus).WithMany(p => p.Idroles)
                .UsingEntity<Dictionary<string, object>>(
                    "Lstmenu",
                    r => r.HasOne<Menu>().WithMany()
                        .HasForeignKey("Idmenu")
                        .HasConstraintName("lstmenu_idmenu_fkey"),
                    l => l.HasOne<Role>().WithMany()
                        .HasForeignKey("Idrole")
                        .HasConstraintName("lstmenu_idrole_fkey"),
                    j =>
                    {
                        j.HasKey("Idrole", "Idmenu").HasName("pk_lst");
                        j.ToTable("lstmenu");
                        j.IndexerProperty<int>("Idrole").HasColumnName("idrole");
                        j.IndexerProperty<int>("Idmenu").HasColumnName("idmenu");
                    });
        });

        modelBuilder.Entity<Utilisateur>(entity =>
        {
            entity.HasKey(e => e.Iduser).HasName("utilisateur_pkey");

            entity.ToTable("utilisateur");

            entity.HasIndex(e => e.Email, "utilisateur_email_key").IsUnique();

            entity.HasIndex(e => e.Username, "utilisateur_username_key").IsUnique();

            entity.Property(e => e.Iduser).HasColumnName("iduser");
            entity.Property(e => e.Email)
                .HasColumnType("character varying")
                .HasColumnName("email");
            entity.Property(e => e.Idrole).HasColumnName("idrole");
            entity.Property(e => e.Motpass)
                .HasColumnType("character varying")
                .HasColumnName("motpass");
            entity.Property(e => e.Nom)
                .HasColumnType("character varying")
                .HasColumnName("nom");
            entity.Property(e => e.Telephone)
                .HasColumnType("character varying")
                .HasColumnName("telephone");
            entity.Property(e => e.Username)
                .HasColumnType("character varying")
                .HasColumnName("username");

            entity.HasOne(d => d.IdroleNavigation).WithMany(p => p.Utilisateurs)
                .HasForeignKey(d => d.Idrole)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("utilisateur_idrole_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
