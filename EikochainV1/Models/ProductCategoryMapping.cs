namespace EikochainV1.Models
{
    public class ProductCategoryMapping: BaseModel
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid CategoryId { get; set; }
    }
}