import { IPaginateMeta, IPaginateQuery } from "@visioscientiae/backoffice-packages-domo";

export function convertIntToSortOrder(value: number): string {
    return value === 1 ? 'ASC' : 'DESC';
}

export function convertSortOrderToInt(value: string): number {
    return value?.toUpperCase() === 'ASC' ? 1 : -1;
}

export function paginationUtils(meta: IPaginateMeta) {
    return {
        getCurrentPage(): number {
            return meta?.currentPage;
        },
        getItemsPerPage(): number {
            return meta?.itemsPerPage;
        },
        getTotalItems(): number {
            return meta?.totalItems;
        },
        getSortByField(): string {
            return meta?.sortBy[0]?.[0];
        },
        getSortByOrder(): string {
            return meta?.sortBy[0]?.[1];
        },
    };
}