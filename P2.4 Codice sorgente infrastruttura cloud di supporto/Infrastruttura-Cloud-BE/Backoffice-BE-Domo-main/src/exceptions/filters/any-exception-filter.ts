import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ErrorTitles } from '@visioscientiae/backoffice-packages-domo';
import { FastifyRequest, FastifyReply } from 'fastify';
 
@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    Logger.error(exception, 'AnyExceptionFilter');

    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    
    response.status(status).send({
        status,
        title: ErrorTitles.INTERNAL_SERVER_ERROR,
        detail: 'An unexpected error occurred. Please try again later.'
    });
  }
}