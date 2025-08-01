import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ErrorTitles, IError } from '@visioscientiae/backoffice-packages-domo';
 
export default class MultipleEntriesNotFoundException extends NotFoundException {
    constructor(resource: string, identifier: string[]) {
        super({
            status: HttpStatus.NOT_FOUND,
            title: ErrorTitles.NOT_FOUND,
            detail: `${resource} with the following entries were not found`,
            entries: identifier
        } as IError);
    }
}