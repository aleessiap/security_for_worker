import { Injectable } from "@nestjs/common";
import { FindOperatorWithJobsDto } from "../dto/find-user.dto";
import { User } from "../entities/user.entity";
import { Paginated } from "nestjs-paginate";

@Injectable()
export class OperatorSanitizerService {
    constructor() {}

    sanitizeOperatorWithJobs(user: User): FindOperatorWithJobsDto {
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    sanitizeOperatorsWithJobs(users: User[]): FindOperatorWithJobsDto[] {
        return users.map(user => this.sanitizeOperatorWithJobs(user));
    }
    
    sanitizePaginatedOperatorsWithJobs(paginatedUsers: Paginated<User>): Paginated<FindOperatorWithJobsDto> {
        return {
            ...paginatedUsers,
            data: this.sanitizeOperatorsWithJobs(paginatedUsers.data)
        } as Paginated<FindOperatorWithJobsDto>;
    }
}