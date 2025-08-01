import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ErrorTitles, IError } from '@visioscientiae/backoffice-packages-domo';
 
export default class EntryNotFoundException extends NotFoundException {
    constructor(resource: string, identifier: string) {
        super({
            status: HttpStatus.NOT_FOUND,
            title: ErrorTitles.NOT_FOUND,
            detail: `${resource} with entry '${identifier}' was not found`
        } as IError);
    }
}