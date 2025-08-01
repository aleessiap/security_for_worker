import { Injectable } from "@nestjs/common";
import { PPESanitizerService } from "src/ppe/services/ppe-sanitizer.service";
import { IotDevice } from "../entities/iot-device.entity";
import { FindIotDeviceDto } from "../dto/find-iot-device.dto";
import { Paginated } from "nestjs-paginate";
import { EnvironmentSanitizerService } from "src/environment/services/environment-sanitizer.service";
import { PersonalProtectiveEquipment } from "src/ppe/entities/ppe.entity";
import { Environment } from "src/environment/entities/environment.entity";
import { FindPPEDto } from "src/ppe/dto/find-ppe.dto";
import { FindEnvironmentDto } from "src/environment/dto/find-environment.dto";

@Injectable()
export class IoTDeviceSanitizerService {
    constructor(
        private ppeSanitizerService: PPESanitizerService,
        private environmentSanitizerService: EnvironmentSanitizerService
    ) {}

    sanitizeIotDevice(iotDevice: IotDevice): FindIotDeviceDto {
        let installedOn = undefined as FindPPEDto | FindEnvironmentDto;
        
        if(iotDevice.ppeId)
            installedOn = iotDevice.installedOnPPE ? this.ppeSanitizerService.sanitizePPE(iotDevice.installedOnPPE as PersonalProtectiveEquipment) : undefined;
        else if(iotDevice.environmentId)
            installedOn = iotDevice.installedOnEnvironment ? this.environmentSanitizerService.sanitizeEnvironment(iotDevice.installedOnEnvironment as Environment) : undefined;

        return {
            id: iotDevice.id,
            identifierCode: iotDevice.identifierCode,
            type: iotDevice.type,
            ppeId: iotDevice.ppeId,
            environmentId: iotDevice.environmentId,
            createdAt: iotDevice.createdAt,
            updatedAt: iotDevice.updatedAt,
            installedOn: installedOn
        }
    }

    sanitizeIotDevices(iotDevices: IotDevice[]): FindIotDeviceDto[] {
        return iotDevices.map(iotDevice => this.sanitizeIotDevice(iotDevice));
    }

    sanitizePaginatedIotDevices(paginatedIotDevices: Paginated<IotDevice>): Paginated<FindIotDeviceDto> {
        return {
            ...paginatedIotDevices,
            data: this.sanitizeIotDevices(paginatedIotDevices.data)
        } as Paginated<FindIotDeviceDto>;
    }
}