using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using System.Text;

namespace EikochainV1.Services
{
    public class UserService: IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public UserService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }
        public async Task<string> UpdateUserOrgId(string userId,Guid orgId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            user.OrganizationId = orgId;
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
                return "Success";
            else
                return "Failed";

        }

        public List<EikochainUser> GetAllUsers(Guid orgId)
        {
            return _context.Users.Where(user => user.OrganizationId == orgId).ToList();
        }

        public async Task<Guid> GetUserOrgId(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user.OrganizationId;
        }

        public async Task<bool> CreateUser(EikochainUser user)
        {
            Random random = new Random((int)DateTime.Now.Ticks);
            const string pool = "abcdefghijklmnopqrstuvwxyz0123456789";
            var builder = new StringBuilder();

            for (var i = 0; i < 5; i++)
            {
                var c = pool[random.Next(0, pool.Length)];
                builder.Append(c);
            }

            var success = await _userManager.CreateAsync(user, builder.ToString());
            return success.Succeeded;
        }
    }
}
