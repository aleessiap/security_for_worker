import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedUserDto, LoginDto } from '../dto/login.dto.';
import { AuthSanitizerService } from '../services/auth-sanitizer.service';
import { formatRolesForSwagger } from 'src/utils/utility';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authSanitizerService: AuthSanitizerService
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'User Login', description: formatRolesForSwagger([]) })
  @ApiCreatedResponse({ description: 'User logged successfully', type: LoggedUserDto })
  async login(@Body() loginDto: LoginDto): Promise<LoggedUserDto> {
    return this.authSanitizerService.sanitizeLogin(await this.authService.login(loginDto));
  }
}
