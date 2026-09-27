using Microsoft.EntityFrameworkCore;
using TowTrack.Api.Data;

namespace TowTrack.Tests
{
    public static class TestDbContextFactory
    {
        public static TowTrackDbContext Create()
        {
            var options = new DbContextOptionsBuilder<TowTrackDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new TowTrackDbContext(options);
        }
    }
}
