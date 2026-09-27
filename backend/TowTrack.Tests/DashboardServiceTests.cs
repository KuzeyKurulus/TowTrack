using TowTrack.Api.Data;
using TowTrack.Api.Entities;
using TowTrack.Api.Services;
using Xunit;

namespace TowTrack.Tests
{
    public class DashboardServiceTests
    {
        private static async Task<Job> AddJobAsync(
            TowTrackDbContext context,
            Customer customer,
            Vehicle vehicle,
            decimal price,
            PaymentStatus paymentStatus,
            JobStatus jobStatus,
            DateTime requestDate)
        {
            var job = new Job
            {
                JobNumber = $"TT-{requestDate.Year}-{Guid.NewGuid().ToString()[..5]}",
                CustomerId = customer.Id,
                VehicleId = vehicle.Id,
                PickupAddress = "A",
                DestinationAddress = "B",
                JobType = JobType.Cekici,
                DistanceKm = 10,
                Price = price,
                PaymentStatus = paymentStatus,
                JobStatus = jobStatus,
                RequestDate = requestDate,
                CreatedAt = requestDate
            };
            context.Jobs.Add(job);
            await context.SaveChangesAsync();
            return job;
        }

        [Fact]
        public async Task GetSummaryAsync_ToplamGeliriSadeceOdenenlerdenHesaplar()
        {
            using var context = TestDbContextFactory.Create();

            var customer = new Customer { FullName = "Test Müşteri", Phone = "0555 000 00 00" };
            context.Customers.Add(customer);
            await context.SaveChangesAsync();

            var vehicle = new Vehicle { CustomerId = customer.Id, Plate = "34 XYZ 001", Brand = "Test", Model = "Model", ModelYear = 2020 };
            context.Vehicles.Add(vehicle);
            await context.SaveChangesAsync();

            var today = DateTime.UtcNow;

            await AddJobAsync(context, customer, vehicle, 1000, PaymentStatus.Odendi, JobStatus.Tamamlandi, today);
            await AddJobAsync(context, customer, vehicle, 500, PaymentStatus.KismenOdendi, JobStatus.Tamamlandi, today);
            await AddJobAsync(context, customer, vehicle, 2000, PaymentStatus.Odenmedi, JobStatus.Bekliyor, today);

            var service = new DashboardService(context);
            var summary = await service.GetSummaryAsync();

            // Sadece ödenen ve kısmen ödenen işler gelire dahil edilmeli (1000 + 500 = 1500)
            Assert.Equal(1500m, summary.TotalRevenue);
            Assert.Equal(3, summary.TotalJobs);
            Assert.Equal(1, summary.PendingJobs);
            Assert.Equal(2, summary.CompletedJobs);
        }

        [Fact]
        public async Task GetSummaryAsync_BugunkuIsleriDogruSayar()
        {
            using var context = TestDbContextFactory.Create();

            var customer = new Customer { FullName = "Test Müşteri", Phone = "0555 000 00 00" };
            context.Customers.Add(customer);
            await context.SaveChangesAsync();

            var vehicle = new Vehicle { CustomerId = customer.Id, Plate = "34 XYZ 002", Brand = "Test", Model = "Model", ModelYear = 2020 };
            context.Vehicles.Add(vehicle);
            await context.SaveChangesAsync();

            await AddJobAsync(context, customer, vehicle, 100, PaymentStatus.Odenmedi, JobStatus.Bekliyor, DateTime.UtcNow);
            await AddJobAsync(context, customer, vehicle, 100, PaymentStatus.Odenmedi, JobStatus.Bekliyor, DateTime.UtcNow.AddDays(-5));

            var service = new DashboardService(context);
            var summary = await service.GetSummaryAsync();

            Assert.Equal(1, summary.TodaysJobs);
        }
    }
}
