using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly TowTrackDbContext _context;

        public DashboardService(TowTrackDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            var today = DateTime.UtcNow.Date;
            var monthStart = new DateTime(today.Year, today.Month, 1);

            var totalJobs = await _context.Jobs.CountAsync();
            var todaysJobs = await _context.Jobs.CountAsync(j => j.RequestDate >= today && j.RequestDate < today.AddDays(1));
            var pendingJobs = await _context.Jobs.CountAsync(j => j.JobStatus == JobStatus.Bekliyor);
            var completedJobs = await _context.Jobs.CountAsync(j => j.JobStatus == JobStatus.Tamamlandi);

            var totalRevenue = await _context.Jobs
                .Where(j => j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi)
                .SumAsync(j => (decimal?)j.Price) ?? 0;

            var monthlyRevenue = await _context.Jobs
                .Where(j => j.RequestDate >= monthStart &&
                            (j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi))
                .SumAsync(j => (decimal?)j.Price) ?? 0;

            var activeTowTrucks = await _context.TowTrucks.CountAsync(t => t.Status != TowTruckStatus.Pasif);
            var registeredCustomers = await _context.Customers.CountAsync();

            var recentJobsRaw = await _context.Jobs
                .AsNoTracking()
                .Include(j => j.Customer)
                .Include(j => j.Vehicle)
                .Include(j => j.TowTruck)
                .Include(j => j.Driver)
                .OrderByDescending(j => j.RequestDate)
                .Take(5)
                .ToListAsync();

            var recentJobs = recentJobsRaw.Select(j => new JobListItemDto
            {
                Id = j.Id,
                JobNumber = j.JobNumber,
                RequestDate = j.RequestDate,
                CustomerName = j.Customer!.FullName,
                Plate = j.Vehicle!.Plate,
                TowTruckPlate = j.TowTruck?.Plate,
                DriverName = j.Driver?.FullName,
                JobType = EnumHelper.ToTurkish(j.JobType),
                Price = j.Price,
                PaymentStatus = EnumHelper.ToTurkish(j.PaymentStatus),
                JobStatus = EnumHelper.ToTurkish(j.JobStatus)
            }).ToList();

            var statusDistributionRaw = await _context.Jobs
                .GroupBy(j => j.JobStatus)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var statusDistribution = statusDistributionRaw
                .Select(x => new StatusCountDto { Status = EnumHelper.ToTurkish(x.Status), Count = x.Count })
                .ToList();

            var monthlyChart = new List<MonthlyRevenueDto>();
            for (int i = 5; i >= 0; i--)
            {
                var monthDate = monthStart.AddMonths(-i);
                var nextMonth = monthDate.AddMonths(1);

                var revenue = await _context.Jobs
                    .Where(j => j.RequestDate >= monthDate && j.RequestDate < nextMonth &&
                                (j.PaymentStatus == PaymentStatus.Odendi || j.PaymentStatus == PaymentStatus.KismenOdendi))
                    .SumAsync(j => (decimal?)j.Price) ?? 0;

                monthlyChart.Add(new MonthlyRevenueDto
                {
                    Month = monthDate.ToString("MMM yyyy", new System.Globalization.CultureInfo("tr-TR")),
                    Revenue = revenue
                });
            }

            return new DashboardSummaryDto
            {
                TotalJobs = totalJobs,
                TodaysJobs = todaysJobs,
                PendingJobs = pendingJobs,
                CompletedJobs = completedJobs,
                TotalRevenue = totalRevenue,
                MonthlyRevenue = monthlyRevenue,
                ActiveTowTrucks = activeTowTrucks,
                RegisteredCustomers = registeredCustomers,
                RecentJobs = recentJobs,
                JobStatusDistribution = statusDistribution,
                MonthlyRevenueChart = monthlyChart
            };
        }
    }
}
