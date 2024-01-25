namespace EikochainV1.Models
{
    public class SupplyChainStep
    {
        public Guid Id { get; set; }
        public Guid OrgId { get; set; }
        public Guid SupplyChainId { get; set; }
        public string? StepId { get; set; }
        public string? StepTitle { get; set; }
        public int WebsiteClicks { get; set; } = 0;
        public int QrClicks { get; set; } = 0;
    }
}