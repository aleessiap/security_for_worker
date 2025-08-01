import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { Job } from "./entities/job.entity";

export const jobPaginateConfig = (configService?: ConfigService): PaginateConfig<Job> => {
    return {
        sortableColumns: ['name', 'startDate', 'endDate'],
        searchableColumns: ['name'],
        nullSort: 'last',
        defaultSortBy: [['startDate', 'DESC']],
        relations: ['operatorsList'],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {
            endDate: [FilterOperator.NULL]
        }
    }
}