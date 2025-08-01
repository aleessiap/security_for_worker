import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSanitizerService } from './services/user-sanitizer.service';
import { OperatorController } from './controllers/operator.controller';
import { OperatorService } from './services/operator.service';
import { OperatorSanitizerService } from './services/operator-sanitizer.service';
import { Job } from 'src/job/entities/job.entity';
import { JobSanitizerService } from 'src/job/services/job-sanitizer.service';
import { EnvironmentSanitizerService } from 'src/environment/services/environment-sanitizer.service';
import { JobOperatorSanitizerService } from 'src/job/services/job-operator-sanitizer.service';
import { JobOperator } from 'src/job/entities/job-operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Job, JobOperator])],
  controllers: [UserController, OperatorController],
  providers: [
    UserService,
    UserSanitizerService,
    OperatorService,
    OperatorSanitizerService,
    JobSanitizerService,
    UserSanitizerService,
    EnvironmentSanitizerService,
    JobOperatorSanitizerService,
  ],
})
export class UserModule {}
