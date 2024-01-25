using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EikochainV1.Migrations
{
    public partial class product_tags_weight : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Product",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "Product",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Product");
        }
    }
}
