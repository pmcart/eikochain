using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface IOrganizationService
    {
        public Task<Guid> CreateNewOrg(string orgName, string ownerEmail);
        public Task<Organization> GetOrg(Guid orgId);
        public Task<bool> UpdateLogoUrl(Guid orgId, string imagePath);

    }
}
