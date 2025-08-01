import { FilterOperator, FilterSuffix, PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { PersonalProtectiveEquipment } from "./entities/ppe.entity";

export const ppePaginateConfig = (configService?: ConfigService): PaginateConfig<PersonalProtectiveEquipment> => {
    return {
        sortableColumns: ['name', 'available', 'createdAt'],
        searchableColumns: ['name', 'belongsTo.email'],
        nullSort: 'last',
        relations: ['belongsTo', 'installedDevice'],
        defaultSortBy: [['createdAt', 'DESC']],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {
            type: [FilterOperator.IN],
            'installedDevice.ppeId': [FilterOperator.NULL],
        },
    }
}