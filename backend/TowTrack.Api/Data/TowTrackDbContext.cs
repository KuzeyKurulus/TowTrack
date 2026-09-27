using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Entities;

namespace TowTrack.Api.Data
{
    public class TowTrackDbContext : DbContext
    {
        public TowTrackDbContext(DbContextOptions<TowTrackDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<TowTruck> TowTrucks => Set<TowTruck>();
        public DbSet<Driver> Drivers => Set<Driver>();
        public DbSet<Job> Jobs => Set<Job>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Vehicle>()
                .HasIndex(v => v.Plate)
                .IsUnique();

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.JobNumber)
                .IsUnique();

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Customer)
                .WithMany(c => c.Vehicles)
                .HasForeignKey(v => v.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Job>()
                .HasOne(j => j.Customer)
                .WithMany(c => c.Jobs)
                .HasForeignKey(j => j.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Job>()
                .HasOne(j => j.Vehicle)
                .WithMany(v => v.Jobs)
                .HasForeignKey(j => j.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Job>()
                .HasOne(j => j.TowTruck)
                .WithMany(t => t.Jobs)
                .HasForeignKey(j => j.TowTruckId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Job>()
                .HasOne(j => j.Driver)
                .WithMany(d => d.Jobs)
                .HasForeignKey(j => j.DriverId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Job>()
                .Property(j => j.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}
