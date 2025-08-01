import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import server from './config/server';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PPEModule } from './ppe/ppe.module';
import { IotDeviceModule } from './iot-device/iot-device.module';
import { SensorModule } from './sensor/sensor.module';
import database from './config/database';
import auth from './config/auth';
import pagination from './config/pagination';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { EnvironmentModule } from './environment/environment.module';
import { OperatorEventModule } from './operator-event/operator-event.module';
import { EnvironmentEventModule } from './environment-event/environment-event.module';
import { JobModule } from './job/job.module';
import token from './config/token';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [server, database, auth, pagination, token],
    }),
    TypeOrmModule.forFeature([User]),
    SharedModule,
    AuthModule,
    UserModule,
    PPEModule,
    IotDeviceModule,
    SensorModule,
    EnvironmentModule,
    OperatorEventModule,
    EnvironmentEventModule,
    JobModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
