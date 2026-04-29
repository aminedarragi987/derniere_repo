using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class AddArticleAttributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorie",
                columns: table => new
                {
                    idcategorie = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying", nullable: false),
                    description = table.Column<string>(type: "character varying", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("categorie_pkey", x => x.idcategorie);
                });

            migrationBuilder.CreateTable(
                name: "client",
                columns: table => new
                {
                    idclient = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying", nullable: false),
                    email = table.Column<string>(type: "character varying", nullable: true),
                    telephone = table.Column<string>(type: "character varying", nullable: true),
                    adresse = table.Column<string>(type: "character varying", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("client_pkey", x => x.idclient);
                });

            migrationBuilder.CreateTable(
                name: "fournisseur",
                columns: table => new
                {
                    idfournisseur = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying", nullable: false),
                    email = table.Column<string>(type: "character varying", nullable: true),
                    telephone = table.Column<string>(type: "character varying", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("fournisseur_pkey", x => x.idfournisseur);
                });

            migrationBuilder.CreateTable(
                name: "menu",
                columns: table => new
                {
                    idmenu = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titre = table.Column<string>(type: "character varying", nullable: false),
                    description = table.Column<string>(type: "character varying", nullable: false),
                    mem_routerlink = table.Column<string>(type: "character varying", nullable: false),
                    mem_href = table.Column<string>(type: "character varying", nullable: false),
                    mem_icon = table.Column<string>(type: "character varying", nullable: false),
                    mem_target = table.Column<string>(type: "character varying", nullable: false),
                    hassubmenu = table.Column<bool>(type: "boolean", nullable: true),
                    parentid = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("menu_pkey", x => x.idmenu);
                    table.ForeignKey(
                        name: "menu_parentid_fkey",
                        column: x => x.parentid,
                        principalTable: "menu",
                        principalColumn: "idmenu",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "profile",
                columns: table => new
                {
                    idprofil = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying", nullable: false),
                    description = table.Column<string>(type: "character varying", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_profile", x => x.idprofil);
                });

            migrationBuilder.CreateTable(
                name: "article",
                columns: table => new
                {
                    idarticle = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying", nullable: false),
                    description = table.Column<string>(type: "character varying", nullable: true),
                    prix = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    quantitestock = table.Column<int>(type: "integer", nullable: false),
                    seuilminimum = table.Column<int>(type: "integer", nullable: false),
                    sexe = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    typevetement = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    marque = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    couleur = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    taille = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    idcategorie = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("article_pkey", x => x.idarticle);
                    table.ForeignKey(
                        name: "article_idcategorie_fkey",
                        column: x => x.idcategorie,
                        principalTable: "categorie",
                        principalColumn: "idcategorie",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "commande",
                columns: table => new
                {
                    idcommande = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    datecommande = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    idclient = table.Column<int>(type: "integer", nullable: false),
                    totalcommande = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    statut = table.Column<string>(type: "character varying", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("commande_pkey", x => x.idcommande);
                    table.ForeignKey(
                        name: "commande_idclient_fkey",
                        column: x => x.idclient,
                        principalTable: "client",
                        principalColumn: "idclient",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    idrole = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying", nullable: false),
                    description = table.Column<string>(type: "character varying", nullable: false),
                    idprofile = table.Column<int>(type: "integer", nullable: true),
                    idroleparent = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("roles_pkey", x => x.idrole);
                    table.ForeignKey(
                        name: "roles_idprofile_fkey",
                        column: x => x.idprofile,
                        principalTable: "profile",
                        principalColumn: "idprofil",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "roles_idroleparent_fkey",
                        column: x => x.idroleparent,
                        principalTable: "roles",
                        principalColumn: "idrole",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "article_fournisseur",
                columns: table => new
                {
                    idarticle = table.Column<int>(type: "integer", nullable: false),
                    idfournisseur = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("article_fournisseur_pkey", x => new { x.idarticle, x.idfournisseur });
                    table.ForeignKey(
                        name: "article_fournisseur_idarticle_fkey",
                        column: x => x.idarticle,
                        principalTable: "article",
                        principalColumn: "idarticle",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "article_fournisseur_idfournisseur_fkey",
                        column: x => x.idfournisseur,
                        principalTable: "fournisseur",
                        principalColumn: "idfournisseur",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "facture",
                columns: table => new
                {
                    idfacture = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idcommande = table.Column<int>(type: "integer", nullable: false),
                    datefacture = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    montantttc = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    statut = table.Column<string>(type: "character varying", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("facture_pkey", x => x.idfacture);
                    table.ForeignKey(
                        name: "facture_idcommande_fkey",
                        column: x => x.idcommande,
                        principalTable: "commande",
                        principalColumn: "idcommande",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ligne_commande",
                columns: table => new
                {
                    idlignecommande = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idcommande = table.Column<int>(type: "integer", nullable: false),
                    idarticle = table.Column<int>(type: "integer", nullable: false),
                    quantite = table.Column<int>(type: "integer", nullable: false),
                    prixunitaire = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    montantligne = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ligne_commande_pkey", x => x.idlignecommande);
                    table.ForeignKey(
                        name: "ligne_commande_idarticle_fkey",
                        column: x => x.idarticle,
                        principalTable: "article",
                        principalColumn: "idarticle",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "ligne_commande_idcommande_fkey",
                        column: x => x.idcommande,
                        principalTable: "commande",
                        principalColumn: "idcommande",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "livraison",
                columns: table => new
                {
                    idlivraison = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idcommande = table.Column<int>(type: "integer", nullable: false),
                    datelivraison = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    adresse = table.Column<string>(type: "character varying", nullable: true),
                    statut = table.Column<string>(type: "character varying", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("livraison_pkey", x => x.idlivraison);
                    table.ForeignKey(
                        name: "livraison_idcommande_fkey",
                        column: x => x.idcommande,
                        principalTable: "commande",
                        principalColumn: "idcommande",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "lstmenu",
                columns: table => new
                {
                    idrole = table.Column<int>(type: "integer", nullable: false),
                    idmenu = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lst", x => new { x.idrole, x.idmenu });
                    table.ForeignKey(
                        name: "lstmenu_idmenu_fkey",
                        column: x => x.idmenu,
                        principalTable: "menu",
                        principalColumn: "idmenu",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "lstmenu_idrole_fkey",
                        column: x => x.idrole,
                        principalTable: "roles",
                        principalColumn: "idrole",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "utilisateur",
                columns: table => new
                {
                    iduser = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "character varying", nullable: false),
                    username = table.Column<string>(type: "character varying", nullable: false),
                    motpass = table.Column<string>(type: "character varying", nullable: false),
                    email = table.Column<string>(type: "character varying", nullable: false),
                    telephone = table.Column<string>(type: "character varying", nullable: false),
                    idrole = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("utilisateur_pkey", x => x.iduser);
                    table.ForeignKey(
                        name: "utilisateur_idrole_fkey",
                        column: x => x.idrole,
                        principalTable: "roles",
                        principalColumn: "idrole",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "paiement",
                columns: table => new
                {
                    idpaiement = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    idfacture = table.Column<int>(type: "integer", nullable: false),
                    datepaiement = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    montant = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    modepaiement = table.Column<string>(type: "character varying", nullable: true),
                    reference = table.Column<string>(type: "character varying", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("paiement_pkey", x => x.idpaiement);
                    table.ForeignKey(
                        name: "paiement_idfacture_fkey",
                        column: x => x.idfacture,
                        principalTable: "facture",
                        principalColumn: "idfacture",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "refreshtoken",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    token = table.Column<string>(type: "character varying", nullable: false),
                    expiresatutc = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    revoked = table.Column<bool>(type: "boolean", nullable: true),
                    iduser = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("refreshtoken_pkey", x => x.id);
                    table.ForeignKey(
                        name: "refreshtoken_iduser_fkey",
                        column: x => x.iduser,
                        principalTable: "utilisateur",
                        principalColumn: "iduser");
                });

            migrationBuilder.CreateIndex(
                name: "IX_article_idcategorie",
                table: "article",
                column: "idcategorie");

            migrationBuilder.CreateIndex(
                name: "IX_article_fournisseur_idfournisseur",
                table: "article_fournisseur",
                column: "idfournisseur");

            migrationBuilder.CreateIndex(
                name: "categorie_nom_key",
                table: "categorie",
                column: "nom",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "client_email_key",
                table: "client",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_commande_idclient",
                table: "commande",
                column: "idclient");

            migrationBuilder.CreateIndex(
                name: "facture_idcommande_key",
                table: "facture",
                column: "idcommande",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ligne_commande_idarticle",
                table: "ligne_commande",
                column: "idarticle");

            migrationBuilder.CreateIndex(
                name: "ligne_commande_idcommande_idarticle_key",
                table: "ligne_commande",
                columns: new[] { "idcommande", "idarticle" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "livraison_idcommande_key",
                table: "livraison",
                column: "idcommande",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_lstmenu_idmenu",
                table: "lstmenu",
                column: "idmenu");

            migrationBuilder.CreateIndex(
                name: "IX_menu_parentid",
                table: "menu",
                column: "parentid");

            migrationBuilder.CreateIndex(
                name: "IX_paiement_idfacture",
                table: "paiement",
                column: "idfacture");

            migrationBuilder.CreateIndex(
                name: "IX_refreshtoken_iduser",
                table: "refreshtoken",
                column: "iduser");

            migrationBuilder.CreateIndex(
                name: "IX_roles_idprofile",
                table: "roles",
                column: "idprofile");

            migrationBuilder.CreateIndex(
                name: "IX_roles_idroleparent",
                table: "roles",
                column: "idroleparent");

            migrationBuilder.CreateIndex(
                name: "IX_utilisateur_idrole",
                table: "utilisateur",
                column: "idrole");

            migrationBuilder.CreateIndex(
                name: "utilisateur_email_key",
                table: "utilisateur",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "utilisateur_username_key",
                table: "utilisateur",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "article_fournisseur");

            migrationBuilder.DropTable(
                name: "ligne_commande");

            migrationBuilder.DropTable(
                name: "livraison");

            migrationBuilder.DropTable(
                name: "lstmenu");

            migrationBuilder.DropTable(
                name: "paiement");

            migrationBuilder.DropTable(
                name: "refreshtoken");

            migrationBuilder.DropTable(
                name: "fournisseur");

            migrationBuilder.DropTable(
                name: "article");

            migrationBuilder.DropTable(
                name: "menu");

            migrationBuilder.DropTable(
                name: "facture");

            migrationBuilder.DropTable(
                name: "utilisateur");

            migrationBuilder.DropTable(
                name: "categorie");

            migrationBuilder.DropTable(
                name: "commande");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "client");

            migrationBuilder.DropTable(
                name: "profile");
        }
    }
}
