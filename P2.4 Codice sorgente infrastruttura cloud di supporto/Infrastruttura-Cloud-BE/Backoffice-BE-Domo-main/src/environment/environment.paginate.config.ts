import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { Environment } from "./entities/environment.entity";

export const environmentPaginateConfig = (configService?: ConfigService): PaginateConfig<Environment> => {
    return {
        sortableColumns: ['name', 'createdAt'],
        searchableColumns: ['name'],
        nullSort: 'last',
        relations: ['installedDevice'],
        defaultSortBy: [['createdAt', 'DESC']],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {
            type: [FilterOperator.IN],
            'installedDevice.environmentId': [FilterOperator.NULL],
        }
    }
}