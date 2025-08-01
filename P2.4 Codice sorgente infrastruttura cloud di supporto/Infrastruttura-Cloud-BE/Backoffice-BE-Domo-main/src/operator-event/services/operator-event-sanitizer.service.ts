import { Injectable } from "@nestjs/common";
import { OperatorEvent } from "../entities/operator-event.entity";
import { FindOperatorEventDto } from "../dto/find-operator-event.dto";
import { Paginated } from "nestjs-paginate";
import { UserSanitizerService } from "src/user/services/user-sanitizer.service";
import { JobSanitizerService } from "src/job/services/job-sanitizer.service";

@Injectable()
export class OperatorEventSanitizerService {
    constructor(
        private userSanitizer: UserSanitizerService,
        private jobSanitizer: JobSanitizerService
    ) {}

    sanitizeOperatorEvent(operatorEvent: OperatorEvent): FindOperatorEventDto {
        return {
            id: operatorEvent.id,
            operatorName: operatorEvent.operatorName,
            operatorSurname: operatorEvent.operatorSurname,
            operatorEmailAddress: operatorEvent.operatorEmailAddress,
            ppeType: operatorEvent.ppeType,
            eventType: operatorEvent.eventType,
            timestamp: operatorEvent.timestamp,
            operatorId: operatorEvent.operatorId,
            jobId: operatorEvent.jobId,
            emittedBy: operatorEvent.emittedBy ? this.userSanitizer.sanitizeUser(operatorEvent.emittedBy) : undefined,
            job: operatorEvent.job ? this.jobSanitizer.sanitizeJob(operatorEvent.job) : undefined
        }
    }

    sanitizeOperatorEvents(operatorEvents: OperatorEvent[]): FindOperatorEventDto[] {
        return operatorEvents.map(operatorEvent => this.sanitizeOperatorEvent(operatorEvent));
    }

    sanitizePaginatedOperatorEvents(paginatedOperatorEvents: Paginated<OperatorEvent>): Paginated<FindOperatorEventDto> {
        return {
            ...paginatedOperatorEvents,
            data: this.sanitizeOperatorEvents(paginatedOperatorEvents.data)
        } as Paginated<FindOperatorEventDto>;
    }
}