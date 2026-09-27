namespace TowTrack.Api.DTOs
{
    public class JobListItemDto
    {
        public int Id { get; set; }
        public string JobNumber { get; set; } = string.Empty;
        public DateTime RequestDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Plate { get; set; } = string.Empty;
        public string? TowTruckPlate { get; set; }
        public string? DriverName { get; set; }
        public string JobType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string JobStatus { get; set; } = string.Empty;
    }

    public class JobDetailDto
    {
        public int Id { get; set; }
        public string JobNumber { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;

        public int VehicleId { get; set; }
        public string VehiclePlate { get; set; } = string.Empty;
        public string VehicleBrandModel { get; set; } = string.Empty;

        public int? TowTruckId { get; set; }
        public string? TowTruckPlate { get; set; }

        public int? DriverId { get; set; }
        public string? DriverName { get; set; }

        public DateTime RequestDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        public string PickupAddress { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;

        public string JobType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double DistanceKm { get; set; }
        public decimal Price { get; set; }

        public string PaymentStatus { get; set; } = string.Empty;
        public string JobStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateJobDto
    {
        public int CustomerId { get; set; }
        public int VehicleId { get; set; }
        public int? TowTruckId { get; set; }
        public int? DriverId { get; set; }
        public string PickupAddress { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double DistanceKm { get; set; }
        public decimal Price { get; set; }
        public string PaymentStatus { get; set; } = "Odenmedi";
    }

    public class UpdateJobDto
    {
        public int CustomerId { get; set; }
        public int VehicleId { get; set; }
        public int? TowTruckId { get; set; }
        public int? DriverId { get; set; }
        public string PickupAddress { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string? Description { get; set; }
        public double DistanceKm { get; set; }
        public decimal Price { get; set; }
        public string PaymentStatus { get; set; } = "Odenmedi";
        public string JobStatus { get; set; } = "Bekliyor";
    }

    public class UpdateJobStatusDto
    {
        public string JobStatus { get; set; } = string.Empty;
    }

    public class JobFilterDto
    {
        public string? JobNumber { get; set; }
        public string? Plate { get; set; }
        public string? CustomerName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? JobStatus { get; set; }
        public string? PaymentStatus { get; set; }
        public string? JobType { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
