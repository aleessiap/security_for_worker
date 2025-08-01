import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req } from '@nestjs/common';
import { PPEService } from '../services/ppe.service';
import { CreatePPEDto } from '../dto/create-ppe.dto';
import { UpdatePPEDto } from '../dto/update-ppe.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ppePermissions } from '../ppe.permissions';
import { Roles } from '../../decorators/role';
import { appendRolesToText, formatRolesForSwagger, IRequestWithUser } from '../../utils/utility';
import { FindPPEDto } from '../dto/find-ppe.dto';
import { PPESanitizerService } from '../services/ppe-sanitizer.service';
import { Paginate, PaginateQuery, Paginated, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { ppePaginateConfig } from '../ppe.paginate.config';

@Controller('ppes')
@ApiTags('Personal Protective Equipment')
export class PPEController {
  constructor(
    private readonly ppeService: PPEService,
    private ppeSanitizer: PPESanitizerService
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(ppePermissions.create)
  @ApiBody({ type: CreatePPEDto })
  @ApiOperation({ summary: appendRolesToText('Create a PPE', ppePermissions.create), description: formatRolesForSwagger(ppePermissions.create) })
  @ApiCreatedResponse({ description: 'PPE created successfully', type: FindPPEDto })
  async create(@Body() createPPEDto: CreatePPEDto): Promise<FindPPEDto> {
    return this.ppeSanitizer.sanitizePPE(await this.ppeService.create(createPPEDto));
  }

  @Get()
  @ApiBearerAuth()
  @Roles(ppePermissions.findPaginated)
  @PaginatedSwaggerDocs(FindPPEDto, ppePaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get multiple PPEs', ppePermissions.findPaginated), description: formatRolesForSwagger(ppePermissions.findPaginated) })
  async findPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindPPEDto>> {
    return this.ppeSanitizer.sanitizePaginatedPPEs(await this.ppeService.findPaginated(query));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(ppePermissions.findOne)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get PPE by ID', ppePermissions.findOne), description: formatRolesForSwagger(ppePermissions.findOne) })
  @ApiOkResponse({ description: 'PPE retrieved successfully', type: FindPPEDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindPPEDto> {
    return this.ppeSanitizer.sanitizePPE(await this.ppeService.findOne(id));
  }

  @Get('/me')
  @ApiBearerAuth()
  @Roles(ppePermissions.findRelatedByMe)
  @ApiOperation({ summary: appendRolesToText('Get all PPEs related to Operator that makes the requests', ppePermissions.findRelatedByMe), description: formatRolesForSwagger(ppePermissions.findRelatedByMe) })
  @PaginatedSwaggerDocs(FindPPEDto, ppePaginateConfig())
  async findRelatedByMe(@Paginate() query: PaginateQuery, @Req() req: IRequestWithUser): Promise<Paginated<FindPPEDto>> {
    return this.ppeSanitizer.sanitizePaginatedPPEs(await this.ppeService.findRelatedByMe(query, req.user.id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(ppePermissions.update)
  @ApiBody({ type: UpdatePPEDto })
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Update PPE by ID', ppePermissions.update), description: formatRolesForSwagger(ppePermissions.update) })
  @ApiOkResponse({ description: 'PPE updated successfully', type: FindPPEDto })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updatePpeDto: UpdatePPEDto): Promise<FindPPEDto> {
    return this.ppeSanitizer.sanitizePPE(await this.ppeService.update(id, updatePpeDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(ppePermissions.remove)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Delete PPE by ID', ppePermissions.remove), description: formatRolesForSwagger(ppePermissions.remove) })
  @ApiOkResponse({ description: 'PPE deleted successfully', type: FindPPEDto })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindPPEDto> {
    return this.ppeSanitizer.sanitizePPE(await this.ppeService.remove(id));
  }
}
