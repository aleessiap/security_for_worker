import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateIotDeviceDto } from './create-iot-device.dto';
import { IUpdateIotDevice } from "@visioscientiae/backoffice-packages-domo";

export class UpdateIotDeviceDto extends PartialType(OmitType(CreateIotDeviceDto, ['type', 'identifierCode'])) implements IUpdateIotDevice {}
