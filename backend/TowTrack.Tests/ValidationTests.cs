using TowTrack.Api.DTOs;
using TowTrack.Api.Validators;
using Xunit;

namespace TowTrack.Tests
{
    public class ValidationTests
    {
        [Fact]
        public void CreateCustomerDtoValidator_BosAdSoyad_HataVerir()
        {
            var validator = new CreateCustomerDtoValidator();
            var dto = new CreateCustomerDto { FullName = "", Phone = "0555 000 00 00" };

            var result = validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateCustomerDto.FullName));
        }

        [Fact]
        public void CreateCustomerDtoValidator_GecersizEmail_HataVerir()
        {
            var validator = new CreateCustomerDtoValidator();
            var dto = new CreateCustomerDto
            {
                FullName = "Test Kullanıcı",
                Phone = "0555 000 00 00",
                Email = "gecersiz-email"
            };

            var result = validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateCustomerDto.Email));
        }

        [Fact]
        public void CreateVehicleDtoValidator_GecersizModelYili_HataVerir()
        {
            var validator = new CreateVehicleDtoValidator();
            var dto = new CreateVehicleDto
            {
                CustomerId = 1,
                Plate = "34 ABC 123",
                Brand = "Test",
                Model = "Model",
                ModelYear = 1900
            };

            var result = validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateVehicleDto.ModelYear));
        }

        [Fact]
        public void CreateJobDtoValidator_GecersizIsTipi_HataVerir()
        {
            var validator = new CreateJobDtoValidator();
            var dto = new CreateJobDto
            {
                CustomerId = 1,
                VehicleId = 1,
                PickupAddress = "A",
                DestinationAddress = "B",
                JobType = "Olmayan Tip",
                DistanceKm = 5,
                Price = 100,
                PaymentStatus = "Ödenmedi"
            };

            var result = validator.Validate(dto);

            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateJobDto.JobType));
        }

        [Fact]
        public void CreateJobDtoValidator_GecerliVeri_HataVermez()
        {
            var validator = new CreateJobDtoValidator();
            var dto = new CreateJobDto
            {
                CustomerId = 1,
                VehicleId = 1,
                PickupAddress = "A Adresi",
                DestinationAddress = "B Adresi",
                JobType = "Çekici",
                DistanceKm = 12.5,
                Price = 750,
                PaymentStatus = "Ödenmedi"
            };

            var result = validator.Validate(dto);

            Assert.True(result.IsValid);
        }
    }
}
