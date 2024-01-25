using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class OrganizationService: IOrganizationService
    {
        private readonly ApplicationDbContext _context;

        public OrganizationService(ApplicationDbContext ctx)
        {
            _context = ctx;
        }
        public async Task<Guid> CreateNewOrg(string orgName, string ownerEmail)
        {
      
            Organization org = new Organization()
            {
                Name = orgName,
                Id = Guid.NewGuid(),
                PrimaryEmail = ownerEmail
            };

            _context.Organization.Add(org);
            _context.SaveChanges();

            return org.Id;
            
        }

        public async Task<Organization> GetOrg(Guid orgId)
        {
            Organization org = await _context.Organization
                                 .Where(x => x.Id == orgId)
                                 .FirstOrDefaultAsync();

            return org;
        }

       public async Task<bool> UpdateLogoUrl(Guid orgId, string imagePath)
       {
            try 
            { 
                Organization org = await _context.Organization.Where(x => x.Id == orgId).FirstOrDefaultAsync();
                org.LogoImageUrl = imagePath;

                _context.Update(org);
                _context.SaveChanges();
                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
       }

    }
}
