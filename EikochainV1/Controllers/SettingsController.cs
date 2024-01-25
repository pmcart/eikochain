using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Diagnostics;

namespace EikochainV1.Controllers
{
    public class SettingsController : Controller
    {
        private BlobStorageService objBlobService;
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserService _userService;
        private readonly IOrganizationService _orgService;
        private readonly IConfiguration _config;
        public SettingsController(ILogger<HomeController> logger, IConfiguration config,
            UserManager<EikochainUser> userManager, RoleManager<ApplicationRole> roleManager,
            IUserService userService, IOrganizationService orgService)
        {
            _config = config;
            _logger = logger;
            _userManager = userManager;
            _userService = userService;
            _roleManager = roleManager;
            _orgService = orgService;
            objBlobService = new BlobStorageService(_config);
        }

        // GET: Setting
        public ActionResult Index()
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            ViewBag.UserId = userId;
            ViewBag.Setting = new Setting();

            return View();
        }

        [Authorize]
        public async Task<string> ImageUploadAsync(IFormFile file)
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
            catch (Exception ex)
            {
                return ex.Message;
            }


        }

        [Authorize]
        public async Task<bool> UpdateLogoUrl(string filePath)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var success = _orgService.UpdateLogoUrl(user.OrganizationId, filePath).Result;

            return success;
        }

        //public string MiniLogoUpload(IFormFile file)
        //{
        //    if (file != null)
        //    {
        //        Setting Setting = new Setting();
        //        string FileName = System.IO.Path.GetFileName(file.FileName);
        //        string guid = Guid.NewGuid().ToString();
        //        string basePath = Server.MapPath("~/Uploads/MiniLogo/");
        //        string filePath = System.IO.Path.Combine(Server.MapPath("~/Uploads/MiniLogo/"), FileName);
        //        file.SaveAs(filePath);
        //        string fileGuid = guid + Path.GetExtension(filePath);
        //        var newFilePath = Path.Combine(Path.GetDirectoryName(filePath), fileGuid);
        //        System.IO.File.Move(filePath, newFilePath);
        //        SharedManager obj = new SharedManager();
        //        Setting.ImageType = 3;
        //        Setting.ImageID = fileGuid;
        //        obj.AddNewSetting(Setting);
        //        return fileGuid;
        //    }
        //    else
        //    {
        //        return "!OK";
        //    }

        //}
        //public string LogoUpload(HttpPostedFileBase file)
        //{
        //    if (file != null)
        //    {
        //        Setting Setting = new Setting();
        //        string FileName = System.IO.Path.GetFileName(file.FileName);
        //        string guid = Guid.NewGuid().ToString();
        //        string basePath = Server.MapPath("~/Uploads/Logo/");
        //        string filePath = System.IO.Path.Combine(Server.MapPath("~/Uploads/Logo/"), FileName);
        //        file.SaveAs(filePath);
        //        string fileGuid = guid + Path.GetExtension(filePath);
        //        var newFilePath = Path.Combine(Path.GetDirectoryName(filePath), fileGuid);
        //        System.IO.File.Move(filePath, newFilePath);
        //        SharedManager obj = new SharedManager();
        //        Setting.ImageType = 1;
        //        Setting.ImageID = fileGuid;
        //        obj.AddNewSetting(Setting);
        //        return fileGuid;
        //    }
        //    else
        //    {
        //        return "!OK";
        //    }

        //}
        //public string BackgroundUpload(HttpPostedFileBase file)
        //{
        //    if (file != null)
        //    {
        //        Setting Setting = new Setting();
        //        string FileName = System.IO.Path.GetFileName(file.FileName);
        //        string guid = Guid.NewGuid().ToString();
        //        string basePath = Server.MapPath("~/Uploads/Background/");
        //        string filePath = System.IO.Path.Combine(Server.MapPath("~/Uploads/Background/"), FileName);
        //        file.SaveAs(filePath);
        //        string fileGuid = guid + Path.GetExtension(filePath);
        //        var newFilePath = Path.Combine(Path.GetDirectoryName(filePath), fileGuid);
        //        System.IO.File.Move(filePath, newFilePath);
        //        SharedManager obj = new SharedManager();
        //        Setting.ImageType = 2;
        //        Setting.ImageID = fileGuid;
        //        obj.AddNewSetting(Setting);
        //        return fileGuid;
        //    }
        //    else
        //    {
        //        return "!OK";
        //    }

        //}
    }
}