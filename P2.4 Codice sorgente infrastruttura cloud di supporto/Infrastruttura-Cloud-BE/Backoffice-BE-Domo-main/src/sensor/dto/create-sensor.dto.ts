import { IsAlphanumeric, IsNotEmpty, IsOptional, IsUUID, Length } from "class-validator";
import { ICreateSensor } from "@visioscientiae/backoffice-packages-domo";

export class CreateSensorDto implements ICreateSensor {
    @IsNotEmpty()
    @IsAlphanumeric()
    @Length(8, 8)
    identifierCode: string;

    @IsOptional()
    @IsUUID()
    iotDeviceId?: string;
}
