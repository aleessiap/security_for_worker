import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ErrorTitles, IError } from '@visioscientiae/backoffice-packages-domo';
 
export default class CustomUnauthorizedException extends UnauthorizedException {
    constructor(message?: string) {
        super({
            status: HttpStatus.UNAUTHORIZED,
            title: ErrorTitles.UNAUTHORIZED,
            detail: message
        } as IError);
    }
}