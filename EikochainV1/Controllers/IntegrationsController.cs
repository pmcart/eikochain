using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;

namespace EikochainV1.Controllers
{
    public class IntegrationsController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly IProductService _productService;
        private readonly IIntegrationService _integrationService;

        public IntegrationsController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager, IProductService productService,
            IIntegrationService integrationService)
        {
            _logger = logger;
            _userManager = userManager;
            _productService = productService;
            _integrationService = integrationService;
        }

        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            ViewBag.UserId = user.Id;

            string url = "https://pericaya.myshopify.com/products/organic-cotton-jogger-green-slate";

            using (WebClient client = new WebClient())
            {
                client.Headers.Add("user-agent", "Only a test!");
                string htmlCode = client.DownloadString(url);
                //ViewBag.ExtHtml = htmlCode;
            }

            List<Integration> integrations = await _integrationService.GetIntegrations(user.OrganizationId);

            return View(integrations);
        }

        [Authorize]
        public async Task<IActionResult> GetAllProductsAsync(string url)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            ViewBag.UserId = userId;

            HttpClient client = new HttpClient();

            // Call asynchronous network methods in a try/catch block to handle exceptions
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                
                client.DefaultRequestHeaders.Add("postman-token", Guid.NewGuid().ToString());
                client.DefaultRequestHeaders.Add("cache-control", "no-cache");

                client.DefaultRequestHeaders.Add("Accept", "*/*");
                client.DefaultRequestHeaders.Add("upgrade-insecure-requests", "1");
                client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36");                

                HttpResponseMessage response = await client.GetAsync(url+ "/products.json?limit=20000000");
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                return Json(new { success = true, results = responseBody });
            }
            catch (Exception e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);

                if (e is HttpRequestException) { 
                    if(e.Message.Contains("404")) return Json(new { success = false, message = "Not a shopify website! Check url." });
                    else return Json(new { success = false, message = "Could not reach that website! Check url." });
                }
                else if(e is InvalidOperationException) {                  
                    return Json(new { success = false, message = "Invalid url!" });
                }
                else {
                    return Json(new { success = false, message = "Error getting products!" });
                }
            }
          
        }


        [Authorize]
        public async Task<IActionResult> GetAllWooProductsAsync(string url)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            ViewBag.UserId = userId;

            HttpClient client = new HttpClient();

            // Call asynchronous network methods in a try/catch block to handle exceptions
            try
            {
                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                //client.DefaultRequestHeaders.Add("postman-token", Guid.NewGuid().ToString());
                //client.DefaultRequestHeaders.Add("cache-control", "no-cache");

                //client.DefaultRequestHeaders.Add("Accept", "*/*");
                //client.DefaultRequestHeaders.Add("upgrade-insecure-requests", "1");
                //client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36");

                HttpResponseMessage response = await client.GetAsync(url + "/wp-json/wc/store/v1/products");
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                return Json(new { success = true, results = responseBody });
            }
            catch (Exception e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);

                if (e is HttpRequestException)
                {
                    if (e.Message.Contains("404")) return Json(new { success = false, message = "Not a woocommerce website! Check url." });
                    else return Json(new { success = false, message = "Could not reach that website! Check url." });
                }
                else if (e is InvalidOperationException)
                {
                    return Json(new { success = false, message = "Invalid url!" });
                }
                else
                {
                    return Json(new { success = false, message = "Error getting products!" });
                }
            }

        }

        [HttpPost]
        public async Task<IActionResult> CompleteImport(string products, string url, string type)
        {
            var productsList = JsonConvert.DeserializeObject<List<Product>>(products);

            var user = _userManager.GetUserAsync(HttpContext.User).Result;
            
            if(productsList.Count == 0)
            {
                return Json(false);
            }
            else
            {
                var success = await _productService.CreateNewProductsByIntegration(productsList, user.OrganizationId);

                var embedUrl = productsList[0].Url;
                var createIntegration = await _integrationService.CreateIntegration(new Integration
                {
                    OrganizationId = user.OrganizationId,
                    Id = Guid.NewGuid(),
                    ApiKey = "EMPTY",
                    Token = "EMPTY",
                    Type = type,
                    Url = url,
                    EmbedUrl = embedUrl
                });
                return Json("true");
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