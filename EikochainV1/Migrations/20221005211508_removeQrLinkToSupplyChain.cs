using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EikochainV1.Migrations
{
    public partial class removeQrLinkToSupplyChain : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EikoQrCode_SupplyChain_SupplyChainId",
                table: "EikoQrCode");

            migrationBuilder.DropIndex(
                name: "IX_EikoQrCode_SupplyChainId",
                table: "EikoQrCode");

            migrationBuilder.AlterColumn<Guid>(
                name: "SupplyChainId",
                table: "EikoQrCode",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "SupplyChainId",
                table: "EikoQrCode",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EikoQrCode_SupplyChainId",
                table: "EikoQrCode",
                column: "SupplyChainId");

            migrationBuilder.AddForeignKey(
                name: "FK_EikoQrCode_SupplyChain_SupplyChainId",
                table: "EikoQrCode",
                column: "SupplyChainId",
                principalTable: "SupplyChain",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
