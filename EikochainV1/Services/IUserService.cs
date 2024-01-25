using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface IUserService
    {
        public Task<string> UpdateUserOrgId(string userId,Guid orgId);

        public List<EikochainUser> GetAllUsers(Guid orgId);

        public Task<bool> CreateUser(EikochainUser user);
    }
}
