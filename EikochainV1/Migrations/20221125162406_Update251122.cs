using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EikochainV1.Migrations
{
    public partial class Update251122 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Steps",
                table: "SupplyChain",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Views",
                table: "SupplyChain",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Steps",
                table: "SupplyChain");

            migrationBuilder.DropColumn(
                name: "Views",
                table: "SupplyChain");
        }
    }
}
