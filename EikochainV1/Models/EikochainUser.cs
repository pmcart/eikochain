using Microsoft.AspNetCore.Identity;

namespace EikochainV1.Models
{
    public class EikochainUser:IdentityUser
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public Guid OrganizationId { get; set; }

        public ICollection<ApplicationUserRole> UserRoles { get; set; }
    }
}