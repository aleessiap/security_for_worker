import { Injectable } from "@nestjs/common";
import { FindJobDto } from "../dto/find-job.dto";
import { Job } from "../entities/job.entity";
import { EnvironmentSanitizerService } from "src/environment/services/environment-sanitizer.service";
import { Paginated } from "nestjs-paginate";
import { JobOperatorSanitizerService } from "./job-operator-sanitizer.service";
import { UserSanitizerService } from "src/user/services/user-sanitizer.service";

@Injectable()
export class JobSanitizerService {
    constructor(
        private userSanitizer: UserSanitizerService,
        private environmentSanitizer: EnvironmentSanitizerService,
        private jobOperatorSanitizer: JobOperatorSanitizerService
    ) {}

    sanitizeJob(job: Job): FindJobDto {
        return {
            id: job.id,
            name: job.name,
            startDate: job.startDate,
            endDate: job.endDate,
            environmentName: job.environmentName,
            environmentType: job.environmentType,
            creatorEmail: job.creatorEmail,
            aborted: job.aborted,
            jobCreator: job.jobCreator ? this.userSanitizer.sanitizeUser(job.jobCreator) : undefined,
            operatorsList: job.operatorsList ? this.jobOperatorSanitizer.sanitizeJobOperators(job.operatorsList) : undefined,
            environment: job.environment ? this.environmentSanitizer.sanitizeEnvironment(job.environment) : undefined
        }
    }

    sanitizeJobs(jobs: Job[]): FindJobDto[] {
        return jobs.map(job => this.sanitizeJob(job));
    }

    sanitizePaginatedJobs(paginatedJobs: Paginated<Job>): Paginated<FindJobDto> {
        return {
            ...paginatedJobs,
            data: this.sanitizeJobs(paginatedJobs.data)
        } as Paginated<FindJobDto>;
    }
}