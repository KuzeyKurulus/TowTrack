using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Services;
using Xunit;

namespace TowTrack.Tests
{
    public class JobServiceTests
    {
        private static async Task<(Customer customer, Vehicle vehicle)> SeedCustomerAndVehicleAsync(TowTrackDbContext context)
        {
            var customer = new Customer { FullName = "Test Müşteri", Phone = "0555 000 00 00", CreatedAt = DateTime.UtcNow };
            context.Customers.Add(customer);
            await context.SaveChangesAsync();

            var vehicle = new Vehicle
            {
                CustomerId = customer.Id,
                Plate = "34 TST 001",
                Brand = "Test Marka",
                Model = "Test Model",
                ModelYear = 2020
            };
            context.Vehicles.Add(vehicle);
            await context.SaveChangesAsync();

            return (customer, vehicle);
        }

        [Fact]
        public async Task CreateAsync_GecerliIs_JobNumberOtomatikOlusturulur()
        {
            using var context = TestDbContextFactory.Create();
            var (customer, vehicle) = await SeedCustomerAndVehicleAsync(context);
            var service = new JobService(context);

            var dto = new CreateJobDto
            {
                CustomerId = customer.Id,
                VehicleId = vehicle.Id,
                PickupAddress = "A Adresi",
                DestinationAddress = "B Adresi",
                JobType = "Çekici",
                DistanceKm = 10,
                Price = 500,
                PaymentStatus = "Ödenmedi"
            };

            var result = await service.CreateAsync(dto);

            Assert.StartsWith($"TT-{DateTime.UtcNow.Year}-", result.JobNumber);
            Assert.Equal("Bekliyor", result.JobStatus);
        }

        [Fact]
        public async Task CreateAsync_ArdArdaIsler_JobNumberArtarak_Devam_Eder()
        {
            using var context = TestDbContextFactory.Create();
            var (customer, vehicle) = await SeedCustomerAndVehicleAsync(context);
            var service = new JobService(context);

            var dto = new CreateJobDto
            {
                CustomerId = customer.Id,
                VehicleId = vehicle.Id,
                PickupAddress = "A",
                DestinationAddress = "B",
                JobType = "Çekici",
                DistanceKm = 5,
                Price = 300,
                PaymentStatus = "Ödenmedi"
            };

            var first = await service.CreateAsync(dto);
            var second = await service.CreateAsync(dto);

            var firstSequence = int.Parse(first.JobNumber.Split('-')[2]);
            var secondSequence = int.Parse(second.JobNumber.Split('-')[2]);

            Assert.Equal(firstSequence + 1, secondSequence);
        }

        [Fact]
        public async Task GetAllAsync_SayfalamaCalisir()
        {
            using var context = TestDbContextFactory.Create();
            var (customer, vehicle) = await SeedCustomerAndVehicleAsync(context);
            var service = new JobService(context);

            for (int i = 0; i < 5; i++)
            {
                await service.CreateAsync(new CreateJobDto
                {
                    CustomerId = customer.Id,
                    VehicleId = vehicle.Id,
                    PickupAddress = "A",
                    DestinationAddress = "B",
                    JobType = "Çekici",
                    DistanceKm = 5,
                    Price = 100,
                    PaymentStatus = "Ödenmedi"
                });
            }

            var result = await service.GetAllAsync(new JobFilterDto { Page = 1, PageSize = 2 });

            Assert.Equal(5, result.TotalCount);
            Assert.Equal(2, result.Items.Count);
        }

        [Fact]
        public async Task UpdateStatusAsync_TamamlandiYapinca_CompletedDateDoldurulur()
        {
            using var context = TestDbContextFactory.Create();
            var (customer, vehicle) = await SeedCustomerAndVehicleAsync(context);
            var service = new JobService(context);

            var created = await service.CreateAsync(new CreateJobDto
            {
                CustomerId = customer.Id,
                VehicleId = vehicle.Id,
                PickupAddress = "A",
                DestinationAddress = "B",
                JobType = "Çekici",
                DistanceKm = 5,
                Price = 100,
                PaymentStatus = "Ödenmedi"
            });

            var updated = await service.UpdateStatusAsync(created.Id, new UpdateJobStatusDto { JobStatus = "Tamamlandı" });

            Assert.Equal("Tamamlandı", updated.JobStatus);
            Assert.NotNull(updated.CompletedDate);
        }
    }
}
