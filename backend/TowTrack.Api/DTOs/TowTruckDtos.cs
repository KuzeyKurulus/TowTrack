namespace TowTrack.Api.DTOs
{
    public class TowTruckDto
    {
        public int Id { get; set; }
        public string Plate { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int ModelYear { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public double Capacity { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? LastMaintenanceDate { get; set; }
        public string? Note { get; set; }
    }

    public class CreateTowTruckDto
    {
        public string Plate { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int ModelYear { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public double Capacity { get; set; }
        public string Status { get; set; } = "Musait";
        public DateTime? LastMaintenanceDate { get; set; }
        public string? Note { get; set; }
    }

    public class UpdateTowTruckDto
    {
        public string Plate { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int ModelYear { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public double Capacity { get; set; }
        public string Status { get; set; } = "Musait";
        public DateTime? LastMaintenanceDate { get; set; }
        public string? Note { get; set; }
    }

    public class UpdateTowTruckStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
