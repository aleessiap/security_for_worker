import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ICreatePersonalProtectiveEquipment, PPETypeEnum } from "@visioscientiae/backoffice-packages-domo";

export class CreatePPEDto implements ICreatePersonalProtectiveEquipment {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(PPETypeEnum)
    type: PPETypeEnum;

    @IsNotEmpty()
    @IsBoolean()
    available: boolean;

    @IsOptional()
    @IsUUID()
    userId?: string;
}
