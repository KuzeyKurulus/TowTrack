namespace TowTrack.Api.DTOs
{
    public class DriverDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? LicenseClass { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
        public int JobCount { get; set; }
    }

    public class CreateDriverDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? LicenseClass { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = "Aktif";
        public string? Note { get; set; }
    }

    public class UpdateDriverDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? LicenseClass { get; set; }
        public DateTime HireDate { get; set; }
        public string Status { get; set; } = "Aktif";
        public string? Note { get; set; }
    }
}
