using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class CategoryService: ICategoryService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public CategoryService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }

        public async Task<Category> CreateNewCategory(Category newCategory, Guid orgId)
        {
            Category cat = new Category()
            {
                Id = Guid.NewGuid(),
                CategoryName = newCategory.CategoryName,
                OrgId = orgId
            };

            _context.Category.Add(cat);
            _context.SaveChanges();

            return cat;
        }

        public async Task<bool> UpdateCategory(string newValue, Guid categoryId, Guid orgId)
        {
            try
            {
                Category category =
                                 await _context.Category
                                 .Where(x => x.Id == categoryId && x.OrgId == orgId)
                                 .FirstOrDefaultAsync();
                category.CategoryName = newValue;
              
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return false;
            }


            return true;
        }
        public async Task<bool> DeleteCategory(Guid categoryId, Guid orgId)
        {
            try
            {
                Category category =
                                 await _context.Category
                                 .Where(x => x.Id == categoryId && x.OrgId == orgId)
                                 .FirstOrDefaultAsync();

                _context.Category.Remove(category);
                _context.SaveChanges();
            }
            catch(Exception ex)
            {
                return false;
            }
          

            return true;
        }
        public async Task<List<Category>> FindAllCategories(Guid orgId)
        {
            try
            {
                List<Category> categories =
                    await _context.Category
                    .Where(x => x.OrgId == orgId)
                    .ToListAsync();

                return categories;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> CreateNewCategoryMapping(Guid productId, Guid categoryId, Guid orgId)
        {
            var mapping = new ProductCategoryMapping
            {
                ProductId = productId,
                CategoryId = categoryId,
                Id = Guid.NewGuid()
            };

            _context.ProductCategoryMapping.Add(mapping);
            _context.SaveChanges();
            return true;
        }

        public async Task<bool> UpdateCategoryMappings(Guid productId, string[] categories, Guid orgId)
        {
            var currentMappings = _context.ProductCategoryMapping
                .Where(x => x.ProductId == productId)
                .ToListAsync();
            List<string> catStrings = categories.ToList();

            //REMOVE ANY CURRENT MAPPINGS THAT THE SENT DATA DOESN'T HAVE
            foreach(var cm in currentMappings.Result)
            {
                if (!catStrings.Contains(cm.CategoryId.ToString()))
                {
                    _context.ProductCategoryMapping.Remove(cm);
                }
            }

            //ADD ANY NEW MAPPINGS THAT DON'T ALREADY EXIST
            foreach(var cm in catStrings)
            {
                if(!currentMappings.Result.Any(x=>x.CategoryId == Guid.Parse(cm)))
                {
                    var mapping = new ProductCategoryMapping
                    {
                        ProductId = productId,
                        CategoryId = Guid.Parse(cm),
                        Id = Guid.NewGuid()

                    };

                    _context.ProductCategoryMapping.Add(mapping);
         
                }
            }

            _context.SaveChanges();
            return true;
        }
    }
}
