import { Module } from '@nestjs/common';
import { EnvironmentService } from './services/environment.service';
import { EnvironmentController } from './controllers/environment.controller';
import { EnvironmentSanitizerService } from './services/environment-sanitizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from './entities/environment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Environment])],
  controllers: [EnvironmentController],
  providers: [
    EnvironmentService,
    EnvironmentSanitizerService
  ],
})
export class EnvironmentModule {}
