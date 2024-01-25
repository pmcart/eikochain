using Microsoft.AspNetCore.Identity;

namespace EikochainV1.Models
{
    public class ApplicationUserRole : IdentityUserRole<string>
    {
        public virtual EikochainUser User { get; set; }
        public virtual ApplicationRole Role { get; set; }
    }
}