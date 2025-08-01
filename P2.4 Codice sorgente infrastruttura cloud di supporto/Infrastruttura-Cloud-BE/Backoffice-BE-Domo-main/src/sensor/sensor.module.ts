import { Module } from '@nestjs/common';
import { SensorService } from './services/sensor.service';
import { SensorController } from './controllers/sensor.controller';
import { IoTDeviceSanitizerService } from 'src/iot-device/services/iot-device-sanitizer.service';
import { SensorSanitizerService } from './services/sensor-sanitizer.service';
import { PPESanitizerService } from 'src/ppe/services/ppe-sanitizer.service';
import { UserSanitizerService } from 'src/user/services/user-sanitizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entities/sensor.entity';
import { IotDevice } from 'src/iot-device/entities/iot-device.entity';
import { EnvironmentSanitizerService } from 'src/environment/services/environment-sanitizer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, IotDevice])],
  controllers: [SensorController],
  providers: [
    SensorService,
    SensorSanitizerService,
    IoTDeviceSanitizerService,
    PPESanitizerService,
    UserSanitizerService,
    EnvironmentSanitizerService
  ],
})
export class SensorModule {}
