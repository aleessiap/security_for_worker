import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthSanitizerService } from './services/auth-sanitizer.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.guard';
import { JobOperator } from 'src/job/entities/job-operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, JobOperator])],
  controllers: [AuthController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  }, AuthService, AuthSanitizerService]
})
export class AuthModule {}
