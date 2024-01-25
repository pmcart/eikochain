using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class SettingService: ISettingService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public SettingService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }

        public async Task<Setting> CreateNewSetting(Setting newSetting, Guid orgId)
        {
            Setting sett = new Setting()
            {
                Id = Guid.NewGuid(),
                MiniLogo = newSetting.MiniLogo,
                LogoImage = newSetting.LogoImage,
                BackgroundImage = newSetting.BackgroundImage,
                OrgId = orgId
            };

            _context.Setting.Add(sett);
            _context.SaveChanges();

            return sett;
        }

        public async Task<bool> EditSetting(Setting editSetting, Guid orgId)
        {

            var setting = _context.Setting.FirstOrDefault(x => x.OrgId == orgId);

            // Validate entity is not null
            if (setting != null)
            {
                setting.MiniLogo = editSetting.MiniLogo;
                setting.LogoImage = editSetting.LogoImage;
                setting.BackgroundImage = editSetting.BackgroundImage;
                _context.SaveChanges();
                return true;
            }
            else 
            return false;
        }

        public async Task<Setting> GetSetting(Guid orgId)
        {
            try
            {
                var setting = await _context.Setting.Where(x => x.OrgId == orgId).FirstOrDefaultAsync();

                return setting;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
