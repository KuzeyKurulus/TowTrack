using TowTrack.Api.Entities;

namespace TowTrack.Api.Helpers
{
    public static class EnumHelper
    {
        private static readonly Dictionary<TowTruckStatus, string> TowTruckStatusMap = new()
        {
            { TowTruckStatus.Musait, "Müsait" },
            { TowTruckStatus.Gorevde, "Görevde" },
            { TowTruckStatus.Bakimda, "Bakımda" },
            { TowTruckStatus.Pasif, "Pasif" },
        };

        private static readonly Dictionary<DriverStatus, string> DriverStatusMap = new()
        {
            { DriverStatus.Aktif, "Aktif" },
            { DriverStatus.Izinli, "İzinli" },
            { DriverStatus.Pasif, "Pasif" },
        };

        private static readonly Dictionary<JobType, string> JobTypeMap = new()
        {
            { JobType.OtoKurtarma, "Oto Kurtarma" },
            { JobType.Cekici, "Çekici" },
            { JobType.YolYardim, "Yol Yardım" },
            { JobType.Kaza, "Kaza" },
            { JobType.Ariza, "Arıza" },
            { JobType.Diger, "Diğer" },
        };

        private static readonly Dictionary<JobStatus, string> JobStatusMap = new()
        {
            { JobStatus.Bekliyor, "Bekliyor" },
            { JobStatus.Atandi, "Atandı" },
            { JobStatus.Yolda, "Yolda" },
            { JobStatus.Islemde, "İşlemde" },
            { JobStatus.Tamamlandi, "Tamamlandı" },
            { JobStatus.Iptal, "İptal" },
        };

        private static readonly Dictionary<PaymentStatus, string> PaymentStatusMap = new()
        {
            { PaymentStatus.Odenmedi, "Ödenmedi" },
            { PaymentStatus.KismenOdendi, "Kısmen Ödendi" },
            { PaymentStatus.Odendi, "Ödendi" },
        };

        public static string ToTurkish(TowTruckStatus status) => TowTruckStatusMap[status];
        public static string ToTurkish(DriverStatus status) => DriverStatusMap[status];
        public static string ToTurkish(JobType type) => JobTypeMap[type];
        public static string ToTurkish(JobStatus status) => JobStatusMap[status];
        public static string ToTurkish(PaymentStatus status) => PaymentStatusMap[status];

        public static TowTruckStatus ParseTowTruckStatus(string value)
        {
            var match = TowTruckStatusMap.FirstOrDefault(x => x.Value.Equals(value, StringComparison.OrdinalIgnoreCase)
                || x.Key.ToString().Equals(value, StringComparison.OrdinalIgnoreCase));
            if (match.Value == null) throw new ArgumentException($"Geçersiz çekici durumu: {value}");
            return match.Key;
        }

        public static DriverStatus ParseDriverStatus(string value)
        {
            var match = DriverStatusMap.FirstOrDefault(x => x.Value.Equals(value, StringComparison.OrdinalIgnoreCase)
                || x.Key.ToString().Equals(value, StringComparison.OrdinalIgnoreCase));
            if (match.Value == null) throw new ArgumentException($"Geçersiz sürücü durumu: {value}");
            return match.Key;
        }

        public static JobType ParseJobType(string value)
        {
            var match = JobTypeMap.FirstOrDefault(x => x.Value.Equals(value, StringComparison.OrdinalIgnoreCase)
                || x.Key.ToString().Equals(value, StringComparison.OrdinalIgnoreCase));
            if (match.Value == null) throw new ArgumentException($"Geçersiz iş tipi: {value}");
            return match.Key;
        }

        public static JobStatus ParseJobStatus(string value)
        {
            var match = JobStatusMap.FirstOrDefault(x => x.Value.Equals(value, StringComparison.OrdinalIgnoreCase)
                || x.Key.ToString().Equals(value, StringComparison.OrdinalIgnoreCase));
            if (match.Value == null) throw new ArgumentException($"Geçersiz iş durumu: {value}");
            return match.Key;
        }

        public static PaymentStatus ParsePaymentStatus(string value)
        {
            var match = PaymentStatusMap.FirstOrDefault(x => x.Value.Equals(value, StringComparison.OrdinalIgnoreCase)
                || x.Key.ToString().Equals(value, StringComparison.OrdinalIgnoreCase));
            if (match.Value == null) throw new ArgumentException($"Geçersiz ödeme durumu: {value}");
            return match.Key;
        }
    }
}
