using EikochainV1.Models;

namespace EikochainV1.Services
{
    public interface IEikoQrCodeService
    {
        public Task<bool> Create(EikochainUser user, Guid supplyChainId, string imageData);

        public Task<bool> AssignQrCode(Guid orgId, Guid qrCodeGuid, Guid supplyChainId);
        public Task<IEnumerable<EikoQrCode>> GetAllQrCodes(Guid orgId);
        public Task<EikoQrCode> GetBySupplyChainId(Guid supplyChainId, Guid orgId);
        //public Task<bool> Update(EikoQrCode qrCode, Guid orgId);
        public Task<EikoQrCode> GetById(Guid qrId, Guid orgId);
    }
}
