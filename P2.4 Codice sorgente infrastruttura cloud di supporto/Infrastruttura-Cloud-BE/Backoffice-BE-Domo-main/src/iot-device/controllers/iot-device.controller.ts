import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { IotDeviceService } from '../services/iot-device.service';
import { CreateIotDeviceDto } from '../dto/create-iot-device.dto';
import { UpdateIotDeviceDto } from '../dto/update-iot-device.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { iotDevicePermissions } from '../iot-device.permissions';
import { Roles } from 'src/decorators/role';
import { appendRolesToText, formatRolesForSwagger } from 'src/utils/utility';
import { FindIotDeviceDto } from '../dto/find-iot-device.dto';
import { IoTDeviceSanitizerService } from '../services/iot-device-sanitizer.service';
import { Paginate, PaginateQuery, Paginated, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { iotDevicePaginateConfig } from '../iot-device.paginate.config';

@Controller('iot-devices')
@ApiTags('IoT Device')
export class IotDeviceController {
  constructor(
    private readonly iotDeviceService: IotDeviceService,
    private iotDeviceSanitizer: IoTDeviceSanitizerService
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(iotDevicePermissions.create)
  @ApiBody({ type: CreateIotDeviceDto })
  @ApiOperation({ summary: appendRolesToText('Create an IoT Device', iotDevicePermissions.create), description: formatRolesForSwagger(iotDevicePermissions.create) })
  @ApiCreatedResponse({ description: 'IoT Device created successfully', type: FindIotDeviceDto })
  async create(@Body() createIotDeviceDto: CreateIotDeviceDto): Promise<FindIotDeviceDto> {
    return this.iotDeviceSanitizer.sanitizeIotDevice(await this.iotDeviceService.create(createIotDeviceDto));
  }

  @Get()
  @ApiBearerAuth()
  @Roles(iotDevicePermissions.findPaginated)
  @PaginatedSwaggerDocs(FindIotDeviceDto, iotDevicePaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get multiple IoT Devices', iotDevicePermissions.findPaginated), description: formatRolesForSwagger(iotDevicePermissions.findPaginated) })
  async findPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindIotDeviceDto>> {
    return this.iotDeviceSanitizer.sanitizePaginatedIotDevices(await this.iotDeviceService.findPaginated(query));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(iotDevicePermissions.findOne)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get IoT Device by ID', iotDevicePermissions.findOne), description: formatRolesForSwagger(iotDevicePermissions.findOne) })
  @ApiOkResponse({ description: 'IoT Device retrieved successfully', type: FindIotDeviceDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindIotDeviceDto> {
    return this.iotDeviceSanitizer.sanitizeIotDevice(await this.iotDeviceService.findOne(id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(iotDevicePermissions.update)
  @ApiBody({ type: UpdateIotDeviceDto })
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Update IoT Device by ID', iotDevicePermissions.update), description: formatRolesForSwagger(iotDevicePermissions.update) })
  @ApiOkResponse({ description: 'IoT Device updated successfully', type: FindIotDeviceDto })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateIotDeviceDto: UpdateIotDeviceDto): Promise<FindIotDeviceDto> {
    return this.iotDeviceSanitizer.sanitizeIotDevice(await this.iotDeviceService.update(id, updateIotDeviceDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(iotDevicePermissions.remove)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Delete IoT Device by ID', iotDevicePermissions.remove), description: formatRolesForSwagger(iotDevicePermissions.remove) })
  @ApiOkResponse({ description: 'IoT Device deleted successfully', type: FindIotDeviceDto })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindIotDeviceDto> {
    return this.iotDeviceSanitizer.sanitizeIotDevice(await this.iotDeviceService.remove(id));
  }
}
