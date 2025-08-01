import { Injectable } from "@nestjs/common";
import { EnvironmentSanitizerService } from "src/environment/services/environment-sanitizer.service";
import { EnvironmentEvent } from "../entities/environment-event.entity";
import { FindEnvironmentEventDto } from "../dto/find-environment-event.dto";
import { Paginated } from "nestjs-paginate";
import { JobSanitizerService } from "src/job/services/job-sanitizer.service";

@Injectable()
export class EnvironmentEventSanitizerService {
    constructor(
        private environmentSanitizer: EnvironmentSanitizerService,
        private jobSanitizer: JobSanitizerService
    ) {}

    sanitizeEnvironmentEvent(environmentEvent: EnvironmentEvent): FindEnvironmentEventDto {
        return {
            id: environmentEvent.id,
            environmentName: environmentEvent.environmentName,
            environmentType: environmentEvent.environmentType,
            eventType: environmentEvent.eventType,
            timestamp: environmentEvent.timestamp,
            environmentId: environmentEvent.environmentId,
            emittedBy: environmentEvent.emittedBy ? this.environmentSanitizer.sanitizeEnvironment(environmentEvent.emittedBy) : undefined,
            jobs: environmentEvent.jobs ? this.jobSanitizer.sanitizeJobs(environmentEvent.jobs) : undefined
        }
    }

    sanitizeEnvironmentEvents(environmentEvents: EnvironmentEvent[]): FindEnvironmentEventDto[] {
        return environmentEvents.map(environmentEvent => this.sanitizeEnvironmentEvent(environmentEvent));
    }

    sanitizePaginatedEnvironmentEvents(paginatedEnvironmentEvents: Paginated<EnvironmentEvent>): Paginated<FindEnvironmentEventDto> {
        return {
            ...paginatedEnvironmentEvents,
            data: this.sanitizeEnvironmentEvents(paginatedEnvironmentEvents.data)
        } as Paginated<FindEnvironmentEventDto>;
    }
}