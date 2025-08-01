import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSensorDto } from './create-sensor.dto';
import { IUpdateSensor } from "@visioscientiae/backoffice-packages-domo";

export class UpdateSensorDto extends PartialType(OmitType(CreateSensorDto, ['identifierCode'])) implements IUpdateSensor {}
