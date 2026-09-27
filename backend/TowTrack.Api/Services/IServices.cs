using TowTrack.Api.DTOs;

namespace TowTrack.Api.Services
{
    public interface ICustomerService
    {
        Task<List<CustomerDto>> GetAllAsync(string? search);
        Task<CustomerDetailDto> GetByIdAsync(int id);
        Task<CustomerDto> CreateAsync(CreateCustomerDto dto);
        Task<CustomerDto> UpdateAsync(int id, UpdateCustomerDto dto);
        Task DeleteAsync(int id);
    }

    public interface IVehicleService
    {
        Task<List<VehicleDto>> GetAllAsync(string? search, int? customerId);
        Task<VehicleDto> GetByIdAsync(int id);
        Task<VehicleDto> CreateAsync(CreateVehicleDto dto);
        Task<VehicleDto> UpdateAsync(int id, UpdateVehicleDto dto);
        Task DeleteAsync(int id);
    }

    public interface ITowTruckService
    {
        Task<List<TowTruckDto>> GetAllAsync(string? status);
        Task<TowTruckDto> GetByIdAsync(int id);
        Task<TowTruckDto> CreateAsync(CreateTowTruckDto dto);
        Task<TowTruckDto> UpdateAsync(int id, UpdateTowTruckDto dto);
        Task<TowTruckDto> UpdateStatusAsync(int id, UpdateTowTruckStatusDto dto);
        Task DeleteAsync(int id);
    }

    public interface IDriverService
    {
        Task<List<DriverDto>> GetAllAsync(string? status);
        Task<DriverDto> GetByIdAsync(int id);
        Task<DriverDto> CreateAsync(CreateDriverDto dto);
        Task<DriverDto> UpdateAsync(int id, UpdateDriverDto dto);
        Task DeleteAsync(int id);
    }

    public interface IJobService
    {
        Task<PagedResultDto<JobListItemDto>> GetAllAsync(JobFilterDto filter);
        Task<JobDetailDto> GetByIdAsync(int id);
        Task<JobDetailDto> CreateAsync(CreateJobDto dto);
        Task<JobDetailDto> UpdateAsync(int id, UpdateJobDto dto);
        Task<JobDetailDto> UpdateStatusAsync(int id, UpdateJobStatusDto dto);
        Task DeleteAsync(int id);
    }

    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
    }

    public interface IReportsService
    {
        Task<ReportsDto> GetReportsAsync(DateTime? startDate, DateTime? endDate);
    }
}
