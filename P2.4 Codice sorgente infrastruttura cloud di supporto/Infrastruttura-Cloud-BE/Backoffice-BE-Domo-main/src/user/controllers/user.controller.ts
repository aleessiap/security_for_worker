import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { Paginate, PaginateQuery, Paginated, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { UserService } from '../services/user.service';
import { CreateOperatorDto, CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserSanitizerService } from '../services/user-sanitizer.service';
import { FindUserDto } from '../dto/find-user.dto';
import { userPaginateConfig } from '../user.paginate.config';
import { Roles } from '../../decorators/role';
import { appendRolesToText, formatRolesForSwagger } from '../../utils/utility';
import { userPermissions } from '../user.permissions';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private userSanitizer: UserSanitizerService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(userPermissions.create)
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: appendRolesToText('Create user', userPermissions.create), description: formatRolesForSwagger(userPermissions.create) })
  @ApiCreatedResponse({ description: 'User created successfully', type: FindUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<FindUserDto> {
    return this.userSanitizer.sanitizeUser(await this.userService.create(createUserDto));
  }

  @Get()
  @ApiBearerAuth()
  @Roles(userPermissions.findPaginated)
  @PaginatedSwaggerDocs(FindUserDto, userPaginateConfig())
  @ApiOperation({ summary: appendRolesToText('Get multiple users', userPermissions.findPaginated), description: formatRolesForSwagger(userPermissions.findPaginated) })
  async findPaginated(@Paginate() query: PaginateQuery): Promise<Paginated<FindUserDto>> {
    return this.userSanitizer.sanitizePaginatedUsers(await this.userService.findPaginated(query));
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(userPermissions.findOne)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Get user by ID', userPermissions.findOne), description: formatRolesForSwagger(userPermissions.findOne) })
  @ApiOkResponse({ description: 'User retrieved successfully', type: FindUserDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindUserDto> {
    return this.userSanitizer.sanitizeUser(await this.userService.findOne(id));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(userPermissions.update)
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Update user by ID', userPermissions.update), description: formatRolesForSwagger(userPermissions.update) })
  @ApiOkResponse({ description: 'User updated successfully', type: FindUserDto })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto): Promise<FindUserDto> {
    return this.userSanitizer.sanitizeUser(await this.userService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(userPermissions.remove)
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: appendRolesToText('Delete user by ID', userPermissions.remove), description: formatRolesForSwagger(userPermissions.remove) })
  @ApiOkResponse({ description: 'User deleted successfully', type: FindUserDto })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindUserDto> {
    return this.userSanitizer.sanitizeUser(await this.userService.remove(id));
  }
}
