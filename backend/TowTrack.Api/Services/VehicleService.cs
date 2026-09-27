using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly TowTrackDbContext _context;

        public VehicleService(TowTrackDbContext context)
        {
            _context = context;
        }

        public async Task<List<VehicleDto>> GetAllAsync(string? search, int? customerId)
        {
            var query = _context.Vehicles.AsNoTracking().Include(v => v.Customer).AsQueryable();

            if (customerId.HasValue)
                query = query.Where(v => v.CustomerId == customerId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(v =>
                    v.Plate.ToLower().Contains(search) ||
                    v.Brand.ToLower().Contains(search) ||
                    v.Model.ToLower().Contains(search));
            }

            return await query
                .OrderBy(v => v.Plate)
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    CustomerId = v.CustomerId,
                    CustomerName = v.Customer!.FullName,
                    Plate = v.Plate,
                    Brand = v.Brand,
                    Model = v.Model,
                    ModelYear = v.ModelYear,
                    Color = v.Color,
                    ChassisNumber = v.ChassisNumber,
                    Mileage = v.Mileage,
                    Note = v.Note
                })
                .ToListAsync();
        }

        public async Task<VehicleDto> GetByIdAsync(int id)
        {
            var vehicle = await _context.Vehicles.AsNoTracking().Include(v => v.Customer)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                throw new NotFoundException($"{id} numaralı araç bulunamadı.");

            return MapToDto(vehicle);
        }

        public async Task<VehicleDto> CreateAsync(CreateVehicleDto dto)
        {
            var customer = await _context.Customers.FindAsync(dto.CustomerId);
            if (customer == null)
                throw new BadRequestException("Seçilen müşteri bulunamadı.");

            await EnsurePlateIsUniqueAsync(dto.Plate, null);

            var vehicle = new Vehicle
            {
                CustomerId = dto.CustomerId,
                Plate = dto.Plate.Trim().ToUpper(),
                Brand = dto.Brand.Trim(),
                Model = dto.Model.Trim(),
                ModelYear = dto.ModelYear,
                Color = dto.Color?.Trim(),
                ChassisNumber = dto.ChassisNumber?.Trim(),
                Mileage = dto.Mileage,
                Note = dto.Note?.Trim()
            };

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            vehicle.Customer = customer;
            return MapToDto(vehicle);
        }

        public async Task<VehicleDto> UpdateAsync(int id, UpdateVehicleDto dto)
        {
            var vehicle = await _context.Vehicles.Include(v => v.Customer).FirstOrDefaultAsync(v => v.Id == id);
            if (vehicle == null)
                throw new NotFoundException($"{id} numaralı araç bulunamadı.");

            var customer = await _context.Customers.FindAsync(dto.CustomerId);
            if (customer == null)
                throw new BadRequestException("Seçilen müşteri bulunamadı.");

            await EnsurePlateIsUniqueAsync(dto.Plate, id);

            vehicle.CustomerId = dto.CustomerId;
            vehicle.Plate = dto.Plate.Trim().ToUpper();
            vehicle.Brand = dto.Brand.Trim();
            vehicle.Model = dto.Model.Trim();
            vehicle.ModelYear = dto.ModelYear;
            vehicle.Color = dto.Color?.Trim();
            vehicle.ChassisNumber = dto.ChassisNumber?.Trim();
            vehicle.Mileage = dto.Mileage;
            vehicle.Note = dto.Note?.Trim();

            await _context.SaveChangesAsync();

            vehicle.Customer = customer;
            return MapToDto(vehicle);
        }

        public async Task DeleteAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                throw new NotFoundException($"{id} numaralı araç bulunamadı.");

            var hasJobs = await _context.Jobs.AnyAsync(j => j.VehicleId == id);
            if (hasJobs)
                throw new ConflictException("Bu araca ait iş kayıtları olduğu için silinemez.");

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
        }

        private async Task EnsurePlateIsUniqueAsync(string plate, int? excludeId)
        {
            var normalized = plate.Trim().ToUpper();
            var exists = await _context.Vehicles
                .AnyAsync(v => v.Plate.ToUpper() == normalized && v.Id != (excludeId ?? 0));

            if (exists)
                throw new ConflictException($"'{normalized}' plakalı araç zaten kayıtlı.");
        }

        private static VehicleDto MapToDto(Vehicle v) => new()
        {
            Id = v.Id,
            CustomerId = v.CustomerId,
            CustomerName = v.Customer?.FullName ?? string.Empty,
            Plate = v.Plate,
            Brand = v.Brand,
            Model = v.Model,
            ModelYear = v.ModelYear,
            Color = v.Color,
            ChassisNumber = v.ChassisNumber,
            Mileage = v.Mileage,
            Note = v.Note
        };
    }
}
