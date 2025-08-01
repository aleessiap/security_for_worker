import { IsAlphanumeric, IsEnum, IsNotEmpty, IsOptional, IsUUID, Length } from "class-validator";
import { ICreateIotDevice, IotDeviceTypeEnum } from "@visioscientiae/backoffice-packages-domo";

export class CreateIotDeviceDto implements ICreateIotDevice {
    @IsNotEmpty()
    @IsAlphanumeric()
    @Length(8, 8)
    identifierCode: string;

    @IsNotEmpty()
    @IsEnum(IotDeviceTypeEnum)
    type: IotDeviceTypeEnum;

    @IsOptional()
    @IsUUID()
    ppeId?: string;

    @IsOptional()
    @IsUUID()
    environmentId?: string;
}
