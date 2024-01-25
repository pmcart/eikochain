using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface ISupplyChainService
    {
        public Task<bool> DeleteSupplyChain(Guid id, Guid orgId);
        public Task<SupplyChain> GetSupplyChain(Guid id,Guid orgId);

        public Task<bool> UpdateSupplyChain(Guid id, Guid orgId, SupplyChain sc);
        public Task<IEnumerable<SupplyChain>> GetAllSupplyChains(Guid orgId);
        public Task<SupplyChain> CreateNewSupplyChain(SupplyChain newSupplyChain, Guid orgId);
        public Task<bool> UpdateSupplyChainPreview(SupplyChain sc, Guid orgId);
        public Task<bool> UpdateSupplyChainViews(SupplyChain sc);
        //public Task<bool> UpdateSupplyChainClicks(SupplyChain sc);
    }
}
