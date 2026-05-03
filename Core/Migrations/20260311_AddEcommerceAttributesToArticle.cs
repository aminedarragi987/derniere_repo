using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class AddEcommerceAttributesToArticle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "imageurl",
                table: "article",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "sku",
                table: "article",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "statut",
                table: "article",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                defaultValue: "Actif");

            migrationBuilder.AddColumn<string>(
                name: "slug",
                table: "article",
                type: "character varying(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isfeatured",
                table: "article",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "matiere",
                table: "article",
                type: "character varying(80)",
                maxLength: 80,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "imageurl",
                table: "article");

            migrationBuilder.DropColumn(
                name: "sku",
                table: "article");

            migrationBuilder.DropColumn(
                name: "statut",
                table: "article");

            migrationBuilder.DropColumn(
                name: "slug",
                table: "article");

            migrationBuilder.DropColumn(
                name: "isfeatured",
                table: "article");

            migrationBuilder.DropColumn(
                name: "matiere",
                table: "article");
        }
    }
}
