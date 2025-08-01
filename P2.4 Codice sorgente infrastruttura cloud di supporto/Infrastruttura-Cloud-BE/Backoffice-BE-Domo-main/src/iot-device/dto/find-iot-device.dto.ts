import { Type } from "class-transformer";
import { IsAlphanumeric, IsDate, IsEnum, IsOptional, IsUUID, Length, ValidateNested } from "class-validator";
import { IIotDevice, IotDeviceTypeEnum } from "@visioscientiae/backoffice-packages-domo";
import { FindPPEDto } from "src/ppe/dto/find-ppe.dto";
import { FindEnvironmentDto } from "src/environment/dto/find-environment.dto";

export class FindIotDeviceDto implements IIotDevice {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsAlphanumeric()
    @Length(8, 8)
    @Type(() => String)
    identifierCode: string;

    @IsEnum(IotDeviceTypeEnum)
    @Type(() => String)
    type: IotDeviceTypeEnum;

    @IsOptional()
    @IsUUID()
    @Type(() => String)
    ppeId?: string;

    @IsOptional()
    @IsUUID()
    @Type(() => String)
    environmentId?: string;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

    // Populable fields
    @IsOptional()
    @ValidateNested()
    installedOn?: FindPPEDto|FindEnvironmentDto;
}