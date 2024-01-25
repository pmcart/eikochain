using EikochainV1.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace EikochainV1.Controllers
{
    public class SessionController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        public SessionController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await HttpContext.SignOutAsync();
                return Redirect("/Identity/Account/Login");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}