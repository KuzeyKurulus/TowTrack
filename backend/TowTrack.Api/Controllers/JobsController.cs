using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TowTrack.Api.DTOs;
using TowTrack.Api.Services;

namespace TowTrack.Api.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _service;
        private readonly IValidator<CreateJobDto> _createValidator;
        private readonly IValidator<UpdateJobDto> _updateValidator;
        private readonly IValidator<UpdateJobStatusDto> _statusValidator;

        public JobsController(
            IJobService service,
            IValidator<CreateJobDto> createValidator,
            IValidator<UpdateJobDto> updateValidator,
            IValidator<UpdateJobStatusDto> statusValidator)
        {
            _service = service;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
            _statusValidator = statusValidator;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDto<JobListItemDto>>> GetAll([FromQuery] JobFilterDto filter)
        {
            return Ok(await _service.GetAllAsync(filter));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<JobDetailDto>> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult<JobDetailDto>> Create([FromBody] CreateJobDto dto)
        {
            await _createValidator.ValidateAndThrowAsync(dto);
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<JobDetailDto>> Update(int id, [FromBody] UpdateJobDto dto)
        {
            await _updateValidator.ValidateAndThrowAsync(dto);
            return Ok(await _service.UpdateAsync(id, dto));
        }

        [HttpPatch("{id:int}/status")]
        public async Task<ActionResult<JobDetailDto>> UpdateStatus(int id, [FromBody] UpdateJobStatusDto dto)
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
