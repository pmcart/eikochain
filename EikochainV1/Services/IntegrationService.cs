using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class IntegrationService: IIntegrationService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public IntegrationService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }

        public async Task<bool> CreateIntegration(Integration integration)
        {
  
            _context.Integration.Add(integration);
            _context.SaveChanges();

            return true;
        }

        public async Task<Integration> GetIntegration(Guid orgId, Guid IntegrationId)
        {
            try
            {
                var integration = await _context.Integration.Where(x => x.OrganizationId == orgId && x.Id == IntegrationId)
                    .FirstOrDefaultAsync();

                return integration;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<Integration>> GetIntegrations(Guid orgId)
        {
            try
            {
                var integrations = await _context.Integration.Where(x => x.OrganizationId == orgId)
                    .ToListAsync();

                return integrations;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
