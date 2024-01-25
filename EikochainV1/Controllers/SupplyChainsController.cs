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
    public class SupplyChainsController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<EikochainUser> _userManager;
        private readonly ISupplyChainService _supplyChainService;
        private readonly ISupplyChainStepService _supplyChainStepService;
        private readonly IProductService _productService;
        private readonly IEikoQrCodeService _eikoQrCodeService;
        public SupplyChainsController(ILogger<HomeController> logger,
            UserManager<EikochainUser> userManager, IEikoQrCodeService eikoQrCodeService, ISupplyChainService supplyChainService, ISupplyChainStepService supplyChainStepService, IProductService productService)
        {
            _logger = logger;
            _userManager = userManager;
            _supplyChainService = supplyChainService;
            _supplyChainStepService = supplyChainStepService;
            _productService = productService;
            _eikoQrCodeService = eikoQrCodeService;
        }

        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            
            var supplyChains = _supplyChainService.GetAllSupplyChains(user.OrganizationId).Result;
            
            if(supplyChains == null)
                supplyChains = new List<SupplyChain>();

            return View(supplyChains);
           
        }

        public async Task<IActionResult> Test()
        {
            return View();
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
        [HttpPost]
        public async Task<bool> UpdatePreview(SupplyChain sc)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var newSupplyChain = await _supplyChainService.UpdateSupplyChainPreview(sc, user.OrganizationId);

            return true;

        }


        [Authorize]
        [HttpPost]
        public async Task<JsonResult> Add(SupplyChain sc, SupplyChainStep[] steps)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var newSupplyChain = await _supplyChainService.CreateNewSupplyChain(sc, user.OrganizationId);

            foreach (SupplyChainStep step in steps)
            {
                step.SupplyChainId = newSupplyChain.Id;
                step.OrgId = user.OrganizationId;
                await _supplyChainStepService.CreateSCStep(sc.Id, user.OrganizationId, step);
            }
        
            return Json(new { id = newSupplyChain.Id });
            
        }

        [Authorize]
        [HttpPost]
        public async Task<JsonResult> Update(SupplyChain sc, SupplyChainStep[] steps)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var supplyChain = _supplyChainService.GetSupplyChain(sc.Id, user.OrganizationId).Result;

            var currSteps = await _supplyChainStepService.GetAllSCSteps(sc.Id, user.OrganizationId);

            foreach (SupplyChainStep step in steps)
            {
                var stepId = step.StepId;
                Debug.WriteLine(currSteps.Where(x => x.StepId == stepId) + " " + stepId);
                if (currSteps.Count() > 0 && currSteps.Where(x => x.StepId == stepId).FirstOrDefault() != null)
                {
                    await _supplyChainStepService.UpdateSCStep(sc.Id, user.OrganizationId, stepId, step);
                    currSteps = currSteps.Where(x => x.StepId != stepId).ToList();
                }  
                else
                {
                    step.SupplyChainId = sc.Id;
                    step.OrgId = user.OrganizationId;
                    await _supplyChainStepService.CreateSCStep(sc.Id, user.OrganizationId, step);
                }
            }

            foreach (SupplyChainStep step in currSteps)
            {
                await _supplyChainStepService.DeleteSCStep(sc.Id, user.OrganizationId, step.StepId);
            }


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
                        obj["qrClicks"] = jo["qrClicks"];
                        obj["webClicks"] = jo["webClicks"];
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
            var removeScProdRefs = await _productService.RemoveSupplyChainLinks(user.OrganizationId, scGuid);
            var removeScStepRefs = await _supplyChainStepService.DeleteAllSCStep(scGuid, user.OrganizationId);

            var result = false;
            if (removeScProdRefs && removeScStepRefs)
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

        [HttpGet]
        public async Task<IActionResult> CheckShopifyProductExists(string id)
        {

            Product product = null;

            product = await _productService.GetProductByExternalId(id);
            
            SupplyChain supplyChain = null;
            if (product != null)
            {
                supplyChain = await _supplyChainService.GetSupplyChain((Guid)product.SupplyChainId, product.OrgId);
                return new OkObjectResult("true");
            }


            return new BadRequestObjectResult("false");
        }


        public async Task<IActionResult> IframeView(string id, bool isExternal)
        {

            Product product = null;

            if (isExternal)
            {
             
                product = await _productService.GetProductByExternalId(id);
            }
            else
            {
                var guidStr = Guid.Parse(id);
                product = await _productService.GetProduct(Guid.Empty, guidStr);
            }

            SupplyChain supplyChain = null;
            if (product != null)
            {
                supplyChain = await _supplyChainService.GetSupplyChain((Guid)product.SupplyChainId, product.OrgId);
            }

         
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

        public async Task<IActionResult> IframeViewMobile(string id, bool isExternal)
        {  
            Product product = null;

            if (isExternal)
            {
                product = await _productService.GetProductByExternalId(id);
            }
            else
            {
                var guidStr = Guid.Parse(id);
                product = await _productService.GetProduct(Guid.Empty, guidStr);
            }

            SupplyChain supplyChain = null;
            if (product != null)
            {
                supplyChain = await _supplyChainService.GetSupplyChain((Guid)product.SupplyChainId, product.OrgId);
            }
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

        public async Task<IActionResult> MobileView(string id, bool isExternal)
        {
            Product product = null;

            if (isExternal)
            {
                product = await _productService.GetProductByExternalId(id);
            }
            else
            {
                var guidStr = Guid.Parse(id);
                product = await _productService.GetProduct(Guid.Empty, guidStr);
            }

            SupplyChain supplyChain = null;
            if (product != null)
            {
                supplyChain = await _supplyChainService.GetSupplyChain((Guid)product.SupplyChainId, product.OrgId);
            }
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

        [HttpPost]
        public async Task<JsonResult> UpdateSupplyChainViews(string id, String source)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            //dont incremnt views if logged in user views
            if (user == null)
            {
                var guidSCId = Guid.Parse(id);
                var supplyChain = _supplyChainService.GetSupplyChain(guidSCId, Guid.Empty).Result;

                if (source.Equals("Qr"))
                {
                    supplyChain.QrViews++;
                }
                else if (source.Equals("Website"))
                {
                    supplyChain.WebsiteViews++;
                }
                else
                    return Json(false);   

                var success = await _supplyChainService.UpdateSupplyChainViews(supplyChain);
                return Json(success);
            }
            else
            {
                return Json(false);
            }
        }



        [HttpPost]
        public async Task<JsonResult> UpdateStepClicks(string id, String source, string stepId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                var guidSCId = Guid.Parse(id);
                var step = _supplyChainStepService.GetSCStep(guidSCId, Guid.Empty, stepId).Result;

                if (source.Equals("Qr"))
                {
                    step.QrClicks++;
                }
                else if (source.Equals("Website"))
                {
                    step.WebsiteClicks++;
                }
                else
                    return Json(false);

                var success = await _supplyChainStepService.UpdateSCStepClicks(step);

                return Json(new { success = success });                              
            }
            else
            {
                return Json(new { success = false });

            }
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}