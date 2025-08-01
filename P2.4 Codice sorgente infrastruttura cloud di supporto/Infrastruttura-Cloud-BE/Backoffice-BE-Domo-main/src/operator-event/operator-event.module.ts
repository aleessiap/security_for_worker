import { Module } from '@nestjs/common';
import { OperatorEventService } from './services/operator-event.service';
import { OperatorEventController } from './controllers/operator-event.controller';
import { OperatorEventSanitizerService } from './services/operator-event-sanitizer.service';
import { OperatorEvent } from './entities/operator-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserSanitizerService } from 'src/user/services/user-sanitizer.service';
import { JobSanitizerService } from 'src/job/services/job-sanitizer.service';
import { EnvironmentSanitizerService } from 'src/environment/services/environment-sanitizer.service';
import { JobOperatorSanitizerService } from 'src/job/services/job-operator-sanitizer.service';
import { Sensor } from 'src/sensor/entities/sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OperatorEvent, User, Sensor])],
  controllers: [OperatorEventController],
  providers: [
    OperatorEventService,
    OperatorEventSanitizerService,
    UserSanitizerService,
    JobSanitizerService,
    EnvironmentSanitizerService,
    JobOperatorSanitizerService
  ],
})
export class OperatorEventModule {}
