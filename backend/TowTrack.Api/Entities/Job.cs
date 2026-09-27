namespace TowTrack.Api.Entities
{
    public enum JobType
    {
        OtoKurtarma = 0,
        Cekici = 1,
        YolYardim = 2,
        Kaza = 3,
        Ariza = 4,
        Diger = 5
    }

    public enum JobStatus
    {
        Bekliyor = 0,
        Atandi = 1,
        Yolda = 2,
        Islemde = 3,
        Tamamlandi = 4,
        Iptal = 5
    }

    public enum PaymentStatus
    {
        Odenmedi = 0,
        KismenOdendi = 1,
        Odendi = 2
    }

    public class Job
    {
        public int Id { get; set; }
        public string JobNumber { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public int? TowTruckId { get; set; }
        public TowTruck? TowTruck { get; set; }

        public int? DriverId { get; set; }
        public Driver? Driver { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public DateTime? StartDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        public string PickupAddress { get; set; } = string.Empty;
        public string DestinationAddress { get; set; } = string.Empty;

        public JobType JobType { get; set; }
        public string? Description { get; set; }
        public double DistanceKm { get; set; }
        public decimal Price { get; set; }

        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Odenmedi;
        public JobStatus JobStatus { get; set; } = JobStatus.Bekliyor;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
