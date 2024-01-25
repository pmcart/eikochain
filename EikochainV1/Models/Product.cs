using System.ComponentModel.DataAnnotations.Schema;

namespace EikochainV1.Models
{
    public class Product: BaseModel
    {
        public Guid Id { get; set; }
        public Guid OrgId { get; set; }

        public SupplyChain? SupplyChain { get; set; }
        public Guid? SupplyChainId { get; set; }
        public string? ProductDescription { get; set; }
        public string? ProductName { get; set; }
        public string? ProductImage { get; set; }
        public string? ProductSize { get; set; }
        public string? Url { get; set; }

        public bool? IsIntegration { get; set; } = false;

        public string? IntegrationType { get; set; }
        public string? ExternalId { get; set; }

        public string? Type { get; set; }

        public int? Weight { get; set; }
        public string? Tags { get; set; } = "{}";

        [NotMapped]
        public List<string> CategoryNames { get; set; }
    }
}