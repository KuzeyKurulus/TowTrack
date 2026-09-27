using FluentValidation;
using TowTrack.Api.DTOs;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Validators
{
    public class CreateJobDtoValidator : AbstractValidator<CreateJobDto>
    {
        public CreateJobDtoValidator()
        {
            RuleFor(x => x.CustomerId).GreaterThan(0).WithMessage("Müşteri seçilmelidir.");
            RuleFor(x => x.VehicleId).GreaterThan(0).WithMessage("Araç seçilmelidir.");

            RuleFor(x => x.PickupAddress).NotEmpty().WithMessage("Alış adresi zorunludur.");
            RuleFor(x => x.DestinationAddress).NotEmpty().WithMessage("Varış adresi zorunludur.");

            RuleFor(x => x.DistanceKm).GreaterThanOrEqualTo(0).WithMessage("Mesafe negatif olamaz.");
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0).WithMessage("Ücret negatif olamaz.");

            RuleFor(x => x.JobType)
                .Must(BeAValidJobType).WithMessage("Geçersiz iş tipi.");

            RuleFor(x => x.PaymentStatus)
                .Must(BeAValidPaymentStatus).WithMessage("Geçersiz ödeme durumu.");
        }

        private bool BeAValidJobType(string value)
        {
            try { EnumHelper.ParseJobType(value); return true; }
            catch { return false; }
        }

        private bool BeAValidPaymentStatus(string value)
        {
            try { EnumHelper.ParsePaymentStatus(value); return true; }
            catch { return false; }
        }
    }

    public class UpdateJobDtoValidator : AbstractValidator<UpdateJobDto>
    {
        public UpdateJobDtoValidator()
        {
            RuleFor(x => x.CustomerId).GreaterThan(0).WithMessage("Müşteri seçilmelidir.");
            RuleFor(x => x.VehicleId).GreaterThan(0).WithMessage("Araç seçilmelidir.");

            RuleFor(x => x.PickupAddress).NotEmpty().WithMessage("Alış adresi zorunludur.");
            RuleFor(x => x.DestinationAddress).NotEmpty().WithMessage("Varış adresi zorunludur.");

            RuleFor(x => x.DistanceKm).GreaterThanOrEqualTo(0).WithMessage("Mesafe negatif olamaz.");
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0).WithMessage("Ücret negatif olamaz.");

            RuleFor(x => x.JobType).Must(BeAValidJobType).WithMessage("Geçersiz iş tipi.");
            RuleFor(x => x.PaymentStatus).Must(BeAValidPaymentStatus).WithMessage("Geçersiz ödeme durumu.");
            RuleFor(x => x.JobStatus).Must(BeAValidJobStatus).WithMessage("Geçersiz iş durumu.");
        }

        private bool BeAValidJobType(string value)
        {
            try { EnumHelper.ParseJobType(value); return true; }
            catch { return false; }
        }

        private bool BeAValidPaymentStatus(string value)
        {
            try { EnumHelper.ParsePaymentStatus(value); return true; }
            catch { return false; }
        }

        private bool BeAValidJobStatus(string value)
        {
            try { EnumHelper.ParseJobStatus(value); return true; }
            catch { return false; }
        }
    }

    public class UpdateJobStatusDtoValidator : AbstractValidator<UpdateJobStatusDto>
    {
        public UpdateJobStatusDtoValidator()
        {
            RuleFor(x => x.JobStatus)
                .NotEmpty().WithMessage("İş durumu zorunludur.")
                .Must(BeAValidJobStatus).WithMessage("Geçersiz iş durumu.");
        }

        private bool BeAValidJobStatus(string value)
        {
            try { EnumHelper.ParseJobStatus(value); return true; }
            catch { return false; }
        }
    }
}
