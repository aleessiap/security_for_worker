import { FilterOperator, FilterSuffix, PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { User } from "./entities/user.entity";

export const userPaginateConfig = (configService?: ConfigService): PaginateConfig<User> => {
    return {
        sortableColumns: ['name', 'surname', 'email', 'createdAt'],
        searchableColumns: ['email', 'name', 'surname'],
        nullSort: 'last',
        defaultSortBy: [['createdAt', 'DESC']],
        relations: ['ppeList', 'jobsProfiles', 'jobsProfiles.job'],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {
            role: [FilterOperator.IN, FilterSuffix.NOT],
            'ppeList.id': [FilterOperator.NULL, FilterSuffix.NOT],
        }
    }
}