import { Type } from "class-transformer";
import { IsAlphanumeric, IsDate, IsNotEmpty, IsOptional, IsUUID, Length, ValidateNested } from "class-validator";
import { ISensor } from "@visioscientiae/backoffice-packages-domo";
import { FindIotDeviceDto } from "src/iot-device/dto/find-iot-device.dto";

export class FindSensorDto implements ISensor {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsAlphanumeric()
    @Length(8, 8)
    @Type(() => String)
    identifierCode: string;

    @IsOptional()
    @IsUUID()
    @Type(() => String)
    iotDeviceId?: string;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

    // Populable fields
    @IsOptional()
    @ValidateNested()
    @Type(() => FindIotDeviceDto)
    containedWithin?: FindIotDeviceDto;
}