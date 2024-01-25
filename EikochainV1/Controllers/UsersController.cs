using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Web;

namespace EikochainV1.Controllers
{
    public class UsersController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        public UsersController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager, RoleManager<ApplicationRole> roleManager,
            IUserService userService, IEmailService emailService)
        {
            _logger = logger;
            _userManager = userManager;
            _userService = userService;
            _roleManager = roleManager;
            _emailService = emailService;
        }

        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            var currentUser = await _userManager.GetUserAsync(HttpContext.User);

            var user = await _userManager.GetUserAsync(User);
            var users = _userManager.Users
                .Where(x=>x.OrganizationId == currentUser.OrganizationId)
             .Include(u => u.UserRoles)
                 .ThenInclude(ur => ur.Role).AsNoTracking().ToList();
            ViewBag.UserId = user.Id;

            ViewBag.IsSuper = await _userManager.IsInRoleAsync(user, "SuperAdmin");
                
            return View(users);
        }

        [Authorize]
        public JsonResult GetAllRoles()
        {
            var roles = _roleManager.Roles.ToList();
            return Json(roles);
        }

        [Authorize]
        public async Task<JsonResult> ResetPasswordAsync(string email)
        {
            var user = _userManager.FindByEmailAsync(email);
            //string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user.Result); //await UserManager.GeneratePasswordResetTokenAsync(model.Id);
            
            var token = await _userManager.GeneratePasswordResetTokenAsync(user.Result);
            var encodedToken = HttpUtility.UrlEncode(token);
            var link = "https://" + Request.Host + "/Identity/Account/ResetPassword?code=" + encodedToken + "&email=" + email;

            _emailService.SendPasswordReset(email, link);
            return Json("Done");
        }

        [Authorize]
        [HttpPost]
        public async Task<JsonResult> AddAsync(string firstName, string lastName, string email, string roleId)
        {
            var currentUser = await _userManager.GetUserAsync(HttpContext.User);
            var orgId = currentUser.OrganizationId;

            var roleObj = await _roleManager.FindByIdAsync(roleId);

            EikochainUser user = new EikochainUser
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                OrganizationId = orgId,
                UserName = email,
                Id = Guid.NewGuid().ToString(),
                UserRoles = new List<ApplicationUserRole>()
            };
            
            user.UserRoles.Add(new ApplicationUserRole { User=user,Role=roleObj});

            var success = _userService.CreateUser(user);
            return Json(success);
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