import { FilterOperator, FilterSuffix, PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { EnvironmentEvent } from "./entities/environment-event.entity";

export const environmentEventPaginateConfig = (configService?: ConfigService): PaginateConfig<EnvironmentEvent> => {
    return {
        sortableColumns: ['environmentName', 'timestamp'],
        searchableColumns: ['environmentName'],
        nullSort: 'last',
        defaultSortBy: [['timestamp', 'DESC']],
        relations: ['emittedBy', 'jobs'],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {
            environmentType: [FilterOperator.IN, FilterSuffix.NOT],
            eventType: [FilterOperator.IN, FilterSuffix.NOT],
            'emittedBy.name': [FilterOperator.EQ]
        }
    }
}