namespace TowTrack.Api.Entities
{
    public enum TowTruckStatus
    {
        Musait = 0,
        Gorevde = 1,
        Bakimda = 2,
        Pasif = 3
    }

    public class TowTruck
    {
        public int Id { get; set; }
        public string Plate { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int ModelYear { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public double Capacity { get; set; }
        public TowTruckStatus Status { get; set; } = TowTruckStatus.Musait;
        public DateTime? LastMaintenanceDate { get; set; }
        public string? Note { get; set; }

        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
