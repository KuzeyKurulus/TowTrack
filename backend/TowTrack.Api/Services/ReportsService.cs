using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Services
{
    public class ReportsService : IReportsService
    {
        private readonly TowTrackDbContext _context;

        public ReportsService(TowTrackDbContext context)
        {
            _context = context;
        }

        public async Task<ReportsDto> GetReportsAsync(DateTime? startDate, DateTime? endDate)
        {
            var today = DateTime.UtcNow.Date;
            var weekStart = today.AddDays(-(int)today.DayOfWeek + (today.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));
            var monthStart = new DateTime(today.Year, today.Month, 1);

            var rangeStart = startDate?.Date ?? monthStart;
            var rangeEnd = endDate?.Date.AddDays(1) ?? today.AddDays(1);

            bool IsRevenueEligible(Job j) =>
                j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi;

            var dailyRevenue = await _context.Jobs
                .Where(j => j.RequestDate >= today && j.RequestDate < today.AddDays(1) &&
                            (j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi))
                .SumAsync(j => (decimal?)j.Price) ?? 0;

            var weeklyRevenue = await _context.Jobs
                .Where(j => j.RequestDate >= weekStart && j.RequestDate < today.AddDays(1) &&
                            (j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi))
                .SumAsync(j => (decimal?)j.Price) ?? 0;

            var monthlyRevenue = await _context.Jobs
                .Where(j => j.RequestDate >= monthStart && j.RequestDate < today.AddDays(1) &&
                            (j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi))
                .SumAsync(j => (decimal?)j.Price) ?? 0;

            var totalCompletedJobs = await _context.Jobs.CountAsync(j => j.JobStatus == JobStatus.Tamamlandi);

            var jobsInRange = await _context.Jobs
                .AsNoTracking()
                .Include(j => j.TowTruck)
                .Include(j => j.Driver)
                .Where(j => j.RequestDate >= rangeStart && j.RequestDate < rangeEnd)
                .ToListAsync();

            var jobTypeDistribution = jobsInRange
                .GroupBy(j => j.JobType)
                .Select(g => new StatusCountDto { Status = EnumHelper.ToTurkish(g.Key), Count = g.Count() })
                .ToList();

            var paymentStatusDistribution = jobsInRange
                .GroupBy(j => j.PaymentStatus)
                .Select(g => new StatusCountDto { Status = EnumHelper.ToTurkish(g.Key), Count = g.Count() })
                .ToList();

            var towTruckUsage = jobsInRange
                .Where(j => j.TowTruck != null)
                .GroupBy(j => j.TowTruck!.Plate)
                .Select(g => new TowTruckUsageDto { Plate = g.Key, JobCount = g.Count() })
                .OrderByDescending(x => x.JobCount)
                .ToList();

            var driverStats = jobsInRange
                .Where(j => j.Driver != null)
                .GroupBy(j => j.Driver!.FullName)
                .Select(g => new DriverStatsDto
                {
                    FullName = g.Key,
                    JobCount = g.Count(),
                    TotalRevenue = g.Where(IsRevenueEligible).Sum(j => j.Price)
                })
                .OrderByDescending(x => x.TotalRevenue)
                .ToList();

            var revenueChart = new List<MonthlyRevenueDto>();
            for (int i = 5; i >= 0; i--)
            {
                var monthDate = monthStart.AddMonths(-i);
                var nextMonth = monthDate.AddMonths(1);

                var revenue = await _context.Jobs
                    .Where(j => j.RequestDate >= monthDate && j.RequestDate < nextMonth &&
                                (j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi))
                    .SumAsync(j => (decimal?)j.Price) ?? 0;

                revenueChart.Add(new MonthlyRevenueDto
                {
                    Month = monthDate.ToString("MMM yyyy", new System.Globalization.CultureInfo("tr-TR")),
                    Revenue = revenue
                });
            }

            return new ReportsDto
            {
                DailyRevenue = dailyRevenue,
                WeeklyRevenue = weeklyRevenue,
                MonthlyRevenue = monthlyRevenue,
                TotalCompletedJobs = totalCompletedJobs,
                JobTypeDistribution = jobTypeDistribution,
                PaymentStatusDistribution = paymentStatusDistribution,
                TowTruckUsage = towTruckUsage,
                DriverStats = driverStats,
                RevenueChart = revenueChart
            };
        }
    }
}
