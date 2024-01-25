using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface IIntegrationService
    {
        public Task<bool> CreateIntegration(Integration integration);
        public Task<Integration> GetIntegration(Guid orgId, Guid IntegrationId);
        public Task<List<Integration>> GetIntegrations(Guid orgIds);
    }
}
