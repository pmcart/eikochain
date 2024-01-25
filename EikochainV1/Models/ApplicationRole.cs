using Microsoft.AspNetCore.Identity;

namespace EikochainV1.Models
{
    public class ApplicationRole : IdentityRole
    {
        public ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}