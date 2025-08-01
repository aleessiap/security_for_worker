import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SensorService } from '../services/sensor.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role';
import { sensorPermissions } from '../sensor.permissions';
import { appendRolesToText, formatRolesForSwagger } from 'src/utils/utility';
import { FindSensorDto } from '../dto/find-sensor.dto';
import { SensorSanitizerService } from '../services/sensor-sanitizer.service';
import { Paginate, PaginateQuery, Paginated, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { sensorPaginateConfig } from '../sensor.paginate.config';

@Controller('sensors')
@ApiTags('Sensor')
export class SensorController {
  constructor(
    private readonly sensorService: SensorService,
    private sensorSanitizer: SensorSanitizerService
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(sensorPermissions.create)
  @ApiBody({ type: CreateSensorDto })
  @ApiOperation({ summary: appendRolesToText('Create a Sensor', sensorPermissions.create), description: formatRolesForSwagger(sensorPermissions.create) })
  @ApiCreatedResponse({ description: 'Sensor created successfully', type: FindSensorDto })
  async create(@Body() createSensorDto: CreateSensorDto): Promise<FindSensorDto> {
    return this.sensorSanitizer.sanitizeSensor(await this.sensorService.create(createSensorDto));
  }

  @Get()
  @ApiBearerAuth()
  @Roles(sensorPermissions.findPaginated)
  @PaginatedSwaggerDocs(FindSensorDto, sensorPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get multiple Sensors', sensorPermissions.findPaginated), description: formatRolesForSwagger(sensorPermissions.findPaginated) })
  async findPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindSensorDto>> {
    return this.sensorSanitizer.sanitizePaginatedSensors(await this.sensorService.findPaginated(query));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(sensorPermissions.findOne)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get Sensor by ID', sensorPermissions.findOne), description: formatRolesForSwagger(sensorPermissions.findOne) })
  @ApiOkResponse({ description: 'Sensor retrieved successfully', type: FindSensorDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindSensorDto> {
    return this.sensorSanitizer.sanitizeSensor(await this.sensorService.findOne(id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(sensorPermissions.update)
  @ApiBody({ type: UpdateSensorDto })
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Update Sensor by ID', sensorPermissions.update), description: formatRolesForSwagger(sensorPermissions.update) })
  @ApiOkResponse({ description: 'Sensor updated successfully', type: FindSensorDto })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateSensorDto: UpdateSensorDto): Promise<FindSensorDto> {
    return this.sensorSanitizer.sanitizeSensor(await this.sensorService.update(id, updateSensorDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(sensorPermissions.remove)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Delete Sensor by ID', sensorPermissions.remove), description: formatRolesForSwagger(sensorPermissions.remove) })
  @ApiOkResponse({ description: 'Sensor deleted successfully', type: FindSensorDto })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindSensorDto> {
    return this.sensorSanitizer.sanitizeSensor(await this.sensorService.remove(id));
  }
}
