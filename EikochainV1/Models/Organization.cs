namespace EikochainV1.Models
{
    public class Organization
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string PrimaryEmail { get; set; }

        public string? URL { get; set; }

        public string? Metadata { get; set; }

        public string? LogoImageUrl { get; set; }
        public string? BackgroundImageUrl { get; set; }
        public string? MiniLogoUrl { get; set; }
    }
}