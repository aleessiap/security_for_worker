import { IPaginateQuery } from "@visioscientiae/backoffice-packages-domo";

import qs from 'qs';

export function formatParams(paginateParameters?: IPaginateQuery): string {
    let customParts = [];

    if(paginateParameters) {
        if (paginateParameters.sortBy && Array.isArray(paginateParameters.sortBy)) {
            const sortByParts = paginateParameters.sortBy.map(([field, order]: [string, string]) => `sortBy=${field}:${order.toUpperCase()}`);
            customParts.push(...sortByParts);
            delete paginateParameters.sortBy;
        }
        
        const serializedParams = qs.stringify(paginateParameters, { arrayFormat: 'brackets' });
        return [...customParts, serializedParams].filter(part => part).join('&');
    }

    return '';
}