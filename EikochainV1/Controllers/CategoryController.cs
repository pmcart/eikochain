using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MimeKit;
using System.Diagnostics;

namespace EikochainV1.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private BlobStorageService objBlobService;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        public CategoryController(ILogger<HomeController> logger,
            IConfiguration config,
            UserManager<EikochainUser> userManager, IProductService productService, ICategoryService categoryService)
        {
            _config = config;
            _logger = logger;
            _userManager = userManager;
            objBlobService = new BlobStorageService(_config);
            _productService = productService;
            _categoryService = categoryService;
        }

        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var categories = _categoryService.FindAllCategories(user.OrganizationId).Result;
            return View(categories);
        }

        [Authorize]
        public IActionResult Add()
        {
            var user = _userManager.GetUserAsync(User);
            return View();
        }

        [Authorize]
        [HttpGet]
        public async Task<JsonResult> Add(string categoryName)
        {
            var user = _userManager.GetUserAsync(User);
            Category newCategory = new Category
            {
                CategoryName = categoryName,
                Id = Guid.NewGuid(),
                OrgId = user.Result.OrganizationId,
                CreatedBy = user.Result.NormalizedUserName
            };
            var result = await _categoryService.CreateNewCategory(newCategory, user.Result.OrganizationId);

            if (result.OrgId == user.Result.OrganizationId)
            {
                return Json(result);
            }
            else
                return Json(null);
            
        }

        [Authorize]
        [HttpPost]
        public async Task<JsonResult> Update(string categoryName, string categoryId)
        {
            var user = _userManager.GetUserAsync(User);

            var result = await _categoryService.UpdateCategory(categoryName, Guid.Parse(categoryId), user.Result.OrganizationId);

            if (result)
            {
                return Json("OK");
            }
            else
                return Json(null);

        }

        public async Task<JsonResult> Delete(string categoryId)
        {
            var user = _userManager.GetUserAsync(User);

            var result = await _categoryService.DeleteCategory(Guid.Parse(categoryId), user.Result.OrganizationId);

            if (result == true)
            {
                return Json("OK");
            }
            else
                return Json(null);

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