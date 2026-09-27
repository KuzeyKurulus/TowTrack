using FluentValidation;
using TowTrack.Api.DTOs;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Validators
{
    public class CreateTowTruckDtoValidator : AbstractValidator<CreateTowTruckDto>
    {
        public CreateTowTruckDtoValidator()
        {
            RuleFor(x => x.Plate).NotEmpty().WithMessage("Plaka zorunludur.");
            RuleFor(x => x.Brand).NotEmpty().WithMessage("Marka zorunludur.");
            RuleFor(x => x.Model).NotEmpty().WithMessage("Model zorunludur.");
            RuleFor(x => x.VehicleType).NotEmpty().WithMessage("Araç tipi zorunludur.");
            RuleFor(x => x.Capacity).GreaterThan(0).WithMessage("Kapasite 0'dan büyük olmalıdır.");

            RuleFor(x => x.ModelYear)
                .InclusiveBetween(1970, DateTime.UtcNow.Year + 1)
                .WithMessage($"Model yılı 1970 ile {DateTime.UtcNow.Year + 1} arasında olmalıdır.");

            RuleFor(x => x.Status)
                .Must(BeAValidStatus).WithMessage("Geçersiz çekici durumu. (Müsait, Görevde, Bakımda, Pasif)");
        }

        private bool BeAValidStatus(string status)
        {
            try { EnumHelper.ParseTowTruckStatus(status); return true; }
            catch { return false; }
        }
    }

    public class UpdateTowTruckDtoValidator : AbstractValidator<UpdateTowTruckDto>
    {
        public UpdateTowTruckDtoValidator()
        {
            RuleFor(x => x.Plate).NotEmpty().WithMessage("Plaka zorunludur.");
            RuleFor(x => x.Brand).NotEmpty().WithMessage("Marka zorunludur.");
            RuleFor(x => x.Model).NotEmpty().WithMessage("Model zorunludur.");
            RuleFor(x => x.VehicleType).NotEmpty().WithMessage("Araç tipi zorunludur.");
            RuleFor(x => x.Capacity).GreaterThan(0).WithMessage("Kapasite 0'dan büyük olmalıdır.");

            RuleFor(x => x.ModelYear)
                .InclusiveBetween(1970, DateTime.UtcNow.Year + 1)
                .WithMessage($"Model yılı 1970 ile {DateTime.UtcNow.Year + 1} arasında olmalıdır.");

            RuleFor(x => x.Status)
                .Must(BeAValidStatus).WithMessage("Geçersiz çekici durumu. (Müsait, Görevde, Bakımda, Pasif)");
        }

        private bool BeAValidStatus(string status)
        {
            try { EnumHelper.ParseTowTruckStatus(status); return true; }
            catch { return false; }
        }
    }

    public class UpdateTowTruckStatusDtoValidator : AbstractValidator<UpdateTowTruckStatusDto>
    {
        public UpdateTowTruckStatusDtoValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Durum zorunludur.")
                .Must(BeAValidStatus).WithMessage("Geçersiz çekici durumu. (Müsait, Görevde, Bakımda, Pasif)");
        }

        private bool BeAValidStatus(string status)
        {
            try { EnumHelper.ParseTowTruckStatus(status); return true; }
            catch { return false; }
        }
    }
}
