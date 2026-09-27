using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TowTrack.Api.DTOs;
using TowTrack.Api.Services;

namespace TowTrack.Api.Controllers
{
    [ApiController]
    [Route("api/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _service;
        private readonly IValidator<CreateVehicleDto> _createValidator;
        private readonly IValidator<UpdateVehicleDto> _updateValidator;

        public VehiclesController(
            IVehicleService service,
            IValidator<CreateVehicleDto> createValidator,
            IValidator<UpdateVehicleDto> updateValidator)
        {
            _service = service;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpGet]
        public async Task<ActionResult<List<VehicleDto>>> GetAll([FromQuery] string? search, [FromQuery] int? customerId)
        {
            return Ok(await _service.GetAllAsync(search, customerId));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<VehicleDto>> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult<VehicleDto>> Create([FromBody] CreateVehicleDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<VehicleDto>> Update(int id, [FromBody] UpdateVehicleDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);
            return Ok(await _service.UpdateAsync(id, dto));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
