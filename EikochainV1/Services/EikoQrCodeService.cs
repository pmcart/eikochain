using EikochainV1.Data;
using EikochainV1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EikochainV1.Services
{
    public class EikoQrCodeService : IEikoQrCodeService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<EikochainUser> _userManager;

        public EikoQrCodeService(ApplicationDbContext ctx, UserManager<EikochainUser> userManager)
        {
            _context = ctx;
            _userManager = userManager;
        }

        public async Task<IEnumerable<EikoQrCode>> GetAllQrCodes(Guid orgId)
        {
            try
            {
                var qrCodes = await _context.EikoQrCode.
                    Where(x => x.OrganizationId == orgId).ToListAsync();
                
                return qrCodes;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> AssignQrCode(Guid orgId, Guid qrCodeGuid, Guid supplyChainId)
        {
            var sc = await _context.SupplyChain.
                Where(x => x.Id == supplyChainId).FirstOrDefaultAsync();

            var qrCode = await _context.EikoQrCode.
                 Where(x => x.Id == qrCodeGuid).FirstOrDefaultAsync();

            qrCode.SupplyChainId = supplyChainId;
            qrCode.PreviousDescription = qrCode.Description;
            qrCode.Description = "QR Code for supplychain " + sc.Title;
            _context.EikoQrCode.Update(qrCode);
            _context.SaveChanges();
            return true;
            //Setting sett = new Setting()
            //{
            //    Id = Guid.NewGuid(),
            //    MiniLogo = newSetting.MiniLogo,
            //    LogoImage = newSetting.LogoImage,
            //    BackgroundImage = newSetting.BackgroundImage,
            //    OrgId = orgId
            //};

            //_context.Setting.Add(sett);
            //_context.SaveChanges();

            //return sett;
        }

        public async Task<bool> Create(EikochainUser user, Guid supplyChainId, string imageData)
        {
            var sc = await _context.SupplyChain.Where(x => x.OrgId == user.OrganizationId && x.Id == supplyChainId)
                .FirstAsync();

            EikoQrCode eikoQrCode = new EikoQrCode()
            {
                Id = Guid.NewGuid(),
                OrganizationId = user.OrganizationId,
                ImageDataString = imageData,
                SupplyChainId = supplyChainId,
                Description = "QR Code for supplychain " + sc.Title,
                CreatedDate = DateTime.Now,
                CreatedBy = user.NormalizedEmail,
                Url = sc.Url,
            };
            _context.EikoQrCode.Add(eikoQrCode);
            _context.SaveChanges();
            return true;
            //Setting sett = new Setting()
            //{
            //    Id = Guid.NewGuid(),
            //    MiniLogo = newSetting.MiniLogo,
            //    LogoImage = newSetting.LogoImage,
            //    BackgroundImage = newSetting.BackgroundImage,
            //    OrgId = orgId
            //};

            //_context.Setting.Add(sett);
            //_context.SaveChanges();

            //return sett;
        }

        public async Task<EikoQrCode> GetBySupplyChainId(Guid supplyChainId, Guid orgId)
        {
            try
            {
                var sc = await _context.SupplyChain.Where(x => x.OrgId == orgId && x.Id == supplyChainId)
                .FirstAsync();

                var qrCode = await _context.EikoQrCode.Where(x => x.SupplyChainId == sc.Id)
                .FirstAsync();

                return qrCode;

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<EikoQrCode> GetById(Guid qrId, Guid orgId)
        {
            try
            {
                var qrCode = await _context.EikoQrCode.Where(x => x.Id == qrId)
                .FirstAsync();

                return qrCode;

            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}
