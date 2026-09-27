using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Services
{
    public class JobService : IJobService
    {
        private readonly TowTrackDbContext _context;

        public JobService(TowTrackDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<JobListItemDto>> GetAllAsync(JobFilterDto filter)
        {
            var query = _context.Jobs
                .AsNoTracking()
                .Include(j => j.Customer)
                .Include(j => j.Vehicle)
                .Include(j => j.TowTruck)
                .Include(j => j.Driver)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.JobNumber))
                query = query.Where(j => j.JobNumber.ToLower().Contains(filter.JobNumber.Trim().ToLower()));

            if (!string.IsNullOrWhiteSpace(filter.Plate))
                query = query.Where(j => j.Vehicle!.Plate.ToLower().Contains(filter.Plate.Trim().ToLower()));

            if (!string.IsNullOrWhiteSpace(filter.CustomerName))
                query = query.Where(j => j.Customer!.FullName.ToLower().Contains(filter.CustomerName.Trim().ToLower()));

            if (filter.StartDate.HasValue)
                query = query.Where(j => j.RequestDate >= filter.StartDate.Value.Date);

            if (filter.EndDate.HasValue)
                query = query.Where(j => j.RequestDate < filter.EndDate.Value.Date.AddDays(1));

            if (!string.IsNullOrWhiteSpace(filter.JobStatus))
            {
                var status = EnumHelper.ParseJobStatus(filter.JobStatus);
                query = query.Where(j => j.JobStatus == status);
            }

            if (!string.IsNullOrWhiteSpace(filter.PaymentStatus))
            {
                var payment = EnumHelper.ParsePaymentStatus(filter.PaymentStatus);
                query = query.Where(j => j.PaymentStatus == payment);
            }

            if (!string.IsNullOrWhiteSpace(filter.JobType))
            {
                var type = EnumHelper.ParseJobType(filter.JobType);
                query = query.Where(j => j.JobType == type);
            }

            var totalCount = await query.CountAsync();

            var page = filter.Page < 1 ? 1 : filter.Page;
            var pageSize = filter.PageSize is < 1 or > 200 ? 20 : filter.PageSize;

            var jobs = await query
                .OrderByDescending(j => j.RequestDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = jobs.Select(j => new JobListItemDto
            {
                Id = j.Id,
                JobNumber = j.JobNumber,
                RequestDate = j.RequestDate,
                CustomerName = j.Customer!.FullName,
                Plate = j.Vehicle!.Plate,
                TowTruckPlate = j.TowTruck?.Plate,
                DriverName = j.Driver?.FullName,
                JobType = EnumHelper.ToTurkish(j.JobType),
                Price = j.Price,
                PaymentStatus = EnumHelper.ToTurkish(j.PaymentStatus),
                JobStatus = EnumHelper.ToTurkish(j.JobStatus)
            }).ToList();

            return new PagedResultDto<JobListItemDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<JobDetailDto> GetByIdAsync(int id)
        {
            var job = await _context.Jobs
                .AsNoTracking()
                .Include(j => j.Customer)
                .Include(j => j.Vehicle)
                .Include(j => j.TowTruck)
                .Include(j => j.Driver)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                throw new NotFoundException($"{id} numaralı iş bulunamadı.");

            return MapToDetailDto(job);
        }

        public async Task<JobDetailDto> CreateAsync(CreateJobDto dto)
        {
            var customer = await _context.Customers.FindAsync(dto.CustomerId)
                ?? throw new BadRequestException("Seçilen müşteri bulunamadı.");

            var vehicle = await _context.Vehicles.FindAsync(dto.VehicleId)
                ?? throw new BadRequestException("Seçilen araç bulunamadı.");

            if (vehicle.CustomerId != dto.CustomerId)
                throw new BadRequestException("Seçilen araç bu müşteriye ait değil.");

            TowTruck? towTruck = null;
            if (dto.TowTruckId.HasValue)
            {
                towTruck = await _context.TowTrucks.FindAsync(dto.TowTruckId.Value)
                    ?? throw new BadRequestException("Seçilen çekici bulunamadı.");
            }

            Driver? driver = null;
            if (dto.DriverId.HasValue)
            {
                driver = await _context.Drivers.FindAsync(dto.DriverId.Value)
                    ?? throw new BadRequestException("Seçilen sürücü bulunamadı.");
            }

            var job = new Job
            {
                JobNumber = await GenerateJobNumberAsync(),
                CustomerId = dto.CustomerId,
                VehicleId = dto.VehicleId,
                TowTruckId = dto.TowTruckId,
                DriverId = dto.DriverId,
                RequestDate = DateTime.UtcNow,
                PickupAddress = dto.PickupAddress.Trim(),
                DestinationAddress = dto.DestinationAddress.Trim(),
                JobType = EnumHelper.ParseJobType(dto.JobType),
                Description = dto.Description?.Trim(),
                DistanceKm = dto.DistanceKm,
                Price = dto.Price,
                PaymentStatus = EnumHelper.ParsePaymentStatus(dto.PaymentStatus),
                JobStatus = JobStatus.Bekliyor,
                CreatedAt = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            job.Customer = customer;
            job.Vehicle = vehicle;
            job.TowTruck = towTruck;
            job.Driver = driver;

            return MapToDetailDto(job);
        }

        public async Task<JobDetailDto> UpdateAsync(int id, UpdateJobDto dto)
        {
            var job = await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.Vehicle)
                .Include(j => j.TowTruck)
                .Include(j => j.Driver)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                throw new NotFoundException($"{id} numaralı iş bulunamadı.");

            var customer = await _context.Customers.FindAsync(dto.CustomerId)
                ?? throw new BadRequestException("Seçilen müşteri bulunamadı.");

            var vehicle = await _context.Vehicles.FindAsync(dto.VehicleId)
                ?? throw new BadRequestException("Seçilen araç bulunamadı.");

            TowTruck? towTruck = null;
            if (dto.TowTruckId.HasValue)
                towTruck = await _context.TowTrucks.FindAsync(dto.TowTruckId.Value)
                    ?? throw new BadRequestException("Seçilen çekici bulunamadı.");

            Driver? driver = null;
            if (dto.DriverId.HasValue)
                driver = await _context.Drivers.FindAsync(dto.DriverId.Value)
                    ?? throw new BadRequestException("Seçilen sürücü bulunamadı.");

            var newStatus = EnumHelper.ParseJobStatus(dto.JobStatus);

            job.CustomerId = dto.CustomerId;
            job.VehicleId = dto.VehicleId;
            job.TowTruckId = dto.TowTruckId;
            job.DriverId = dto.DriverId;
            job.PickupAddress = dto.PickupAddress.Trim();
            job.DestinationAddress = dto.DestinationAddress.Trim();
            job.JobType = EnumHelper.ParseJobType(dto.JobType);
            job.Description = dto.Description?.Trim();
            job.DistanceKm = dto.DistanceKm;
            job.Price = dto.Price;
            job.PaymentStatus = EnumHelper.ParsePaymentStatus(dto.PaymentStatus);

            ApplyStatusTransition(job, newStatus);

            await _context.SaveChangesAsync();

            job.Customer = customer;
            job.Vehicle = vehicle;
            job.TowTruck = towTruck;
            job.Driver = driver;

            return MapToDetailDto(job);
        }

        public async Task<JobDetailDto> UpdateStatusAsync(int id, UpdateJobStatusDto dto)
        {
            var job = await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.Vehicle)
                .Include(j => j.TowTruck)
                .Include(j => j.Driver)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                throw new NotFoundException($"{id} numaralı iş bulunamadı.");

            var newStatus = EnumHelper.ParseJobStatus(dto.JobStatus);
            ApplyStatusTransition(job, newStatus);

            await _context.SaveChangesAsync();
            return MapToDetailDto(job);
        }

        public async Task DeleteAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                throw new NotFoundException($"{id} numaralı iş bulunamadı.");

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
        }

        private static void ApplyStatusTransition(Job job, JobStatus newStatus)
        {
            if (job.JobStatus == newStatus)
                return;

            if (newStatus == JobStatus.Islemde && job.StartDate == null)
                job.StartDate = DateTime.UtcNow;

            if (newStatus == JobStatus.Tamamlandi && job.CompletedDate == null)
            {
                job.CompletedDate = DateTime.UtcNow;
                job.StartDate ??= DateTime.UtcNow;
            }

            job.JobStatus = newStatus;
        }

        private async Task<string> GenerateJobNumberAsync()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"TT-{year}-";

            var lastNumber = await _context.Jobs
                .Where(j => j.JobNumber.StartsWith(prefix))
                .OrderByDescending(j => j.JobNumber)
                .Select(j => j.JobNumber)
                .FirstOrDefaultAsync();

            var nextSequence = 1;
            if (lastNumber != null)
            {
                var sequencePart = lastNumber.Substring(prefix.Length);
                if (int.TryParse(sequencePart, out var parsed))
                    nextSequence = parsed + 1;
            }

            return $"{prefix}{nextSequence:D5}";
        }

        private static JobDetailDto MapToDetailDto(Job j) => new()
        {
            Id = j.Id,
            JobNumber = j.JobNumber,
            CustomerId = j.CustomerId,
            CustomerName = j.Customer?.FullName ?? string.Empty,
            CustomerPhone = j.Customer?.Phone ?? string.Empty,
            VehicleId = j.VehicleId,
            VehiclePlate = j.Vehicle?.Plate ?? string.Empty,
            VehicleBrandModel = j.Vehicle != null ? $"{j.Vehicle.Brand} {j.Vehicle.Model}" : string.Empty,
            TowTruckId = j.TowTruckId,
            TowTruckPlate = j.TowTruck?.Plate,
            DriverId = j.DriverId,
            DriverName = j.Driver?.FullName,
            RequestDate = j.RequestDate,
            StartDate = j.StartDate,
            CompletedDate = j.CompletedDate,
            PickupAddress = j.PickupAddress,
            DestinationAddress = j.DestinationAddress,
            JobType = EnumHelper.ToTurkish(j.JobType),
            Description = j.Description,
            DistanceKm = j.DistanceKm,
            Price = j.Price,
            PaymentStatus = EnumHelper.ToTurkish(j.PaymentStatus),
            JobStatus = EnumHelper.ToTurkish(j.JobStatus),
            CreatedAt = j.CreatedAt
        };
    }
}
