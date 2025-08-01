import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req } from '@nestjs/common';
import { JobService } from '../services/job.service';
import { ConfirmJobDto, CreateJobDto } from '../dto/create-job.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role';
import { jobPermissions } from '../job.permissions';
import { appendRolesToText, formatRolesForSwagger, IRequestWithUser } from 'src/utils/utility';
import { FindJobDto } from '../dto/find-job.dto';
import { JobSanitizerService } from '../services/job-sanitizer.service';
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { jobPaginateConfig } from '../job.paginate.config';

@Controller('jobs')
@ApiTags('Job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly jobSanitizer: JobSanitizerService
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(jobPermissions.create)
  @ApiBody({ type: CreateJobDto })
  @ApiOperation({ summary: appendRolesToText('Create a new Job', jobPermissions.create), description: formatRolesForSwagger(jobPermissions.create) })
  @ApiCreatedResponse({ description: 'Job event created successfully', type: FindJobDto })
  async create(@Body() createJobDto: CreateJobDto, @Req() req: IRequestWithUser): Promise<FindJobDto> {
    return this.jobSanitizer.sanitizeJob(await this.jobService.create(createJobDto, req.user.id));
  }

  @Patch(':id/end')
  @ApiBearerAuth()
  @Roles(jobPermissions.endJob)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('End a Job', jobPermissions.endJob), description: formatRolesForSwagger(jobPermissions.endJob) })
  @ApiOkResponse({ description: 'Job event ended successfully', type: FindJobDto })
  async endJob(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: IRequestWithUser): Promise<FindJobDto> {
    return this.jobSanitizer.sanitizeJob(await this.jobService.endJob(id, req.user.email));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(jobPermissions.remove)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Delete an open Job', jobPermissions.remove), description: formatRolesForSwagger(jobPermissions.remove) })
  @ApiOkResponse({ description: 'Job deleted succesfully', type: FindJobDto })
  async remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: IRequestWithUser) {
    return this.jobSanitizer.sanitizeJob(await this.jobService.remove(id, req.user.email));
  }

  @Get('me')
  @ApiBearerAuth()
  @Roles(jobPermissions.getMyPaginated)
  @PaginatedSwaggerDocs(FindJobDto, jobPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get  all Jobs created by the user', jobPermissions.getMyPaginated), description: formatRolesForSwagger(jobPermissions.getMyPaginated) })
  async getMyPaginated(@Paginate() query: PaginateQuery, @Req() req: IRequestWithUser): Promise<Paginated<FindJobDto>> {
    return this.jobSanitizer.sanitizePaginatedJobs(await this.jobService.getMyPaginated(query, req.user.id));
  }

  @Get()
  @ApiBearerAuth()
  @Roles(jobPermissions.getPaginated)
  @PaginatedSwaggerDocs(FindJobDto, jobPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get paginated Jobs', jobPermissions.getPaginated), description: formatRolesForSwagger(jobPermissions.getPaginated) })
  async getPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindJobDto>> {
    return this.jobSanitizer.sanitizePaginatedJobs(await this.jobService.getPaginated(query));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(jobPermissions.getJobById)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get single Job by ID', jobPermissions.getJobById), description: formatRolesForSwagger(jobPermissions.getJobById) })
  @ApiOkResponse({ description: 'Job found succesfully', type: FindJobDto })
  async getJobById(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindJobDto> {
    return this.jobSanitizer.sanitizeJob(await this.jobService.getJobById(id));
  }

  @Get('me/assigned')
  @ApiBearerAuth()
  @Roles(jobPermissions.getMyAssignedJob)
  @ApiOperation({ summary: appendRolesToText('Get the open Job assigned to the user', jobPermissions.getMyAssignedJob), description: formatRolesForSwagger(jobPermissions.getMyAssignedJob) })
  @ApiOkResponse({ description: 'Job to confirm found', type: FindJobDto })
  async getMyAssignedJob(@Req() req: IRequestWithUser): Promise<FindJobDto> {
    return this.jobSanitizer.sanitizeJob(await this.jobService.getMyAssignedJob(req.user.id));
  }

  @Patch('me/assigned')
  @ApiBearerAuth()
  @Roles(jobPermissions.confirmDenyJob)
  @ApiOperation({ summary: appendRolesToText('Confirm or deny the current Job assigned to the user', jobPermissions.confirmDenyJob), description: formatRolesForSwagger(jobPermissions.confirmDenyJob) })
  @ApiOkResponse({ description: 'Job confirmed/denied', type: FindJobDto })
  async confirmDenyJob(@Body() body: ConfirmJobDto, @Req() req: IRequestWithUser): Promise<FindJobDto> {
    return this.jobSanitizer.sanitizeJob(await this.jobService.confirmDenyJob(req.user.id, body.confirm));
  }

}
