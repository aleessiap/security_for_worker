import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { EnvironmentEnum, IServer } from './utils/config.interface';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/filters/http-exception-filter';
import { AnyExceptionFilter } from './exceptions/filters/any-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const configService = app.get(ConfigService);
  const serverInfo = configService.get<IServer>('server');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // The last filter in the chain is the one that is executed first, so in this case if the exception is an HttpException it will be caught by the HttpExceptionFilter
  // Otherwise, it will be caught by the AnyExceptionFilter
  app.useGlobalFilters(new AnyExceptionFilter(), new HttpExceptionFilter());

  app.enableCors();

  if (serverInfo.env !== EnvironmentEnum.PROD) {
    // app.enableCors();

    const config = new DocumentBuilder()
      .setTitle('Domo Backoffice API')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(serverInfo.port, serverInfo.host);
}
bootstrap();
