import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EnvironmentEventService } from '../services/environment-event.service';
import { CreateEnvironmentEventDto } from '../dto/create-environment-event.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EnvironmentEventSanitizerService } from '../services/environment-event-sanitizer.service';
import { FindEnvironmentEventDto } from '../dto/find-environment-event.dto';
import { environmentEventPermissions } from '../environment-event.permissions';
import { Roles } from 'src/decorators/role';
import { appendRolesToText, formatRolesForSwagger } from 'src/utils/utility';
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { environmentEventPaginateConfig } from '../environment-event.paginate.config';

@Controller('environment-events')
@ApiTags('Environment Event')
export class EnvironmentEventController {
  constructor(
    private readonly environmentEventService: EnvironmentEventService,
    private readonly envionmentEventSanitizer: EnvironmentEventSanitizerService
  ) {}

  @Post()
  @ApiBody({ type: CreateEnvironmentEventDto })
  @ApiOperation({ summary: 'Create an Environment event' })
  @ApiCreatedResponse({ description: 'Environment event created successfully', type: String })
  async create(@Body() createEnvironmentEventDto: CreateEnvironmentEventDto): Promise<string> {
    return await this.environmentEventService.create(createEnvironmentEventDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(environmentEventPermissions.findPaginated)
  @PaginatedSwaggerDocs(FindEnvironmentEventDto, environmentEventPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get multiple Environment events', environmentEventPermissions.findPaginated), description: formatRolesForSwagger(environmentEventPermissions.findPaginated) })
  async findPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindEnvironmentEventDto>> {
    return this.envionmentEventSanitizer.sanitizePaginatedEnvironmentEvents(await this.environmentEventService.findPaginated(query));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(environmentEventPermissions.findOne)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get Environment event by ID', environmentEventPermissions.findOne), description: formatRolesForSwagger(environmentEventPermissions.findOne) })
  @ApiOkResponse({ description: 'Environment event retrieved successfully', type: FindEnvironmentEventDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindEnvironmentEventDto>{
    return this.envionmentEventSanitizer.sanitizeEnvironmentEvent(await this.environmentEventService.findOne(id));
  }
}
