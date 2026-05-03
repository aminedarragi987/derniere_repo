using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    [Migration("20260310120000_AddCategorieAttributes")]
    public partial class AddCategorieAttributes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "couleur",
                table: "categorie",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "sexe",
                table: "categorie",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "typevetement",
                table: "categorie",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "couleur",
                table: "categorie");

            migrationBuilder.DropColumn(
                name: "sexe",
                table: "categorie");

            migrationBuilder.DropColumn(
                name: "typevetement",
                table: "categorie");
        }
    }
}
