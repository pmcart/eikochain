using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MimeKit;
using QRCoder;
using System.Diagnostics;
using System.Drawing;
using System.Text.RegularExpressions;
using System.Web;

namespace EikochainV1.Controllers
{
    public class ProductsController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private BlobStorageService objBlobService;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IProductService _productService;
        private readonly ISupplyChainService _supplyChainService;
        private readonly ICategoryService _categoryService;
        public ProductsController(ILogger<HomeController> logger,
            IConfiguration config,
            UserManager<EikochainUser> userManager, IProductService productService, ICategoryService categoryService
            , ISupplyChainService supplyChainService)
        {
            _config = config;
            _logger = logger;
            _userManager = userManager;
            objBlobService = new BlobStorageService(_config);
            _productService = productService;
            _categoryService = categoryService;
            _supplyChainService = supplyChainService;
        }

        [Authorize]

        public async Task<IActionResult> IndexAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var products = _productService.GetAllProducts(user.OrganizationId).Result;

            if (products != null)
            {
                foreach (Product p in products)
                {
                    var ct = await _productService.GetAllCategories(p.Id);
                    p.CategoryNames = ct.Select(x => x.CategoryName).ToList();

                    if (p.SupplyChainId != null)
                    {
                        var supIdStr = p.SupplyChainId.ToString();
                        var supId = Guid.Parse(supIdStr);
                        var sc = await _supplyChainService.GetSupplyChain(supId, user.OrganizationId);
                        p.SupplyChain = sc;
                    }
                
                }
            }
            else
                products = new List<Product>();
       
