import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Logger } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    use(req: FastifyRequest, res: FastifyReply, next: () => void) {
        const message = `[${req.method.toUpperCase()}] - {${req.originalUrl}} called from ${req.ip}`;      
              
        Logger.log(message, 'RequestMiddleware');
        next();
    }
}
