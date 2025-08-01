import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ErrorTitles, IError } from '@visioscientiae/backoffice-packages-domo';
 
export default class CustomBadRequestException extends BadRequestException {
    constructor(message?: string) {
        super({
            status: HttpStatus.BAD_REQUEST,
            title: ErrorTitles.BAD_REQUEST,
            detail: message
        } as IError);
    }
}