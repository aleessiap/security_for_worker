import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserService } from "../services/user.service";
import { PaginatedSwaggerDocs, Paginate, PaginateQuery, Paginated } from "nestjs-paginate";
import { Roles } from "src/decorators/role";
import { appendRolesToText, formatRolesForSwagger } from "src/utils/utility";
import { CreateOperatorDto } from "../dto/create-user.dto";
import { FindOperatorWithJobsDto, FindUserDto } from "../dto/find-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserSanitizerService } from "../services/user-sanitizer.service";
import { userPaginateConfig } from "../user.paginate.config";
import { userPermissions } from "../user.permissions";
import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";
import { OperatorService } from "../services/operator.service";
import { OperatorSanitizerService } from "../services/operator-sanitizer.service";

@Controller('operators')
@ApiTags('Operator')
export class OperatorController {
    constructor(
      private readonly userService: UserService,
      private readonly operatorService: OperatorService,
      private userSanitizer: UserSanitizerService,
    ) {}
  
    @Post()
    @ApiBearerAuth()
    @Roles(userPermissions.createOperator)
    @ApiBody({ type: CreateOperatorDto })
    @ApiOperation({ summary: appendRolesToText('Create operator', userPermissions.createOperator), description: formatRolesForSwagger(userPermissions.createOperator) })
    @ApiCreatedResponse({ description: 'Operator created successfully', type: FindUserDto })
    async createOperator(@Body() createOperatorDto: CreateOperatorDto): Promise<FindUserDto> {
      return this.userSanitizer.sanitizeUser(await this.userService.create({ ...createOperatorDto, role: UserRoleEnum.OPERATOR }));
    }
  
    @Get()
    @ApiBearerAuth()
    @Roles(userPermissions.findPaginatedOperator)
    @PaginatedSwaggerDocs(FindUserDto, userPaginateConfig())
    @ApiOperation({ summary: appendRolesToText('Get multiple operators', userPermissions.findPaginatedOperator), description: formatRolesForSwagger(userPermissions.findPaginatedOperator) })
    async findPaginatedOperator(@Paginate() query: PaginateQuery): Promise<Paginated<FindUserDto>> {
      const filter = { ...query.filter, role: UserRoleEnum.OPERATOR };
      return this.userSanitizer.sanitizePaginatedUsers(await this.userService.findPaginated({ ...query, filter }));
    }

    @Get('with-jobs')
    @ApiBearerAuth()
    @Roles(userPermissions.findPaginatedOperator)
    @PaginatedSwaggerDocs(FindUserDto, userPaginateConfig())
    @ApiOperation({ summary: appendRolesToText('Get multiple operators and their current job', userPermissions.findPaginatedOperator), description: formatRolesForSwagger(userPermissions.findPaginatedOperator) })
    async findPaginatedOperatorWithJobs(@Paginate() query: PaginateQuery): Promise<Paginated<FindOperatorWithJobsDto>> {
      const filter = { ...query.filter, role: UserRoleEnum.OPERATOR };
      return await this.operatorService.findPaginatedOperatorsWithJobs({ ...query, filter });
    }

    @Get('free')
    @ApiBearerAuth()
    @Roles(userPermissions.findPaginatedOperator)
    @PaginatedSwaggerDocs(FindUserDto, userPaginateConfig())
    @ApiOperation({ summary: appendRolesToText('Get multiple operators that aren\'t assigned to a job', userPermissions.findPaginatedOperator), description: formatRolesForSwagger(userPermissions.findPaginatedOperator) })
    async findPaginatedFreeOperator(@Paginate() query: PaginateQuery): Promise<Paginated<FindUserDto>> {
      const filter = { ...query.filter, role: UserRoleEnum.OPERATOR };
      return this.userSanitizer.sanitizePaginatedUsers(await this.operatorService.findPaginatedFreeOperators({ ...query, filter }));
    }

    @Get(':id')
    @ApiBearerAuth()
    @Roles(userPermissions.findOneOperator)
    @ApiParam({ name: 'id', type: String })
    @ApiOperation({ summary: appendRolesToText('Get user by ID', userPermissions.findOneOperator), description: formatRolesForSwagger(userPermissions.findOneOperator) })
    @ApiOkResponse({ description: 'User retrieved successfully', type: FindUserDto })
    async findOneOperator(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindUserDto> {
      return this.userSanitizer.sanitizeUser(await this.operatorService.findOneOperator(id));
    }
  
    @Patch(':id')
    @ApiBearerAuth()
    @Roles(userPermissions.updateOperator)
    @ApiBody({ type: UpdateUserDto })
    @ApiParam({ name: 'id', type: String })
    @ApiOperation({ summary: appendRolesToText('Update operator by ID', userPermissions.updateOperator), description: formatRolesForSwagger(userPermissions.updateOperator) })
    @ApiOkResponse({ description: 'Operator updated successfully', type: FindUserDto })
    async updateOperator(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto): Promise<FindUserDto> {
      return this.userSanitizer.sanitizeUser(await this.operatorService.updateOperator(id, updateUserDto));
    }
  
    @Delete(':id')
    @ApiBearerAuth()
    @Roles(userPermissions.removeOperator)
    @ApiParam({ name: 'id', type: String })
    @ApiOperation({ summary: appendRolesToText('Delete operator by ID', userPermissions.removeOperator), description: formatRolesForSwagger(userPermissions.removeOperator) })
    @ApiOkResponse({ description: 'Operator deleted successfully', type: FindUserDto })
    async removeOperator(@Param('id', new ParseUUIDPipe()) id: string): Promise<FindUserDto> {
      return this.userSanitizer.sanitizeUser(await this.operatorService.removeOperator(id));
    }
  }
  