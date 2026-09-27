using Microsoft.AspNetCore.Mvc;
using TowTrack.Api.DTOs;
using TowTrack.Api.Services;

namespace TowTrack.Api.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardSummaryDto>> Get()
        {
            return Ok(await _service.GetSummaryAsync());
        }
    }

    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportsService _service;

        public ReportsController(IReportsService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ReportsDto>> Get([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            return Ok(await _service.GetReportsAsync(startDate, endDate));
        }
    }
}
