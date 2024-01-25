namespace EikochainV1.Models
{
    public class Setting: BaseModel
    {
        public Guid Id { get; set; }

        public Guid OrgId { get; set; }
        public string? MiniLogo { get; set; }
        public string? LogoImage { get; set; }
        public string? BackgroundImage { get; set; }

    }
}