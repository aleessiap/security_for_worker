import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { JobSanitizerService } from './services/job-sanitizer.service';
import { EnvironmentSanitizerService } from 'src/environment/services/environment-sanitizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobOperator } from './entities/job-operator.entity';
import { User } from 'src/user/entities/user.entity';
import { UserSanitizerService } from 'src/user/services/user-sanitizer.service';
import { JobOperatorSanitizerService } from './services/job-operator-sanitizer.service';
import { Environment } from 'src/environment/entities/environment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobOperator, User, Environment])],
  controllers: [JobController],
  providers: [
    JobService,
    JobSanitizerService,
    JobOperatorSanitizerService,
    UserSanitizerService,
    EnvironmentSanitizerService,
    UserSanitizerService
  ],
})
export class JobModule {}
