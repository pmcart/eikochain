using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface IProductService
    {
        public Task<bool> RemoveSupplyChainLinks(Guid orgId, Guid supplyChainId);
        public Task<bool> UpdateProductImageUrl(Guid productId, string imagePath);
        public Task<Product> CreateNewProduct(Product newProduct, Guid orgId);

        public Task<bool> EditProduct(Product editProduct, Guid orgId);

        public Task<bool> CreateNewProducts(List<Product> newProducts, Guid orgId);

        public Task<bool> CreateNewProductsByIntegration(List<Product> newProducts, Guid orgId);

        public Task<IEnumerable<Product>> GetAllProducts(Guid orgId);

        public Task<IEnumerable<Category>> GetAllCategories(Guid productId);

        public Task<Product> GetProduct(Guid orgId, Guid productId);

        public Task<Product> GetProductByExternalId(string externalId);
        public Task<string> GetAssignedSupplyChainId(Guid orgId, Guid prodSupplyChainId);
        public Task<bool> AssignSupplyChain(Guid orgId, Guid supplyChainId, Guid productId);

        public Task<bool> RemoveSupplyChain(Guid orgId, Guid supplyChainId, Guid productId);

        public Task<bool> AssignAllSupplyChain(Guid orgId, Guid supplyChainId);

        public Task<bool> DeleteProduct(Guid orgId, Guid productId);

        public Task<int> CountProducts(Guid orgId);
    }
}
