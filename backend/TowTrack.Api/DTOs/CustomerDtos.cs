namespace TowTrack.Api.DTOs
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
        public int VehicleCount { get; set; }
        public int JobCount { get; set; }
    }

    public class CustomerDetailDto : CustomerDto
    {
        public List<VehicleDto> Vehicles { get; set; } = new();
        public List<JobListItemDto> Jobs { get; set; } = new();
    }

    public class CreateCustomerDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Note { get; set; }
    }

    public class UpdateCustomerDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Note { get; set; }
    }
}
