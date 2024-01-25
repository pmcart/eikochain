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

namespace EikochainV1.Controllers
{
    public class PreviewController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private BlobStorageService objBlobService;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        private readonly ISupplyChainService _supplyChainService;
        public PreviewController(ILogger<HomeController> logger,
            IConfiguration config,
            UserManager<EikochainUser> userManager, IProductService productService, ICategoryService categoryService, ISupplyChainService supplyChainService)
        {
            _config = config;
            _logger = logger;
            _userManager = userManager;
            objBlobService = new BlobStorageService(_config);
            _productService = productService;
            _categoryService = categoryService;
            _supplyChainService = supplyChainService;
        }

        public async Task<IActionResult> IndexAsync(string id)
        {
            //var user = await _userManager.GetUserAsync(HttpContext.User);
            var guidStr = Guid.Parse(id);
            var supplyChain = _supplyChainService.GetSupplyChain(guidStr,Guid.Empty).Result;
            return View(supplyChain);
        }

       
    }
}