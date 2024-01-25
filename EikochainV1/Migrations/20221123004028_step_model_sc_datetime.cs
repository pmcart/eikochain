using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EikochainV1.Migrations
{
    public partial class step_model_sc_datetime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Steps",
                table: "SupplyChain");

            migrationBuilder.DropColumn(
                name: "Views",
                table: "SupplyChain");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "SupplyChain",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "QrViews",
                table: "SupplyChain",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WebsiteViews",
                table: "SupplyChain",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SupplyChainStep",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrgId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SupplyChainId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StepId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StepTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WebsiteClicks = table.Column<int>(type: "int", nullable: false),
                    QrClicks = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplyChainStep", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SupplyChainStep");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "SupplyChain");

            migrationBuilder.DropColumn(
                name: "QrViews",
                table: "SupplyChain");

            migrationBuilder.DropColumn(
                name: "WebsiteViews",
                table: "SupplyChain");

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
    }
}
