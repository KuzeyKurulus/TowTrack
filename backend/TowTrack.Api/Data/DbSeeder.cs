using TowTrack.Api.Entities;

namespace TowTrack.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(TowTrackDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Customers.Any())
            {
                // Seed zaten çalıştırılmış, tekrar veri ekleme.
                return;
            }

            var customers = new List<Customer>
            {
                new() { FullName = "Ahmet Yılmaz", Phone = "0532 111 22 33", Email = "ahmet.yilmaz@example.com", Address = "Kadıköy, İstanbul", CreatedAt = DateTime.UtcNow.AddDays(-120) },
                new() { FullName = "Elif Demir", Phone = "0533 222 33 44", Email = "elif.demir@example.com", Address = "Çankaya, Ankara", CreatedAt = DateTime.UtcNow.AddDays(-110) },
                new() { FullName = "Mehmet Kaya", Phone = "0534 333 44 55", Email = "mehmet.kaya@example.com", Address = "Konak, İzmir", CreatedAt = DateTime.UtcNow.AddDays(-100) },
                new() { FullName = "Zeynep Şahin", Phone = "0535 444 55 66", Email = "zeynep.sahin@example.com", Address = "Nilüfer, Bursa", CreatedAt = DateTime.UtcNow.AddDays(-90) },
                new() { FullName = "Mustafa Çelik", Phone = "0536 555 66 77", Email = "mustafa.celik@example.com", Address = "Muratpaşa, Antalya", CreatedAt = DateTime.UtcNow.AddDays(-80) },
                new() { FullName = "Ayşe Arslan", Phone = "0537 666 77 88", Email = "ayse.arslan@example.com", Address = "Osmangazi, Bursa", CreatedAt = DateTime.UtcNow.AddDays(-70) },
                new() { FullName = "Hüseyin Doğan", Phone = "0538 777 88 99", Email = "huseyin.dogan@example.com", Address = "Selçuklu, Konya", CreatedAt = DateTime.UtcNow.AddDays(-60) },
                new() { FullName = "Fatma Aydın", Phone = "0539 888 99 00", Email = "fatma.aydin@example.com", Address = "Şahinbey, Gaziantep", CreatedAt = DateTime.UtcNow.AddDays(-50) },
            };
            context.Customers.AddRange(customers);
            context.SaveChanges();

            var vehicles = new List<Vehicle>
            {
                new() { CustomerId = customers[0].Id, Plate = "34 ABC 101", Brand = "Renault", Model = "Clio", ModelYear = 2018, Color = "Beyaz", ChassisNumber = "VF1CLIO000001", Mileage = 85000 },
                new() { CustomerId = customers[0].Id, Plate = "34 ABC 102", Brand = "Fiat", Model = "Egea", ModelYear = 2021, Color = "Gri", ChassisNumber = "NM0EGEA000002", Mileage = 32000 },
                new() { CustomerId = customers[1].Id, Plate = "06 DEF 203", Brand = "Volkswagen", Model = "Passat", ModelYear = 2019, Color = "Siyah", ChassisNumber = "WVWPASSAT0003", Mileage = 64000 },
                new() { CustomerId = customers[2].Id, Plate = "35 GHI 304", Brand = "Toyota", Model = "Corolla", ModelYear = 2020, Color = "Kırmızı", ChassisNumber = "JTDCOROLLA004", Mileage = 41000 },
                new() { CustomerId = customers[3].Id, Plate = "16 JKL 405", Brand = "Hyundai", Model = "i20", ModelYear = 2017, Color = "Mavi", ChassisNumber = "KMHI20000005", Mileage = 98000 },
                new() { CustomerId = customers[4].Id, Plate = "07 MNO 506", Brand = "Ford", Model = "Focus", ModelYear = 2016, Color = "Gümüş", ChassisNumber = "WF0FOCUS0006", Mileage = 121000 },
                new() { CustomerId = customers[5].Id, Plate = "16 PQR 607", Brand = "Opel", Model = "Astra", ModelYear = 2015, Color = "Beyaz", ChassisNumber = "W0LASTRA0007", Mileage = 145000 },
                new() { CustomerId = customers[6].Id, Plate = "42 STU 708", Brand = "Peugeot", Model = "301", ModelYear = 2019, Color = "Kahverengi", ChassisNumber = "VF3P301000008", Mileage = 56000 },
                new() { CustomerId = customers[7].Id, Plate = "27 VWX 809", Brand = "Renault", Model = "Megane", ModelYear = 2022, Color = "Siyah", ChassisNumber = "VF1MEGANE009", Mileage = 15000 },
                new() { CustomerId = customers[1].Id, Plate = "06 YZA 910", Brand = "Honda", Model = "Civic", ModelYear = 2020, Color = "Beyaz", ChassisNumber = "SHHCIVIC00010", Mileage = 38000 },
            };
            context.Vehicles.AddRange(vehicles);
            context.SaveChanges();

            var towTrucks = new List<TowTruck>
            {
                new() { Plate = "34 TT 001", Brand = "Mercedes", Model = "Atego", ModelYear = 2018, VehicleType = "Platform", Capacity = 5000, Status = TowTruckStatus.Musait, LastMaintenanceDate = DateTime.UtcNow.AddDays(-20) },
                new() { Plate = "34 TT 002", Brand = "Ford", Model = "Cargo", ModelYear = 2016, VehicleType = "Vinç", Capacity = 3500, Status = TowTruckStatus.Gorevde, LastMaintenanceDate = DateTime.UtcNow.AddDays(-45) },
                new() { Plate = "34 TT 003", Brand = "Iveco", Model = "Daily", ModelYear = 2020, VehicleType = "Platform", Capacity = 4000, Status = TowTruckStatus.Musait, LastMaintenanceDate = DateTime.UtcNow.AddDays(-10) },
                new() { Plate = "34 TT 004", Brand = "MAN", Model = "TGL", ModelYear = 2015, VehicleType = "Ağır Vinç", Capacity = 8000, Status = TowTruckStatus.Bakimda, LastMaintenanceDate = DateTime.UtcNow.AddDays(-2) },
            };
            context.TowTrucks.AddRange(towTrucks);
            context.SaveChanges();

            var drivers = new List<Driver>
            {
                new() { FullName = "Kemal Öztürk", Phone = "0541 100 20 30", LicenseClass = "E", HireDate = DateTime.UtcNow.AddYears(-4), Status = DriverStatus.Aktif },
                new() { FullName = "Serkan Yıldız", Phone = "0542 200 30 40", LicenseClass = "C", HireDate = DateTime.UtcNow.AddYears(-2), Status = DriverStatus.Aktif },
                new() { FullName = "Murat Kılıç", Phone = "0543 300 40 50", LicenseClass = "E", HireDate = DateTime.UtcNow.AddYears(-6), Status = DriverStatus.Aktif },
                new() { FullName = "Emre Korkmaz", Phone = "0544 400 50 60", LicenseClass = "C", HireDate = DateTime.UtcNow.AddYears(-1), Status = DriverStatus.Izinli },
                new() { FullName = "Tolga Aksoy", Phone = "0545 500 60 70", LicenseClass = "D", HireDate = DateTime.UtcNow.AddYears(-3), Status = DriverStatus.Aktif },
            };
            context.Drivers.AddRange(drivers);
            context.SaveChanges();

            var pickupAddresses = new[]
            {
                "E-5 Karayolu, Kadıköy", "Atatürk Bulvarı, Çankaya", "Sahil Yolu, Konak",
                "Fevzi Çakmak Cad., Nilüfer", "Konyaaltı Sahili, Muratpaşa", "İstanbul Yolu, Osmangazi",
                "Ankara Yolu, Selçuklu", "Üniversite Bulvarı, Şahinbey", "TEM Otoyolu, Bahçelievler",
                "Kordon Boyu, Alsancak"
            };
            var destinationAddresses = new[]
            {
                "Yetkili Servis, Ümraniye", "Özel Servis, Etimesgut", "TOFAŞ Yetkili Bayi, Bornova",
                "Sanayi Sitesi, Nilüfer", "Oto Sanayi, Kepez", "Ford Yetkili Servis, Yıldırım",
                "Renault Servis, Selçuklu", "Şehir Dışı Servis, Şahinbey", "Marka Servisi, Bakırköy",
                "Lastikçi ve Servis, Karşıyaka"
            };

            var jobTypes = Enum.GetValues<JobType>();
            var random = new Random(42);
            var jobs = new List<Job>();

            for (int i = 1; i <= 20; i++)
            {
                var customer = customers[random.Next(customers.Count)];
                var customerVehicles = vehicles.Where(v => v.CustomerId == customer.Id).ToList();
                var vehicle = customerVehicles[random.Next(customerVehicles.Count)];
                var requestDate = DateTime.UtcNow.AddDays(-random.Next(0, 60)).AddHours(-random.Next(0, 23));

                JobStatus status = i % 6 == 0 ? JobStatus.Iptal
                    : i % 5 == 0 ? JobStatus.Bekliyor
                    : i % 4 == 0 ? JobStatus.Islemde
                    : i % 3 == 0 ? JobStatus.Atandi
                    : JobStatus.Tamamlandi;

                PaymentStatus payment = status == JobStatus.Tamamlandi
                    ? (i % 2 == 0 ? PaymentStatus.Odendi : PaymentStatus.KismenOdendi)
                    : PaymentStatus.Odenmedi;

                var towTruck = towTrucks[random.Next(towTrucks.Count)];
                var driver = drivers[random.Next(drivers.Count)];

                jobs.Add(new Job
                {
                    JobNumber = $"TT-{requestDate.Year}-{i:D5}",
                    CustomerId = customer.Id,
                    VehicleId = vehicle.Id,
                    TowTruckId = status == JobStatus.Bekliyor ? null : towTruck.Id,
                    DriverId = status == JobStatus.Bekliyor ? null : driver.Id,
                    RequestDate = requestDate,
                    StartDate = status == JobStatus.Bekliyor ? null : requestDate.AddMinutes(random.Next(10, 60)),
                    CompletedDate = status == JobStatus.Tamamlandi ? requestDate.AddHours(random.Next(1, 5)) : null,
                    PickupAddress = pickupAddresses[random.Next(pickupAddresses.Length)],
                    DestinationAddress = destinationAddresses[random.Next(destinationAddresses.Length)],
                    JobType = jobTypes[random.Next(jobTypes.Length)],
                    Description = "Müşteri talebi üzerine oluşturulan iş kaydı.",
                    DistanceKm = Math.Round(random.Next(3, 85) + random.NextDouble(), 1),
                    Price = random.Next(400, 3500),
                    PaymentStatus = payment,
                    JobStatus = status,
                    CreatedAt = requestDate
                });
            }

            context.Jobs.AddRange(jobs);
            context.SaveChanges();
        }
    }
}
