using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class ProductService: IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public ProductService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }
        public async Task<Product> CreateNewProduct(Product newProduct, Guid orgId)
        {
            Product prod = new Product()
            {
                Id = Guid.NewGuid(),
                ProductName = newProduct.ProductName,
                ProductDescription = newProduct.ProductDescription,
                //Category = _context.Category.Where(x => x.Id == newProduct.CategoryId).FirstOrDefault(),
                ProductSize = newProduct.ProductSize,
                OrgId = orgId,
                Url = newProduct.Url
            };

            _context.Product.Add(prod);
            _context.SaveChanges();

            return prod;
        }

        public async Task<bool> EditProduct(Product editProduct, Guid orgId)
        {
            var product = _context.Product.FirstOrDefault(item => item.Id == editProduct.Id);

            // Validate entity is not null
            if (product != null)
            {
                product.ProductName = editProduct.ProductName;
                product.ProductDescription = editProduct.ProductDescription;
                //Category = _context.Category.Where(x => x.Id == newProduct.CategoryId).FirstOrDefault(),
                product.Url = editProduct.Url;

                _context.SaveChanges();
                return true;
            }
            else
            return false;
         
        }

        public async Task<bool> CreateNewProducts(List<Product> newProducts, Guid orgId)
        {
            try
            {
                foreach (Product newProduct in newProducts)
                {
                    Product prod = new Product()
                    {
                        Id = Guid.NewGuid(),
                        ExternalId = newProduct.ExternalId,
                        Url = newProduct.Url,
                        ProductImage = newProduct.ProductImage,
                        ProductDescription = newProduct.ProductDescription,
                        Type = newProduct.Type,
                        Weight = newProduct.Weight,
                        Tags = newProduct.Tags,
                        ProductName = newProduct.ProductName,
                        //Category = _context.Category.Where(x => x.Id == newProduct.CategoryId).FirstOrDefault(),
                        ProductSize = newProduct.ProductSize,
                        OrgId = orgId
                    };

                    _context.Product.Add(prod);
                }

                _context.SaveChanges();

            }
            catch (Exception ex)
            {
                return false;
            }
      
            return true;
        }

        public async Task<bool> CreateNewProductsByIntegration(List<Product> newProducts, Guid orgId)
        {
            try
            {
                foreach (Product newProduct in newProducts)
                {
                    Product prod = new Product()
                    {
                        Id = Guid.NewGuid(),
                        ExternalId = newProduct.ExternalId,
                        Url = newProduct.Url,
                        ProductImage = newProduct.ProductImage,
                        ProductDescription = newProduct.ProductDescription,
                        Type = newProduct.Type,
                        ProductName = newProduct.ProductName,
                        IntegrationType = "1",//shopify
                        IsIntegration = true,
                        //Category = _context.Category.Where(x => x.Id == newProduct.CategoryId).FirstOrDefault(),
                        ProductSize = newProduct.ProductSize,
                        Weight = newProduct.Weight,
                        Tags = newProduct.Tags,
                        OrgId = orgId
                    };

                    _context.Product.Add(prod);
                }

                _context.SaveChanges();

            }
            catch (Exception ex)
            {
                return false;
            }

            return true;
        }
        public async Task<bool> UpdateProductImageUrl(Guid productId,string imagePath)
        {
            try
            {
                Product product = await _context.Product.Where(x => x.Id == productId).FirstOrDefaultAsync();
                product.ProductImage = imagePath;
            }
            catch (Exception ex)
            {
                return false;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Product>> GetAllProducts(Guid orgId)
        {
            try
            {
                var products = await _context.Product.Where(x => x.OrgId == orgId)
                    //.Include(x => x.Category)
                    //.Include(x => x.SupplyChain)
                    .ToListAsync();

                return products;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<Product> GetProduct(Guid orgId, Guid productId)
        {
            try
            {
                if(orgId != Guid.Empty)
                {
                    var product = await _context.Product.Where(x => x.OrgId == orgId && x.Id == productId)
              //.Include(x => x.Category)
              .FirstOrDefaultAsync();
                    return product;
                }
                else
                {
                    var product = await _context.Product.Where(x => x.Id == productId)
              //.Include(x => x.Category)
              .FirstOrDefaultAsync();
                    return product;
                }
          
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<Product> GetProductByExternalId(string externalId)
        {
            try
            {
                var product = await _context.Product.Where(x => x.ExternalId == externalId && x.SupplyChainId != null)
                    .FirstAsync();
                return product;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<bool> DeleteProduct(Guid orgId, Guid productId)
        {
            try
            {
                var product = await _context.Product.Where(x => x.OrgId == orgId && x.Id == productId)
                    .FirstOrDefaultAsync();

                _context.Product.Remove(product);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<IEnumerable<Category>> GetAllCategories(Guid productId)
        {
            var categories = new List<Category>();
            var pcms = await _context.ProductCategoryMapping.
                Where(x => x.ProductId == productId).ToListAsync();

            foreach(var pcm in pcms)
            {
                var cat = await _context.Category.
                    Where(x => x.Id == pcm.CategoryId).FirstOrDefaultAsync();

                categories.Add(cat);
            }
            return categories;
        }
        public async Task<bool> AssignSupplyChain(Guid orgId, Guid supplyChainId, Guid productId)
        {
            try
            {
                var product = await _context.Product.Where(x => x.OrgId == orgId && x.Id == productId)
                    .SingleOrDefaultAsync();

                product.SupplyChainId = supplyChainId;
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> RemoveSupplyChain(Guid orgId, Guid supplyChainId, Guid productId)
        {
            try
            {
                var product = await _context.Product.Where(x => x.OrgId == orgId && x.Id == productId)
                    .SingleOrDefaultAsync();

                product.SupplyChainId = null;
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> AssignAllSupplyChain(Guid orgId, Guid supplyChainId)
        {
            try
            {
                var products = await _context.Product.Where(x => x.OrgId == orgId)
                    .ToListAsync();

                foreach(Product p in products)
                {
                    p.SupplyChainId = supplyChainId;
                }
               
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<string> GetAssignedSupplyChainId(Guid orgId, Guid prodSupplyChainId)
        {
            try
            {
                var sc = await _context.SupplyChain.Where(x => x.OrgId == orgId && x.Id == prodSupplyChainId)
                    //.Include(x => x.Category)
                    .FirstOrDefaultAsync();
                return sc.Id.ToString();
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<bool> RemoveSupplyChainLinks(Guid orgId, Guid supplyChainId)
        {
            try
            {
                var products = await _context.Product.Where(x => x.OrgId == orgId && x.SupplyChainId == supplyChainId)
                    .ToListAsync();
                foreach(Product product in products)
                {
                    product.SupplyChainId = null;
                }
  
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<int> CountProducts(Guid orgId)
        {
            return _context.Product.Where(x => x.OrgId == orgId).Count();
        }

    }
}
