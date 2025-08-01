import { registerAs } from "@nestjs/config";

export default registerAs('pagination', () => {
    const maxPageSize = process.env.PAGINATION_MAX_PAGE_SIZE || 100;
    const defaultPageSize = process.env.PAGINATION_DEFAULT_PAGE_SIZE || 10;

    return {
        maxPageSize,
        defaultPageSize,
    }
});