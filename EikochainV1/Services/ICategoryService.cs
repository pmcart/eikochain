using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface ICategoryService
    {
        public Task<List<Category>> FindAllCategories(Guid orgId);
        public Task<Category> CreateNewCategory(Category newCategory, Guid orgId);

        public Task<bool> UpdateCategory(string newValue, Guid categoryId, Guid orgId);
        public Task<bool> DeleteCategory(Guid categoryId, Guid orgId);

        public Task<bool> UpdateCategoryMappings(Guid productId, string[] categories, Guid orgId);

        public Task<bool> CreateNewCategoryMapping(Guid productId, Guid categoryId, Guid orgId);
    }
}
