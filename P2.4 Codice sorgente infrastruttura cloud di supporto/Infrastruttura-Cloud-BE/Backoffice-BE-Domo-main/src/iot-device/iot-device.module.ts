import { Module } from '@nestjs/common';
import { IotDeviceService } from './services/iot-device.service';
import { IotDeviceController } from './controllers/iot-device.controller';
import { IoTDeviceSanitizerService } from './services/iot-device-sanitizer.service';
import { PPESanitizerService } from 'src/ppe/services/ppe-sanitizer.service';
import { UserSanitizerService } from 'src/user/services/user-sanitizer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotDevice } from './entities/iot-device.entity';
import { PersonalProtectiveEquipment } from 'src/ppe/entities/ppe.entity';
import { EnvironmentSanitizerService } from 'src/environment/services/environment-sanitizer.service';
import { Environment } from 'src/environment/entities/environment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IotDevice, PersonalProtectiveEquipment, Environment])],
  controllers: [IotDeviceController],
  providers: [
    IotDeviceService,
    IoTDeviceSanitizerService,
    PPESanitizerService,
    UserSanitizerService,
    EnvironmentSanitizerService
  ],
})
export class IotDeviceModule {}
