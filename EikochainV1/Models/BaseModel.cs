namespace EikochainV1.Models
{
    public class BaseModel
    {
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime UpdatedDate { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
    }
}