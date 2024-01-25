using EikochainV1.Filters;
using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;

namespace EikochainV1.Controllers
{
    public class EmbedController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly ISupplyChainService _supplyChainService;
        private readonly IProductService _productService;
        private readonly IIntegrationService _integrationService;
        public EmbedController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager, ISupplyChainService supplyChainService, 
            IProductService productService, IIntegrationService integrationService)
        {
            _logger = logger;
            _userManager = userManager;
            _supplyChainService = supplyChainService;
            _productService = productService;
            _integrationService = integrationService;
        }

        [Authorize]
        [ViewDataFilter]
        public async Task<IActionResult> IndexAsync(string integrationId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var integration = await _integrationService.GetIntegration(user.OrganizationId, Guid.Parse(integrationId));

            string url = integration.EmbedUrl;

            using (WebClient client = new WebClient())
            {
                client.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36");
                string htmlCode = client.DownloadString(url);
                ViewBag.ExtHtml = htmlCode;
            }

            return View();
        }

    }
}