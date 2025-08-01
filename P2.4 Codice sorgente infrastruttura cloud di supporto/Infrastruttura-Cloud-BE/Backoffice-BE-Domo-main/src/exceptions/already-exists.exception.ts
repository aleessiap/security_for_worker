import { ConflictException, HttpStatus } from "@nestjs/common";
import { ErrorTitles, IError } from "@visioscientiae/backoffice-packages-domo";

export default class AlreadyExistsException extends ConflictException {
    constructor(resource: string, identifier: string) {
        super({
            status: HttpStatus.CONFLICT,
            title: ErrorTitles.ALREADY_EXISTS,
            detail: `${resource} with entry '${identifier}' already exists`
        } as IError);
    }
}