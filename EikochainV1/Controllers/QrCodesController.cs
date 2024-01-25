using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Diagnostics;
using System.Drawing;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace EikochainV1.Controllers
{
    public class QrCodesController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly ISupplyChainService _supplyChainService;
        private readonly IProductService _productService;
        private readonly IEikoQrCodeService _eikoQrCodeService;
        public QrCodesController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager, IEikoQrCodeService eikoQrCodeService, ISupplyChainService supplyChainService, IProductService productService)
        {
            _logger = logger;
            _userManager = userManager;
            _supplyChainService = supplyChainService;
            _productService = productService;
            _eikoQrCodeService = eikoQrCodeService;
        }

        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var qrCodes = await _eikoQrCodeService.GetAllQrCodes(user.OrganizationId);
            
            if(qrCodes == null)
                qrCodes = new List<EikoQrCode>();

            return View(qrCodes);
           
        }

        public async Task<IActionResult> Preview()
        {
            return View();

        }

        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var supplyChains = _supplyChainService.GetAllSupplyChains(user.OrganizationId).Result;
            return Json(supplyChains);

        }

        [Authorize]

        public async Task<IActionResult> Edit(string id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var guidStr = Guid.Parse(id);
            var supplyChain = _supplyChainService.GetSupplyChain(guidStr, user.OrganizationId).Result;
            return View(supplyChain);
        }


        public IActionResult Add()
        {
            return View(new SupplyChain());
        }
        [Authorize]
        public async Task<IActionResult> AssignSupplyChain(string SupplyChainId, string QrCodeId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var scGuid = Guid.Parse(SupplyChainId);
            var qrGuid = Guid.Parse(QrCodeId);
            var result = false;

            result = await _eikoQrCodeService.AssignQrCode(user.OrganizationId, qrGuid, scGuid);

            return Json(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<bool> UpdatePreview(SupplyChain sc)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var newSupplyChain = await _supplyChainService.UpdateSupplyChainPreview(sc, user.OrganizationId);

            return true;

        }


        [Authorize]
        [HttpPost]
        public async Task<JsonResult> Add(SupplyChain sc)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var newSupplyChain = await _supplyChainService.CreateNewSupplyChain(sc, user.OrganizationId);
        
            return Json(new { id = newSupplyChain.Id });
            
        }

        [Authorize]
        [HttpPost]
        public async Task<JsonResult> Update(SupplyChain sc)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var supplyChain = _supplyChainService.GetSupplyChain(sc.Id, user.OrganizationId).Result;

            /*if (supplyChain.Steps != null)
            {
                dynamic newSteps = JsonConvert.DeserializeObject(sc.Steps);
                Console.WriteLine(sc.Steps);
                Console.WriteLine(supplyChain.Steps);
                JArray currSteps = JArray.Parse(supplyChain.Steps);
                var newjObjects = newSteps.ToObject<List<JObject>>();          //Get list of objects inside array

                foreach (var obj in newjObjects)
                {
                    JObject jo = currSteps.Children<JObject>().FirstOrDefault(o => o["id"] != null && o["id"] == obj["id"]);

                    if (jo != null)
                    {
                        obj["clicks"] = jo["clicks"];
                    }
                }

                JArray updatedSteps = JArray.FromObject(newjObjects);
                sc.Steps = updatedSteps.ToString();

                Console.WriteLine(updatedSteps.ToString());
            }*/

            var success = await _supplyChainService.UpdateSupplyChain(sc.Id, user.OrganizationId, sc);

            return Json(new { success = success });

        }

        public async Task<IActionResult> Delete(string SupplyChainId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var scGuid = Guid.Parse(SupplyChainId);
            //var prodGuid = Guid.Parse(ProductId);
            var removeAllScRefs = await _productService.RemoveSupplyChainLinks(user.OrganizationId, scGuid);
            var result = false;
            if (removeAllScRefs)
            result = await _supplyChainService.DeleteSupplyChain(scGuid, user.OrganizationId);
            return Json(result);
        }

        public async Task<string> GenerateQR(string ID)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();

            var user = await _userManager.GetUserAsync(HttpContext.User);
            EikoQrCode currentQrCode = await _eikoQrCodeService.GetBySupplyChainId(Guid.Parse(ID), user.OrganizationId);

            if (currentQrCode != null)
            {
                return currentQrCode.ImageDataString;
            }
            else
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    
                    var urlStr = HttpContext.Request.Host + "/SupplyChains/View?id=" + ID;
                    QRCodeData qrCodeData = qrGenerator.CreateQrCode(urlStr, QRCodeGenerator.ECCLevel.Q);
                    QRCode qrCode = new QRCode(qrCodeData);
                    using (Bitmap bitMap = qrCode.GetGraphic(20))
                    {
                        bitMap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        var imageData = "data:image/png;base64," + Convert.ToBase64String(ms.ToArray());

                        try
                        {
                            await _eikoQrCodeService.Create(user,Guid.Parse(ID), imageData);
                            //TODO UPLOAD TO AZURE BLOB
                        }
                        catch (Exception ex)
                        {

                        }

                        return imageData;
                    }
                }
            }

        }

        public async Task<string> GetQr(string ID)
        {
  
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var qrId = Guid.Parse(ID);
            EikoQrCode currentQrCode = await _eikoQrCodeService.GetById(qrId, user.OrganizationId);

            if (currentQrCode != null)
            {
                return currentQrCode.ImageDataString;
            }
            else
                return null;
        }

        public async Task<IActionResult> IframeView(string id)
        {

            var guidStr = Guid.Parse(id);
            var product = await _productService.GetProduct(Guid.Empty, guidStr);
            var supplyChain = await _supplyChainService.GetSupplyChain((Guid)product.SupplyChainId, product.OrgId);

            //dont incremnt views if user views
            //if (user == null)
            //{
            //    if (supplyChain.Views != null)
            //    {
            //        supplyChain.Views = supplyChain.Views + 1;
            //    }
            //    else
            //    {
            //        supplyChain.Views = 1;
            //    }

            //    var success = await _supplyChainService.UpdateSupplyChainViews(supplyChain);
            //    Console.WriteLine(success);
            //}

            return View(supplyChain);
        }

        public async Task<IActionResult> IframeViewMobile(string id)
        {

            var guidStr = Guid.Parse(id);
            var product = await _productService.GetProduct(Guid.Empty, guidStr);
            var supplyChain = await _supplyChainService.GetSupplyChain((Guid)product.SupplyChainId, product.OrgId);

            //dont incremnt views if user views
            //if (user == null)
            //{
            //    if (supplyChain.Views != null)
            //    {
            //        supplyChain.Views = supplyChain.Views + 1;
            //    }
            //    else
            //    {
            //        supplyChain.Views = 1;
            //    }

            //    var success = await _supplyChainService.UpdateSupplyChainViews(supplyChain);
            //    Console.WriteLine(success);
            //}

            return View(supplyChain);
        }
        public async Task<IActionResult> View(string id)
        {
 
            var guidStr = Guid.Parse(id);
            var supplyChain = await _supplyChainService.GetSupplyChain(guidStr, Guid.Empty);

            //dont incremnt views if user views
            //if (user == null)
            //{
            //    if (supplyChain.Views != null)
            //    {
            //        supplyChain.Views = supplyChain.Views + 1;
            //    }
            //    else
            //    {
            //        supplyChain.Views = 1;
            //    }

            //    var success = await _supplyChainService.UpdateSupplyChainViews(supplyChain);
            //    Console.WriteLine(success);
            //}

            return View(supplyChain);
        }

        public async Task<IActionResult> ViewSupplyChain(string id)
        {

            var guidStr = Guid.Parse(id);
            var supplyChain = await _supplyChainService.GetSupplyChain(guidStr, Guid.Empty);

            //dont incremnt views if user views
            //if (user == null)
            //{
            //    if (supplyChain.Views != null)
            //    {
            //        supplyChain.Views = supplyChain.Views + 1;
            //    }
            //    else
            //    {
            //        supplyChain.Views = 1;
            //    }

            //    var success = await _supplyChainService.UpdateSupplyChainViews(supplyChain);
            //    Console.WriteLine(success);
            //}

            return View("View",supplyChain);
        }
        public async Task<JsonResult> UpdateSupplyChainViews(string id)
        {
            var guidStr = Guid.Parse(id);
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var supplyChain = _supplyChainService.GetSupplyChain(guidStr, Guid.Empty).Result;

            //dont incremnt views if user views
            if (user == null)
            {
                /*if (supplyChain.Views != null)
                {
                    supplyChain.Views = supplyChain.Views + 1;
                }
                else
                {
                    supplyChain.Views = 1;
                }

                var success = await _supplyChainService.UpdateSupplyChainViews(supplyChain);*/
                return Json(false);
            }
            else
            {
                return Json(false);
            }
        }



        [HttpPost]
        /*public async Task<JsonResult> UpdateStepClicks(string id, string stepId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                var guidStr = Guid.Parse(id);
                var supplyChain = _supplyChainService.GetSupplyChain(guidStr, Guid.Empty).Result;

                try {
                    JArray steps = JArray.Parse(supplyChain.Steps);
                    Console.WriteLine(steps.ToString());

                    JObject jo = steps.Children<JObject>().FirstOrDefault(o => o["id"] != null && o["id"].ToString() == stepId);

                    if (jo != null)
                    {
                        var numb = Int32.Parse(jo["clicks"].ToString());
                        jo["clicks"] = numb + 1;
                    }

                    supplyChain.Steps = steps.ToString();
                    Console.WriteLine(steps.ToString());

                    var success = await _supplyChainService.UpdateSupplyChainClicks(supplyChain);

                    return Json(new { success = success });
                }
                catch(Exception e)
                {
                    return Json(new { success = false });
                }                                
            }
            else
            {
                return Json(new { success = false });

            }
        }*/


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}