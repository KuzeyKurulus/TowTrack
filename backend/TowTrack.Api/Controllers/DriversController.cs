using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TowTrack.Api.DTOs;
using TowTrack.Api.Services;

namespace TowTrack.Api.Controllers
{
    [ApiController]
    [Route("api/drivers")]
    public class DriversController : ControllerBase
    {
        private readonly IDriverService _service;
        private readonly IValidator<CreateDriverDto> _createValidator;
        private readonly IValidator<UpdateDriverDto> _updateValidator;

        public DriversController(
            IDriverService service,
            IValidator<CreateDriverDto> createValidator,
            IValidator<UpdateDriverDto> updateValidator)
        {
            _service = service;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpGet]
        public async Task<ActionResult<List<DriverDto>>> GetAll([FromQuery] string? status)
        {
            return Ok(await _service.GetAllAsync(status));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<DriverDto>> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult<DriverDto>> Create([FromBody] CreateDriverDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<DriverDto>> Update(int id, [FromBody] UpdateDriverDto dto)
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
