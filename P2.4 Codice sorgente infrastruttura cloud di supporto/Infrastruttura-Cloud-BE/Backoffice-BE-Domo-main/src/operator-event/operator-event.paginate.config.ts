import { FilterOperator, FilterSuffix, PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { OperatorEvent } from "./entities/operator-event.entity";

export const operatorEventPaginateConfig = (configService?: ConfigService): PaginateConfig<OperatorEvent> => {
    return {
        sortableColumns: ['operatorName', 'operatorSurname', 'operatorEmailAddress', 'timestamp'],
        searchableColumns: ['operatorName', 'operatorSurname', 'operatorEmailAddress'],
        nullSort: 'last',
        defaultSortBy: [['timestamp', 'DESC']],
        relations: ['emittedBy', 'job'],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {
            ppeType: [FilterOperator.IN, FilterSuffix.NOT],
            eventType: [FilterOperator.IN, FilterSuffix.NOT],
            'emittedBy.email': [FilterOperator.EQ]
        }
    }
}