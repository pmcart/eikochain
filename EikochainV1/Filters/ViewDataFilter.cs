using EikochainV1.Models;
using EikochainV1.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EikochainV1.Filters
{
    public class ViewDataFilter : Attribute,IActionFilter
    {
 
        public void OnActionExecuting(ActionExecutingContext context)
        {
            //To do : before the action executes  
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            try
            {
                UserManager<EikochainUser> um = (UserManager<EikochainUser>)context.HttpContext.RequestServices.
                GetService(typeof(UserManager<EikochainUser>));

                var orgService = context.HttpContext.RequestServices.GetService<IOrganizationService>();

                var orgId = um.GetUserAsync(context.HttpContext.User).Result.OrganizationId;

                if (context.Controller is Controller controller)
                {
                    if (orgService != null)
                    {
                        controller.ViewBag.Company = orgService.GetOrg(orgId).Result.Name;
                        controller.ViewBag.OrgId = orgService.GetOrg(orgId).Result.Id;
                        controller.ViewBag.Logo = orgService.GetOrg(orgId).Result.LogoImageUrl;
                                        
                    }
                }

            }catch(Exception ex)
            {
                //do later
            }
                
        }
    }
}
