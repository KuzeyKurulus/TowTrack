using TowTrack.Api.DTOs;
using TowTrack.Api.Helpers;
using TowTrack.Api.Services;
using Xunit;

namespace TowTrack.Tests
{
    public class CustomerServiceTests
    {
        [Fact]
        public async Task CreateAsync_GecerliMusteri_BasariylaEkler()
        {
            using var context = TestDbContextFactory.Create();
            var service = new CustomerService(context);

            var dto = new CreateCustomerDto
            {
                FullName = "Test Müşteri",
                Phone = "0555 000 00 00",
                Email = "test@example.com"
            };

            var result = await service.CreateAsync(dto);

            Assert.True(result.Id > 0);
            Assert.Equal("Test Müşteri", result.FullName);
            Assert.Equal(0, result.VehicleCount);
        }

        [Fact]
        public async Task GetByIdAsync_OlmayanId_NotFoundExceptionFirlatir()
        {
            using var context = TestDbContextFactory.Create();
            var service = new CustomerService(context);

            await Assert.ThrowsAsync<NotFoundException>(() => service.GetByIdAsync(999));
        }

        [Fact]
        public async Task UpdateAsync_MevcutMusteri_BilgileriGunceller()
        {
            using var context = TestDbContextFactory.Create();
            var service = new CustomerService(context);

            var created = await service.CreateAsync(new CreateCustomerDto
            {
                FullName = "Eski İsim",
                Phone = "0555 111 11 11"
            });

            var updated = await service.UpdateAsync(created.Id, new UpdateCustomerDto
            {
                FullName = "Yeni İsim",
                Phone = "0555 222 22 22"
            });

            Assert.Equal("Yeni İsim", updated.FullName);
            Assert.Equal("0555 222 22 22", updated.Phone);
        }

        [Fact]
        public async Task DeleteAsync_MevcutMusteri_Siler()
        {
            using var context = TestDbContextFactory.Create();
            var service = new CustomerService(context);

            var created = await service.CreateAsync(new CreateCustomerDto
            {
                FullName = "Silinecek Müşteri",
                Phone = "0555 333 33 33"
            });

            await service.DeleteAsync(created.Id);

            await Assert.ThrowsAsync<NotFoundException>(() => service.GetByIdAsync(created.Id));
        }

        [Fact]
        public async Task GetAllAsync_AramaFiltresi_DogruSonucDoner()
        {
            using var context = TestDbContextFactory.Create();
            var service = new CustomerService(context);

            await service.CreateAsync(new CreateCustomerDto { FullName = "Ahmet Yılmaz", Phone = "0555 111 11 11" });
            await service.CreateAsync(new CreateCustomerDto { FullName = "Mehmet Kaya", Phone = "0555 222 22 22" });

            var result = await service.GetAllAsync("ahmet");

            Assert.Single(result);
            Assert.Equal("Ahmet Yılmaz", result[0].FullName);
        }
    }
}
