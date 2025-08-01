import { Injectable } from "@nestjs/common";
import { FindJobOperatorDto } from "../dto/find-job.dto";
import { Paginated } from "nestjs-paginate";
import { JobOperator } from "../entities/job-operator.entity";
import { UserSanitizerService } from "src/user/services/user-sanitizer.service";

@Injectable()
export class JobOperatorSanitizerService {
    constructor(
        private sanitizeUser: UserSanitizerService
    ) {}

    sanitizeJobOperator(jobOperator: JobOperator): FindJobOperatorDto {
        return {
            id: jobOperator.id,
            name: jobOperator.name,
            surname: jobOperator.surname,
            email: jobOperator.email,
            confirmed: jobOperator.confirmed,
            operator: jobOperator.operator ? this.sanitizeUser.sanitizeUser(jobOperator.operator) : undefined
        }
    }

    sanitizeJobOperators(jobOperators: JobOperator[]): FindJobOperatorDto[] {
        return jobOperators.map(jobOperator => this.sanitizeJobOperator(jobOperator));
    }

    sanitizePaginatedJobOperators(paginatedJobOperators: Paginated<JobOperator>): Paginated<FindJobOperatorDto> {
        return {
            ...paginatedJobOperators,
            data: this.sanitizeJobOperators(paginatedJobOperators.data)
        } as Paginated<FindJobOperatorDto>;
    }
}