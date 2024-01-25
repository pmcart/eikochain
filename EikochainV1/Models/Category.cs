namespace EikochainV1.Models
{
    public class Category: BaseModel
    {
        public Guid Id { get; set; }
        public Guid OrgId { get; set; }
        public string? CategoryName { get; set; }
    }
}