import { Injectable } from "@nestjs/common";
import { IoTDeviceSanitizerService } from "src/iot-device/services/iot-device-sanitizer.service";
import { Sensor } from "../entities/sensor.entity";
import { FindSensorDto } from "../dto/find-sensor.dto";
import { Paginated } from "nestjs-paginate";

@Injectable()
export class SensorSanitizerService {
    constructor(
        private ioTDeviceSanitizerService: IoTDeviceSanitizerService,
    ) {}

    sanitizeSensor(sensor: Sensor): FindSensorDto {
        return {
            id: sensor.id,
            identifierCode: sensor.identifierCode,
            iotDeviceId: sensor.iotDeviceId,
            createdAt: sensor.createdAt,
            updatedAt: sensor.updatedAt,
            containedWithin: sensor.containedWithin ? this.ioTDeviceSanitizerService.sanitizeIotDevice(sensor.containedWithin) : undefined
        }
    }

    sanitizeSensors(sensors: Sensor[]): FindSensorDto[] {
        return sensors.map(sensor => this.sanitizeSensor(sensor));
    }

    sanitizePaginatedSensors(paginatedSensors: Paginated<Sensor>): Paginated<FindSensorDto> {
        return {
            ...paginatedSensors,
            data: this.sanitizeSensors(paginatedSensors.data)
        } as any;
    }
}