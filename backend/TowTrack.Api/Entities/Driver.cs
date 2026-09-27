namespace TowTrack.Api.Entities
{
    public enum DriverStatus
    {
        Aktif = 0,
        Izinli = 1,
        Pasif = 2
    }

    public class Driver
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? LicenseClass { get; set; }
        public DateTime HireDate { get; set; }
        public DriverStatus Status { get; set; } = DriverStatus.Aktif;
        public string? Note { get; set; }

        public ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
