import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EnvironmentService } from '../services/environment.service';
import { CreateEnvironmentDto } from '../dto/create-environment.dto';
import { UpdateEnvironmentDto } from '../dto/update-environment.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role';
import { environmentPermissions } from '../environment.permissions';
import { appendRolesToText, formatRolesForSwagger } from 'src/utils/utility';
import { FindEnvironmentDto } from '../dto/find-environment.dto';
import { EnvironmentSanitizerService } from '../services/environment-sanitizer.service';
import { Paginate, Paginated, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { environmentPaginateConfig } from '../environment.paginate.config';

@Controller('environments')
@ApiTags('Environment')
export class EnvironmentController {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly environmentSanitizer: EnvironmentSanitizerService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(environmentPermissions.create)
  @ApiBody({ type: CreateEnvironmentDto })
  @ApiOperation({ summary: appendRolesToText('Create environment', environmentPermissions.create), description: formatRolesForSwagger(environmentPermissions.create) })
  @ApiCreatedResponse({ description: 'Environment created successfully', type: FindEnvironmentDto })
  async create(@Body() createEnvironmentDto: CreateEnvironmentDto): Promise<FindEnvironmentDto> {
    return this.environmentSanitizer.sanitizeEnvironment(await this.environmentService.create(createEnvironmentDto));
  }

  @Get()
  @ApiBearerAuth()
  @Roles(environmentPermissions.findPaginated)
  @PaginatedSwaggerDocs(FindEnvironmentDto, environmentPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get multiple environments', environmentPermissions.findPaginated), description: formatRolesForSwagger(environmentPermissions.findPaginated) })
  async findPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindEnvironmentDto>> {
    return this.environmentSanitizer.sanitizePaginatedEnvironments(await this.environmentService.findPaginated(query));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(environmentPermissions.findOne)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get environment by ID', environmentPermissions.findOne), description: formatRolesForSwagger(environmentPermissions.findOne) })
  @ApiOkResponse({ description: 'Environment retrieved successfully', type: FindEnvironmentDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindEnvironmentDto> {
    return this.environmentSanitizer.sanitizeEnvironment(await this.environmentService.findOne(id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(environmentPermissions.update)
  @ApiBody({ type: UpdateEnvironmentDto })
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Update environment by ID', environmentPermissions.update), description: formatRolesForSwagger(environmentPermissions.update) })
  @ApiOkResponse({ description: 'Environment updated successfully', type: FindEnvironmentDto })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateEnvironmentDto: UpdateEnvironmentDto): Promise<FindEnvironmentDto> {
    return this.environmentSanitizer.sanitizeEnvironment(await this.environmentService.update(id, updateEnvironmentDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(environmentPermissions.remove)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Remove environment by ID', environmentPermissions.remove), description: formatRolesForSwagger(environmentPermissions.remove) })
  @ApiOkResponse({ description: 'Environment removed successfully', type: FindEnvironmentDto })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindEnvironmentDto> {
    return this.environmentSanitizer.sanitizeEnvironment(await this.environmentService.remove(id));
  }
}
