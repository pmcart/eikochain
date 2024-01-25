namespace EikochainV1.Models
{
    public class EikoQrCode: BaseModel
    {
        public Guid Id { get; set; }

        public virtual Organization Organization { get; set; }
        public Guid OrganizationId { get; set; }
        public string? Name { get; set; }
        public string? Url { get; set; }
        public string? Description { get; set; }

        public string? PreviousDescription { get; set; }
        public string? ImageDataString { get; set; }
        public Guid? SupplyChainId { get; set; }
    }
}