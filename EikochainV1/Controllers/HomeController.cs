using EikochainV1.Filters;
using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace EikochainV1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly ISupplyChainService _supplyChainService;
        private readonly ISupplyChainStepService _supplyChainStepService;
        private readonly IProductService _productService;
        public HomeController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager, ISupplyChainService supplyChainService, ISupplyChainStepService scStepService, IProductService productService)
        {
            _logger = logger;
            _userManager = userManager;
            _supplyChainService = supplyChainService;
            _supplyChainStepService = scStepService;
            _productService = productService;
        }

        [Authorize]
        [ViewDataFilter]
        public async Task<IActionResult> IndexAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            ViewBag.UserId = user.Id;

            ViewBag.prodCount = _productService.CountProducts(user.OrganizationId).Result;

            var supplyChains = _supplyChainService.GetAllSupplyChains(user.OrganizationId).Result;            

            if (supplyChains != null && supplyChains.Any()) {
                ViewBag.scCount = supplyChains.Count();
                
                foreach (SupplyChain sc in supplyChains)
                {
                    var steps = await _supplyChainStepService.GetAllSCSteps(sc.Id, Guid.Empty);
                    var stepsList = new List<SupplyChainStep>();

                    foreach (SupplyChainStep step in steps)
                    {
                        stepsList.Add(step);
                    }
                    sc.steps = stepsList;
                }                
            }
            else
                supplyChains = new List<SupplyChain>();

            return View(supplyChains);
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