namespace TowTrack.Api.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalJobs { get; set; }
        public int TodaysJobs { get; set; }
        public int PendingJobs { get; set; }
        public int CompletedJobs { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int ActiveTowTrucks { get; set; }
        public int RegisteredCustomers { get; set; }
        public List<JobListItemDto> RecentJobs { get; set; } = new();
        public List<StatusCountDto> JobStatusDistribution { get; set; } = new();
        public List<MonthlyRevenueDto> MonthlyRevenueChart { get; set; } = new();
    }

    public class StatusCountDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class MonthlyRevenueDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
    }

    public class ReportsDto
    {
        public decimal DailyRevenue { get; set; }
        public decimal WeeklyRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public int TotalCompletedJobs { get; set; }
        public List<StatusCountDto> JobTypeDistribution { get; set; } = new();
        public List<StatusCountDto> PaymentStatusDistribution { get; set; } = new();
        public List<TowTruckUsageDto> TowTruckUsage { get; set; } = new();
        public List<DriverStatsDto> DriverStats { get; set; } = new();
        public List<MonthlyRevenueDto> RevenueChart { get; set; } = new();
    }

    public class TowTruckUsageDto
    {
        public string Plate { get; set; } = string.Empty;
        public int JobCount { get; set; }
    }

    public class DriverStatsDto
    {
        public string FullName { get; set; } = string.Empty;
        public int JobCount { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
