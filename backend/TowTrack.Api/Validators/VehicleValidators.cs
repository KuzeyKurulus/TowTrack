using FluentValidation;
using TowTrack.Api.DTOs;

namespace TowTrack.Api.Validators
{
    public class CreateVehicleDtoValidator : AbstractValidator<CreateVehicleDto>
    {
        public CreateVehicleDtoValidator()
        {
            RuleFor(x => x.CustomerId).GreaterThan(0).WithMessage("Müşteri seçilmelidir.");

            RuleFor(x => x.Plate)
                .NotEmpty().WithMessage("Plaka zorunludur.")
                .MaximumLength(15).WithMessage("Plaka en fazla 15 karakter olabilir.");

            RuleFor(x => x.Brand).NotEmpty().WithMessage("Marka zorunludur.");
            RuleFor(x => x.Model).NotEmpty().WithMessage("Model zorunludur.");

            RuleFor(x => x.ModelYear)
                .InclusiveBetween(1970, DateTime.UtcNow.Year + 1)
                .WithMessage($"Model yılı 1970 ile {DateTime.UtcNow.Year + 1} arasında olmalıdır.");

            RuleFor(x => x.Mileage)
                .GreaterThanOrEqualTo(0).WithMessage("Kilometre negatif olamaz.")
                .When(x => x.Mileage.HasValue);
        }
    }

    public class UpdateVehicleDtoValidator : AbstractValidator<UpdateVehicleDto>
    {
        public UpdateVehicleDtoValidator()
        {
            RuleFor(x => x.CustomerId).GreaterThan(0).WithMessage("Müşteri seçilmelidir.");

            RuleFor(x => x.Plate)
                .NotEmpty().WithMessage("Plaka zorunludur.")
                .MaximumLength(15).WithMessage("Plaka en fazla 15 karakter olabilir.");

            RuleFor(x => x.Brand).NotEmpty().WithMessage("Marka zorunludur.");
            RuleFor(x => x.Model).NotEmpty().WithMessage("Model zorunludur.");

            RuleFor(x => x.ModelYear)
                .InclusiveBetween(1970, DateTime.UtcNow.Year + 1)
                .WithMessage($"Model yılı 1970 ile {DateTime.UtcNow.Year + 1} arasında olmalıdır.");

            RuleFor(x => x.Mileage)
                .GreaterThanOrEqualTo(0).WithMessage("Kilometre negatif olamaz.")
                .When(x => x.Mileage.HasValue);
        }
    }
}
