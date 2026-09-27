using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;
using TowTrack.Api.Middleware;
using TowTrack.Api.Services;
using TowTrack.Api.Validators;

var builder = WebApplication.CreateBuilder(args);

// ---- Servisler ----
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "TowTrack API",
        Version = "v1",
        Description = "Oto Kurtarma ve Çekici Yönetim Sistemi API"
    });
});

builder.Services.AddDbContext<TowTrackDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=towtrack.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Servis katmanı
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<ITowTruckService, TowTruckService>();
builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IReportsService, ReportsService>();

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateCustomerDtoValidator>();

var app = builder.Build();

// ---- Veritabanı migrasyon + seed ----
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TowTrackDbContext>();
    context.Database.EnsureCreated();
    DbSeeder.Seed(context);
}

// ---- Middleware pipeline ----
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "TowTrack API v1");
});

app.UseCors("FrontendPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
