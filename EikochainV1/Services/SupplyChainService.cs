using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class SupplyChainService: ISupplyChainService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public SupplyChainService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }
        public async Task<SupplyChain> CreateNewSupplyChain(SupplyChain newSupplyChain, Guid orgId)
        {
            SupplyChain sc = new SupplyChain()
            {
                Id = Guid.NewGuid(),
                Title = newSupplyChain.Title,
                SupplyChainData = newSupplyChain.SupplyChainData,
                OrgId = orgId,
            };

            _context.SupplyChain.Add(sc);
            _context.SaveChanges();

            return sc;
        }

        public async Task<bool> UpdateSupplyChainPreview(SupplyChain sc, Guid orgId)
        {
            try
            {
                var currentSc = await _context.SupplyChain.Where(x => x.OrgId == orgId && x.Id == sc.Id)
                    .FirstOrDefaultAsync();

                if (!String.IsNullOrEmpty(currentSc.Title))
                {
                    if (!String.IsNullOrWhiteSpace(currentSc.Title))
                        currentSc.Title = sc.Title;
                }

                currentSc.CurrentPreviewData = sc.SupplyChainData;
                _context.Update(currentSc);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<SupplyChain> GetSupplyChain(Guid id, Guid orgId)
        {
            try
            {
                if(orgId == Guid.Empty)
                {
                    var sc = await _context.SupplyChain.Where(x => x.Id == id)
                   .FirstAsync();
                    return sc;
                }
                else
                {
                    var sc = await _context.SupplyChain.Where(x => x.OrgId == orgId && x.Id == id)
                   .FirstAsync();
                    return sc;
                }               
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> UpdateSupplyChain(Guid id, Guid orgId, SupplyChain sc)
        {
            try
            {
                var currentSc = await _context.SupplyChain.Where(x => x.OrgId == orgId && x.Id == id)
                    .FirstOrDefaultAsync();

                if (!String.IsNullOrEmpty(currentSc.Title))
                {
                    if(!String.IsNullOrWhiteSpace(currentSc.Title))
                    currentSc.Title = sc.Title;
                }

                currentSc.SupplyChainData = sc.SupplyChainData;
                currentSc.CurrentPreviewData = sc.SupplyChainData;
                _context.Update(currentSc);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> DeleteSupplyChain(Guid id, Guid orgId)
        {
            try
            { 
               
                var sc = await _context.SupplyChain.Where(x => x.OrgId == orgId && x.Id == id)
                    .FirstOrDefaultAsync();

                var QrCode = await _context.EikoQrCode.Where(x => x.SupplyChainId == sc.Id).FirstOrDefaultAsync();
              
                _context.SupplyChain.Remove(sc);

                if (QrCode != null)
                {
                    QrCode.SupplyChainId = null;
                    _context.EikoQrCode.Update(QrCode);
                }

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<IEnumerable<SupplyChain>> GetAllSupplyChains(Guid orgId)
        {
            try
            {
                var supplyChains = await _context.SupplyChain.Where(x => x.OrgId == orgId).ToListAsync();
                return supplyChains;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> UpdateSupplyChainViews(SupplyChain sc)
        {
            try
            {
                var currentSc = await _context.SupplyChain.Where(x => x.Id == sc.Id)
                    .FirstOrDefaultAsync();

                currentSc.QrViews = sc.QrViews;
                currentSc.WebsiteViews = sc.WebsiteViews;

                _context.Update(currentSc);
                _context.SaveChanges(); 
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /*public async Task<bool> UpdateSupplyChainClicks(SupplyChain sc)
        {
            try
            {
                var currentSc = await _context.SupplyChain.Where(x => x.Id == sc.Id)
                    .FirstOrDefaultAsync();

                currentSc.Steps = sc.Steps;

                _context.Update(currentSc);
                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }*/
    }
}
