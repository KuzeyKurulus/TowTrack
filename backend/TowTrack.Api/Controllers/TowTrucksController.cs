using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TowTrack.Api.DTOs;
using TowTrack.Api.Services;

namespace TowTrack.Api.Controllers
{
    [ApiController]
    [Route("api/towtrucks")]
    public class TowTrucksController : ControllerBase
    {
        private readonly ITowTruckService _service;
        private readonly IValidator<CreateTowTruckDto> _createValidator;
        private readonly IValidator<UpdateTowTruckDto> _updateValidator;
        private readonly IValidator<UpdateTowTruckStatusDto> _statusValidator;

        public TowTrucksController(
            ITowTruckService service,
            IValidator<CreateTowTruckDto> createValidator,
            IValidator<UpdateTowTruckDto> updateValidator,
            IValidator<UpdateTowTruckStatusDto> statusValidator)
        {
            _service = service;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _statusValidator = statusValidator;
        }

        [HttpGet]
        public async Task<ActionResult<List<TowTruckDto>>> GetAll([FromQuery] string? status)
        {
            return Ok(await _service.GetAllAsync(status));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TowTruckDto>> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult<TowTruckDto>> Create([FromBody] CreateTowTruckDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<TowTruckDto>> Update(int id, [FromBody] UpdateTowTruckDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);
            return Ok(await _service.UpdateAsync(id, dto));
        }

        [HttpPatch("{id:int}/status")]
        public async Task<ActionResult<TowTruckDto>> UpdateStatus(int id, [FromBody] UpdateTowTruckStatusDto dto)
        {
            await _statusValidator.ValidateAndThrowAsync(dto);
            return Ok(await _service.UpdateStatusAsync(id, dto));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
