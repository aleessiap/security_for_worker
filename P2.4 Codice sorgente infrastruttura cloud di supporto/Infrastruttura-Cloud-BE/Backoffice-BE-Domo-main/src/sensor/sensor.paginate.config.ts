import { PaginateConfig } from "nestjs-paginate";
import { ConfigService } from "@nestjs/config";
import { Sensor } from "./entities/sensor.entity";

export const sensorPaginateConfig = (configService?: ConfigService): PaginateConfig<Sensor> => {
    return {
        sortableColumns: ['identifierCode', 'createdAt'],
        searchableColumns: ['identifierCode', 'containedWithin.identifierCode'],
        nullSort: 'last',
        relations: ['containedWithin'],
        defaultSortBy: [['createdAt', 'DESC']],
        maxLimit: configService ? configService.get<number>('pagination.maxPageSize') : 100,
        defaultLimit: configService ? configService.get<number>('pagination.defaultPageSize') : 10,
        filterableColumns: {},
    }
}