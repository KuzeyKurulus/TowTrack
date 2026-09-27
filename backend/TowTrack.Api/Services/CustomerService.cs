using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.DTOs;
using TowTrack.Api.Entities;
using TowTrack.Api.Helpers;

namespace TowTrack.Api.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly TowTrackDbContext _context;

        public CustomerService(TowTrackDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerDto>> GetAllAsync(string? search)
        {
            var query = _context.Customers.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(c =>
                    c.FullName.ToLower().Contains(search) ||
                    c.Phone.Contains(search) ||
                    (c.Email != null && c.Email.ToLower().Contains(search)));
            }

            return await query
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CustomerDto
                {
                    Id = c.Id,
                    FullName = c.FullName,
                    Phone = c.Phone,
                    Email = c.Email,
                    Address = c.Address,
                    Note = c.Note,
                    CreatedAt = c.CreatedAt,
                    VehicleCount = c.Vehicles.Count,
                    JobCount = c.Jobs.Count
                })
                .ToListAsync();
        }

        public async Task<CustomerDetailDto> GetByIdAsync(int id)
        {
            var customer = await _context.Customers
                .AsNoTracking()
                .Include(c => c.Vehicles)
                .Include(c => c.Jobs)
                    .ThenInclude(j => j.Vehicle)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
                throw new NotFoundException($"{id} numaralı müşteri bulunamadı.");

            return new CustomerDetailDto
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Email = customer.Email,
                Address = customer.Address,
                Note = customer.Note,
                CreatedAt = customer.CreatedAt,
                VehicleCount = customer.Vehicles.Count,
                JobCount = customer.Jobs.Count,
                Vehicles = customer.Vehicles.Select(v => new VehicleDto
                {
                    Id = v.Id,
                    CustomerId = v.CustomerId,
                    CustomerName = customer.FullName,
                    Plate = v.Plate,
                    Brand = v.Brand,
                    Model = v.Model,
                    ModelYear = v.ModelYear,
                    Color = v.Color,
                    ChassisNumber = v.ChassisNumber,
                    Mileage = v.Mileage,
                    Note = v.Note
                }).ToList(),
                Jobs = customer.Jobs
                    .OrderByDescending(j => j.RequestDate)
                    .Select(j => new JobListItemDto
                    {
                        Id = j.Id,
                        JobNumber = j.JobNumber,
                        RequestDate = j.RequestDate,
                        CustomerName = customer.FullName,
                        Plate = j.Vehicle != null ? j.Vehicle.Plate : string.Empty,
                        JobType = EnumHelper.ToTurkish(j.JobType),
                        Price = j.Price,
                        PaymentStatus = EnumHelper.ToTurkish(j.PaymentStatus),
                        JobStatus = EnumHelper.ToTurkish(j.JobStatus)
                    }).ToList()
            };
        }

        public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto)
        {
            var customer = new Customer
            {
                FullName = dto.FullName.Trim(),
                Phone = dto.Phone.Trim(),
                Email = dto.Email?.Trim(),
                Address = dto.Address?.Trim(),
                Note = dto.Note?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return new CustomerDto
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Email = customer.Email,
                Address = customer.Address,
                Note = customer.Note,
                CreatedAt = customer.CreatedAt,
                VehicleCount = 0,
                JobCount = 0
            };
        }

        public async Task<CustomerDto> UpdateAsync(int id, UpdateCustomerDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                throw new NotFoundException($"{id} numaralı müşteri bulunamadı.");

            customer.FullName = dto.FullName.Trim();
            customer.Phone = dto.Phone.Trim();
            customer.Email = dto.Email?.Trim();
            customer.Address = dto.Address?.Trim();
            customer.Note = dto.Note?.Trim();

            await _context.SaveChangesAsync();

            var vehicleCount = await _context.Vehicles.CountAsync(v => v.CustomerId == id);
            var jobCount = await _context.Jobs.CountAsync(j => j.CustomerId == id);

            return new CustomerDto
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Phone = customer.Phone,
                Email = customer.Email,
                Address = customer.Address,
                Note = customer.Note,
                CreatedAt = customer.CreatedAt,
                VehicleCount = vehicleCount,
                JobCount = jobCount
            };
        }

        public async Task DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                throw new NotFoundException($"{id} numaralı müşteri bulunamadı.");

            var hasJobs = await _context.Jobs.AnyAsync(j => j.CustomerId == id);
            if (hasJobs)
                throw new ConflictException("Bu müşteriye ait iş kayıtları olduğu için silinemez.");

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
        }
    }
}
