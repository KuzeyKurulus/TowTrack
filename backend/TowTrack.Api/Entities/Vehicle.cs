namespace TowTrack.Api.Entities
{
    public class Vehicle
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string Plate { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int ModelYear { get; set; }
        public string? Color { get; set; }
        public string? ChassisNumber { get; set; }
        public int? Mileage { get; set; }
        public string? Note { get; set; }

        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