            return View(products);
        }

        [Authorize]

        public async Task<IActionResult> Edit(string ProductId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var guidStr = Guid.Parse(ProductId);
            var product = _productService.GetProduct(user.OrganizationId, guidStr).Result;
            List<SelectListItem> categories = new List<SelectListItem>();

            List<Category> catList = _categoryService.FindAllCategories(user.OrganizationId).Result;
            List<Category> mappings = _productService.GetAllCategories(product.Id).Result.ToList();

            foreach (var cat in catList)
            {
                categories.Add(new SelectListItem(cat.CategoryName, cat.Id.ToString()));
            }
            ViewBag.CategoryList = categories;
            ViewBag.ProductCategories = mappings;

            Console.WriteLine(product.ProductDescription);
            if (product.ProductDescription != null)
            {
                product.ProductDescription = Regex.Replace(product.ProductDescription, "<.*?>", String.Empty);
            }
            
            return View(product);
        }

        [Authorize]

        public async Task<IActionResult> Delete(string ProductId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var guidStr = Guid.Parse(ProductId);
            var result = await _productService.DeleteProduct(user.OrganizationId, guidStr);
            return Json(result);
        }

        [Authorize]

        public async Task<IActionResult> AssignSupplyChain(string SupplyChainId, string ProductId, bool AssignToAll)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var scGuid = Guid.Parse(SupplyChainId);
            var prodGuid = Guid.Parse(ProductId);
            var result = false;

            if (!AssignToAll)
                result = await _productService.AssignSupplyChain(user.OrganizationId, scGuid, prodGuid);
            else
                result = await _productService.AssignAllSupplyChain(user.OrganizationId, scGuid);
            
            return Json(result);
        }

        public async Task<IActionResult> RemoveSupplyChain(string SupplyChainId, string ProductId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var scGuid = Guid.Parse(SupplyChainId);
            var prodGuid = Guid.Parse(ProductId);
            var result = false;

            result = await _productService.RemoveSupplyChain(user.OrganizationId, scGuid, prodGuid);

            return Json(result);
        }

        [Authorize]
        public IActionResult Add()
        {
            var user = _userManager.GetUserAsync(User);
            List<SelectListItem> categories = new List<SelectListItem>();

            List<Category> catList = _categoryService.FindAllCategories(user.Result.OrganizationId).Result;

            foreach (var cat in catList)
            {
                categories.Add(new SelectListItem(cat.CategoryName, cat.Id.ToString()));
            }
            ViewBag.CategoryList = categories;
            return View();
        }

        [Authorize]
        [HttpPost]
        public async Task<JsonResult> Add(Product product, IFormFile imgFile, string categoryList)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            
            var newProduct = await _productService.CreateNewProduct(product, user.OrganizationId);
            if (newProduct != null)
            {
                if (imgFile != null)
                {
                    if (imgFile.FileName.Length > 0)
                    {
                        var fileExtension = "";

                        MimeTypes.TryGetExtension(MimeTypes.GetMimeType(imgFile.FileName), out fileExtension);
                        var fileUploadName = Guid.NewGuid().ToString() + fileExtension;
                        var imagePath = await objBlobService.UploadImageAsync(imgFile, fileUploadName);
                        var imageUpdated = await _productService.UpdateProductImageUrl(newProduct.Id, imagePath);
                    }
                }
                
                //if (categoryList.Length != 0)
                //{
                //    var strArray = categoryList.Split(",");

                //    foreach (string s in strArray)
                //    {
                //        await _categoryService.CreateNewCategoryMapping(newProduct.Id, Guid.Parse(s), user.OrganizationId);
                //    }
                //}               

                return Json(new { success = true, responseText = "Product has been created" });
            }
            else
            {
                return Json(new { success = false, responseText = "Product was not created" });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<JsonResult> Edit(Product product, IFormFile imgFile, string categoryList)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var strArray = Array.Empty<string>();
            var success = await _productService.EditProduct(product, user.OrganizationId);
            if (success)
            {
                if (imgFile != null && imgFile.FileName.Length > 0)
                {
                    var fileExtension = "";

                    MimeTypes.TryGetExtension(MimeTypes.GetMimeType(imgFile.FileName), out fileExtension);
                    var fileUploadName = Guid.NewGuid().ToString() + fileExtension;
                    var imagePath = await objBlobService.UploadImageAsync(imgFile, fileUploadName);
                    var imageUpdated = await _productService.UpdateProductImageUrl(product.Id, imagePath);
                }
                if(categoryList != null && categoryList != String.Empty)
                {
                    strArray = categoryList.Split(",");
                    await _categoryService.UpdateCategoryMappings(product.Id, strArray, user.OrganizationId);
                }
               
                return Json(new { success = true, responseText = "Product has been updated" });
            }
            else
            {
                return Json(new { success = false, responseText = "Product was not updated" });
            }
        }

        [Authorize]
        [RequestSizeLimit(100_000_000)]
        public async Task<string> FileUploadAsync(IFormFile file)
        {
            try
            {
                if (file != null)
                {

                    if (file.FileName.Length > 0)
                    {
                        var fileExtension = "";
                        var imgId = Guid.NewGuid().ToString();
                        var userId = _userManager.GetUserId(HttpContext.User);
                        MimeTypes.TryGetExtension(MimeTypes.GetMimeType(file.FileName), out fileExtension);
                        var fileUploadName = imgId + fileExtension;
                        var imagePath = await objBlobService.UploadImageAsync(file, fileUploadName);
                        return imagePath;
                    }
                    return "No file 1";
                }
                else
                {
                    return "No file 2";
                }
            }
            catch(Exception ex)
            {
                return ex.Message;
            }
          

        }

        [Authorize]
        [RequestSizeLimit(100_000_000)]
        public async Task<string> VideoFileUploadAsync(IFormFile file)
        {
            if (file != null)
            {

                if (file.FileName.Length > 0)
                {
                    var fileExtension = "";
                    var vidId = Guid.NewGuid().ToString();
                    var userId = _userManager.GetUserId(HttpContext.User);
                    MimeTypes.TryGetExtension(MimeTypes.GetMimeType(file.FileName), out fileExtension);
                    var fileUploadName = vidId + fileExtension;
                    var vidPath = await objBlobService.UploadVideoAsync(file, fileUploadName);
                    return vidPath;
                }
                return "";
            }
            else
            {
                return "";
            }

        }
        public string GenerateQR(string id)
        {

            using (MemoryStream ms = new MemoryStream())
            {
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                var urlStr = HttpContext.Request.Host + "/SupplyChains/View?id=" + id;
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(urlStr, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);
                using (Bitmap bitMap = qrCode.GetGraphic(20))
                {
                    bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    var imageData = "data:image/png;base64," + Convert.ToBase64String(ms.ToArray());
                    return imageData;
                }
            }

        }

        public Task<JsonResult> GetProductSupplyChain(string id)
        {
            var product = _productService.GetProductByExternalId(id).Result;

            if (product != null)
            {
                var sc = _supplyChainService.GetSupplyChain((Guid)product.SupplyChainId, Guid.Empty).Result;
                return Task.FromResult(Json(sc));
            }
            else
            {
                return Task.FromResult(Json(null));
            }
            
           
        }

        public async Task<JsonResult> GetProductSupplyChainWeb(string id)
        {
            var product = await _productService.GetProduct(Guid.Empty, Guid.Parse(id));

            if(product == null)
            {
                return Json("Product is null");
            }
            else
            {
                try
                {
                    Guid scid = Guid.Parse(product.SupplyChainId.ToString());
                    var sc = await _supplyChainService.GetSupplyChain(scid, Guid.Empty);
                    return Json(sc);
                }
                catch(Exception ex)
                {
                    return Json("No supply chain assigned to this product");
                }
            }


        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}