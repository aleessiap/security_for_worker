import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe } from '@nestjs/common';
import { OperatorEventService } from '../services/operator-event.service';
import { CreateOperatorEventDto } from '../dto/create-operator-event.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FindOperatorEventDto } from '../dto/find-operator-event.dto';
import { OperatorEventSanitizerService } from '../services/operator-event-sanitizer.service';
import { operatorEventPermissions } from '../operator-event.permissions';
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { operatorEventPaginateConfig } from '../operator-event.paginate.config';
import { Roles } from 'src/decorators/role';
import { appendRolesToText, formatRolesForSwagger, IRequestWithUser } from 'src/utils/utility';

@Controller('operator-events')
@ApiTags('Operator Event')
export class OperatorEventController {
  constructor(
    private readonly operatorEventService: OperatorEventService,
    private readonly operatorEventSanitizer: OperatorEventSanitizerService
  ) {}

  @Post()
  @ApiBody({ type: CreateOperatorEventDto })
  @ApiOperation({ summary: 'Create a Operator event' })
  @ApiCreatedResponse({ description: 'Operator event created successfully', type: String })
  async create(@Body() createOperatorEventDto: CreateOperatorEventDto): Promise<string> {
    return await this.operatorEventService.create(createOperatorEventDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(operatorEventPermissions.findPaginated)
  @PaginatedSwaggerDocs(FindOperatorEventDto, operatorEventPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get multiple Operator events', operatorEventPermissions.findPaginated), description: formatRolesForSwagger(operatorEventPermissions.findPaginated) })
  async findPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindOperatorEventDto>> {
    return this.operatorEventSanitizer.sanitizePaginatedOperatorEvents(await this.operatorEventService.findPaginated(query));
  }

  @Get('me')
  @ApiBearerAuth()
  @Roles(operatorEventPermissions.findMyPaginated)
  @PaginatedSwaggerDocs(FindOperatorEventDto, operatorEventPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get all Operator events related to Operator that makes the requests', operatorEventPermissions.findMyPaginated), description: formatRolesForSwagger(operatorEventPermissions.findMyPaginated) })
  async findMyPaginated(@Paginate() query: PaginateQuery, @Req() req: IRequestWithUser): Promise<Paginated<FindOperatorEventDto>> {
    return this.operatorEventSanitizer.sanitizePaginatedOperatorEvents(await this.operatorEventService.findMyPaginated(query, req.user.id));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(operatorEventPermissions.findOne)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get Operator event by ID', operatorEventPermissions.findOne), description: formatRolesForSwagger(operatorEventPermissions.findOne) })
  @ApiOkResponse({ description: 'Operator event retrieved successfully', type: FindOperatorEventDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindOperatorEventDto> {
    return this.operatorEventSanitizer.sanitizeOperatorEvent(await this.operatorEventService.findOne(id));
  }

}
