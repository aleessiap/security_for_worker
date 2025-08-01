import { Injectable } from "@nestjs/common";
import { Environment } from "../entities/environment.entity";
import { FindEnvironmentDto } from "../dto/find-environment.dto";
import { Paginated } from "nestjs-paginate";

@Injectable()
export class EnvironmentSanitizerService {
    constructor() {}

    sanitizeEnvironment(environment: Environment): FindEnvironmentDto {
        return {
            id: environment.id,
            name: environment.name,
            type: environment.type,
            createdAt: environment.createdAt,
            updatedAt: environment.updatedAt,
        }
    }

    sanitizeEnvironments(environments: Environment[]): FindEnvironmentDto[] {
        return environments.map(environment => this.sanitizeEnvironment(environment));
    }

    sanitizePaginatedEnvironments(paginatedEnvironments: Paginated<Environment>): Paginated<FindEnvironmentDto> {
        return {
            ...paginatedEnvironments,
            data: this.sanitizeEnvironments(paginatedEnvironments.data)
        } as Paginated<FindEnvironmentDto>;
    }
}