using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface ISupplyChainStepService
    {
        public Task<SupplyChainStep> CreateSCStep(Guid scId, Guid orgId, SupplyChainStep newStep);
        public Task<bool> UpdateSCStep(Guid scId, Guid orgId, string stepId, SupplyChainStep editStep);
        public Task<bool> DeleteSCStep(Guid scId, Guid orgId, string stepId);
        public Task<bool> DeleteAllSCStep(Guid scId, Guid orgId);
        public Task<SupplyChainStep> GetSCStep(Guid scId, Guid orgId, string stepId);
        public Task<bool> UpdateSCStepClicks(SupplyChainStep step);
        public Task<IEnumerable<SupplyChainStep>> GetAllSCSteps(Guid scId, Guid orgId);        
        
    }
}
