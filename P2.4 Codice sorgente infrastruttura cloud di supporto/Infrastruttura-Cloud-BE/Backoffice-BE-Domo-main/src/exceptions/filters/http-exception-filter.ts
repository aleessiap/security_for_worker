import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
 
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    Logger.debug(JSON.stringify(exception.getResponse(), null, 2), 'HttpExceptionFilter');

    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    
    const status = exception.getStatus();
 
    response.status(status).send({
      ...(exception.getResponse() as HttpException)
    });
  }
}