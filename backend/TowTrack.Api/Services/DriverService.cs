using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Services
{
    public class DriverService : IDriverService
    {
        private readonly TowTrackDbContext _context;

        public DriverService(TowTrackDbContext context)
        {
            _context = context;
        }

        public async Task<List<DriverDto>> GetAllAsync(string? status)
        {
            var query = _context.Drivers.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                var parsed = EnumHelper.ParseDriverStatus(status);
                query = query.Where(d => d.Status == parsed);
            }

            return await query
                .OrderBy(d => d.FullName)
                .Select(d => new DriverDto
                {
                    Id = d.Id,
                    FullName = d.FullName,
                    Phone = d.Phone,
                    LicenseClass = d.LicenseClass,
                    HireDate = d.HireDate,
                    Status = EnumHelper.ToTurkish(d.Status),
                    Note = d.Note,
                    JobCount = d.Jobs.Count
                })
                .ToListAsync();
        }

        public async Task<DriverDto> GetByIdAsync(int id)
        {
            var driver = await _context.Drivers.AsNoTracking()
                .Include(d => d.Jobs)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (driver == null)
                throw new NotFoundException($"{id} numaralı sürücü bulunamadı.");

            return MapToDto(driver);
        }

        public async Task<DriverDto> CreateAsync(CreateDriverDto dto)
        {
            var driver = new Driver
            {
                FullName = dto.FullName.Trim(),
                Phone = dto.Phone.Trim(),
                LicenseClass = dto.LicenseClass?.Trim(),
                HireDate = dto.HireDate,
                Status = EnumHelper.ParseDriverStatus(dto.Status),
                Note = dto.Note?.Trim()
            };

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();

            return MapToDto(driver);
        }

        public async Task<DriverDto> UpdateAsync(int id, UpdateDriverDto dto)
        {
            var driver = await _context.Drivers.Include(d => d.Jobs).FirstOrDefaultAsync(d => d.Id == id);
            if (driver == null)
                throw new NotFoundException($"{id} numaralı sürücü bulunamadı.");

            driver.FullName = dto.FullName.Trim();
            driver.Phone = dto.Phone.Trim();
            driver.LicenseClass = dto.LicenseClass?.Trim();
            driver.HireDate = dto.HireDate;
            driver.Status = EnumHelper.ParseDriverStatus(dto.Status);
            driver.Note = dto.Note?.Trim();

            await _context.SaveChangesAsync();
            return MapToDto(driver);
        }

        public async Task DeleteAsync(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
                throw new NotFoundException($"{id} numaralı sürücü bulunamadı.");

            var hasJobs = await _context.Jobs.AnyAsync(j => j.DriverId == id);
            if (hasJobs)
                throw new ConflictException("Bu sürücüye ait iş kayıtları olduğu için silinemez.");

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();
        }

        private static DriverDto MapToDto(Driver d) => new()
        {
            Id = d.Id,
            FullName = d.FullName,
            Phone = d.Phone,
            LicenseClass = d.LicenseClass,
            HireDate = d.HireDate,
            Status = EnumHelper.ToTurkish(d.Status),
            Note = d.Note,
            JobCount = d.Jobs?.Count ?? 0
        };
    }
}
