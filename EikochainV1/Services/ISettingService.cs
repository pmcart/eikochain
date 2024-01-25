using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface ISettingService
    {
        public Task<Setting> CreateNewSetting(Setting newSetting, Guid orgId);
        public Task<Setting> GetSetting(Guid orgId);
        public Task<bool> EditSetting(Setting editSetting, Guid orgId);
    }
}
