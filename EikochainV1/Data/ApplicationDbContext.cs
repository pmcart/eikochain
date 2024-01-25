using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Data
{
    public class ApplicationDbContext
    : IdentityDbContext<EikochainUser, ApplicationRole,
        string, IdentityUserClaim<string>,
        ApplicationUserRole, IdentityUserLogin<string>,
            IdentityRoleClaim<string>,
            IdentityUserToken<string>>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {

        }
        public DbSet<Organization> Organization { get; set; }  
        public DbSet<Product> Product { get; set; }
        public DbSet<Category> Category { get; set; }
        public DbSet<SupplyChain> SupplyChain { get; set; }
        public DbSet<SupplyChainStep> SupplyChainStep { get; set; }
        public DbSet<Setting> Setting { get; set; }

        public DbSet<ProductCategoryMapping> ProductCategoryMapping { get; set; } 
        public DbSet<Integration> Integration { get; set; }
        public DbSet<EikoQrCode> EikoQrCode { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId);

                userRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId);
            });
        }

    }
}