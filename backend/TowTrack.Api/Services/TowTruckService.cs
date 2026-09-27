using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Services
{
    public class TowTruckService : ITowTruckService
    {
        private readonly TowTrackDbContext _context;

        public TowTruckService(TowTrackDbContext context)
        {
            _context = context;
        }

        public async Task<List<TowTruckDto>> GetAllAsync(string? status)
        {
            var query = _context.TowTrucks.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                var parsed = EnumHelper.ParseTowTruckStatus(status);
                query = query.Where(t => t.Status == parsed);
            }

            var trucks = await query.OrderBy(t => t.Plate).ToListAsync();
            return trucks.Select(MapToDto).ToList();
        }

        public async Task<TowTruckDto> GetByIdAsync(int id)
        {
            var truck = await _context.TowTrucks.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
            if (truck == null)
                throw new NotFoundException($"{id} numaralı çekici bulunamadı.");

            return MapToDto(truck);
        }

        public async Task<TowTruckDto> CreateAsync(CreateTowTruckDto dto)
        {
            await EnsurePlateIsUniqueAsync(dto.Plate, null);

            var truck = new TowTruck
            {
                Plate = dto.Plate.Trim().ToUpper(),
                Brand = dto.Brand.Trim(),
                Model = dto.Model.Trim(),
                ModelYear = dto.ModelYear,
                VehicleType = dto.VehicleType.Trim(),
                Capacity = dto.Capacity,
                Status = EnumHelper.ParseTowTruckStatus(dto.Status),
                LastMaintenanceDate = dto.LastMaintenanceDate,
                Note = dto.Note?.Trim()
            };

            _context.TowTrucks.Add(truck);
            await _context.SaveChangesAsync();

            return MapToDto(truck);
        }

        public async Task<TowTruckDto> UpdateAsync(int id, UpdateTowTruckDto dto)
        {
            var truck = await _context.TowTrucks.FindAsync(id);
            if (truck == null)
                throw new NotFoundException($"{id} numaralı çekici bulunamadı.");

            await EnsurePlateIsUniqueAsync(dto.Plate, id);

            truck.Plate = dto.Plate.Trim().ToUpper();
            truck.Brand = dto.Brand.Trim();
            truck.Model = dto.Model.Trim();
            truck.ModelYear = dto.ModelYear;
            truck.VehicleType = dto.VehicleType.Trim();
            truck.Capacity = dto.Capacity;
            truck.Status = EnumHelper.ParseTowTruckStatus(dto.Status);
            truck.LastMaintenanceDate = dto.LastMaintenanceDate;
            truck.Note = dto.Note?.Trim();

            await _context.SaveChangesAsync();
            return MapToDto(truck);
        }

        public async Task<TowTruckDto> UpdateStatusAsync(int id, UpdateTowTruckStatusDto dto)
        {
            var truck = await _context.TowTrucks.FindAsync(id);
            if (truck == null)
                throw new NotFoundException($"{id} numaralı çekici bulunamadı.");

            truck.Status = EnumHelper.ParseTowTruckStatus(dto.Status);
            await _context.SaveChangesAsync();
            return MapToDto(truck);
        }

        public async Task DeleteAsync(int id)
        {
            var truck = await _context.TowTrucks.FindAsync(id);
            if (truck == null)
                throw new NotFoundException($"{id} numaralı çekici bulunamadı.");

            var hasJobs = await _context.Jobs.AnyAsync(j => j.TowTruckId == id);
            if (hasJobs)
                throw new ConflictException("Bu çekiciye ait iş kayıtları olduğu için silinemez.");

            _context.TowTrucks.Remove(truck);
            await _context.SaveChangesAsync();
        }

        private async Task EnsurePlateIsUniqueAsync(string plate, int? excludeId)
        {
            var normalized = plate.Trim().ToUpper();
            var exists = await _context.TowTrucks
                .AnyAsync(t => t.Plate.ToUpper() == normalized && t.Id != (excludeId ?? 0));

            if (exists)
                throw new ConflictException($"'{normalized}' plakalı çekici zaten kayıtlı.");
        }

        private static TowTruckDto MapToDto(TowTruck t) => new()
        {
            Id = t.Id,
            Plate = t.Plate,
            Brand = t.Brand,
            Model = t.Model,
            ModelYear = t.ModelYear,
            VehicleType = t.VehicleType,
            Capacity = t.Capacity,
            Status = EnumHelper.ToTurkish(t.Status),
            LastMaintenanceDate = t.LastMaintenanceDate,
            Note = t.Note
        };
    }
}
