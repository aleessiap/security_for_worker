import { FilterOperator, PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { IotDevice } from "./entities/iot-device.entity";

export const iotDevicePaginateConfig = (configService?: ConfigService): PaginateConfig<IotDevice> => {
    return {
        sortableColumns: ['identifierCode', 'createdAt'],
        searchableColumns: ['identifierCode', 'installedOnPPE.name', 'installedOnEnvironment.name'],
        nullSort: 'last',
        relations: ['installedOnPPE', 'installedOnEnvironment'],
        defaultSortBy: [['createdAt', 'DESC']],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {
            type: [FilterOperator.IN]
        },
    }
}