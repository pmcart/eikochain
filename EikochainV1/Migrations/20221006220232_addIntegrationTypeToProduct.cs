using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EikochainV1.Migrations
{
    public partial class addIntegrationTypeToProduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IntegrationType",
                table: "Product",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IntegrationType",
                table: "Product");
        }
    }
}
