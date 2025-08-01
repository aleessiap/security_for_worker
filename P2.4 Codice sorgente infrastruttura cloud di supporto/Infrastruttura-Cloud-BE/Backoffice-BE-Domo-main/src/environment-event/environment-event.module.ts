import { Module } from '@nestjs/common';
import { EnvironmentEventService } from './services/environment-event.service';
import { EnvironmentEventController } from './controllers/environment-event.controller';
import { EnvironmentEventSanitizerService } from './services/environment-event-sanitizer.service';
import { EnvironmentSanitizerService } from 'src/environment/services/environment-sanitizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentEvent } from './entities/environment-event.entity';
import { Environment } from 'src/environment/entities/environment.entity';
import { Sensor } from 'src/sensor/entities/sensor.entity';
import { Job } from 'src/job/entities/job.entity';
import { JobSanitizerService } from 'src/job/services/job-sanitizer.service';
import { JobOperatorSanitizerService } from 'src/job/services/job-operator-sanitizer.service';
import { UserSanitizerService } from 'src/user/services/user-sanitizer.service';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentEvent, Environment, Sensor, Job])],
  controllers: [EnvironmentEventController],
  providers: [
    EnvironmentEventService,
    EnvironmentEventSanitizerService,
    EnvironmentSanitizerService,
    JobSanitizerService,
    UserSanitizerService,
    JobOperatorSanitizerService
  ],
})
export class EnvironmentEventModule {}
