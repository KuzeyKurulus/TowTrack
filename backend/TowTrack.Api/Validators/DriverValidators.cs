using FluentValidation;
using TowTrack.Api.DTOs;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Validators
{
    public class CreateDriverDtoValidator : AbstractValidator<CreateDriverDto>
    {
        public CreateDriverDtoValidator()
        {
            RuleFor(x => x.FullName).NotEmpty().WithMessage("Ad soyad zorunludur.");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Telefon numarası zorunludur.");
            RuleFor(x => x.HireDate).LessThanOrEqualTo(DateTime.UtcNow).WithMessage("İşe giriş tarihi gelecekte olamaz.");

            RuleFor(x => x.Status)
                .Must(BeAValidStatus).WithMessage("Geçersiz sürücü durumu. (Aktif, İzinli, Pasif)");
        }

        private bool BeAValidStatus(string status)
        {
            try { EnumHelper.ParseDriverStatus(status); return true; }
            catch { return false; }
        }
    }

    public class UpdateDriverDtoValidator : AbstractValidator<UpdateDriverDto>
    {
        public UpdateDriverDtoValidator()
        {
            RuleFor(x => x.FullName).NotEmpty().WithMessage("Ad soyad zorunludur.");
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Telefon numarası zorunludur.");
            RuleFor(x => x.HireDate).LessThanOrEqualTo(DateTime.UtcNow).WithMessage("İşe giriş tarihi gelecekte olamaz.");

            RuleFor(x => x.Status)
                .Must(BeAValidStatus).WithMessage("Geçersiz sürücü durumu. (Aktif, İzinli, Pasif)");
        }

        private bool BeAValidStatus(string status)
        {
            try { EnumHelper.ParseDriverStatus(status); return true; }
            catch { return false; }
        }
    }
}
