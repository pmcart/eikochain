using EikochainV1.Filters;
using EikochainV1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace EikochainV1.Controllers
{
    public class OffsetController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        public OffsetController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        [Authorize]
        [ViewDataFilter]
        public IActionResult Index()
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            ViewBag.UserId = userId;
            return View();
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