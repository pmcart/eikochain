using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Web.Mvc;

namespace EikochainV1.Models
{
    public class SupplyChain
    {
        public Guid Id { get; set; }
        public string? Size { get; set; }
        public string? Title { get; set; }
        public string? Url { get; set; }
        public int? Views { get; set; } = 0;
        [JsonPropertyName("OldSteps")]
        public string? Steps { get; set; } = "{}";
        [AllowHtml]
        public string? SupplyChainData { get; set; } = "{}";

        [AllowHtml]
        public string? CurrentPreviewData { get; set; } = "{}";
        public int WebsiteViews { get; set; } = 0;
        public int QrViews { get; set; } = 0;
        public Guid OrgId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        [NotMapped]
        public List<SupplyChainStep>? steps { get; set; }
    }
}