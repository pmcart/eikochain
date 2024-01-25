namespace EikochainV1.Models
{
    public class Integration : BaseModel
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public string Type { get; set; }
        public string Url { get; set; }

        public string EmbedUrl { get; set; }
        public string Token { get; set; }
        public string ApiKey { get; set; }

    }
}