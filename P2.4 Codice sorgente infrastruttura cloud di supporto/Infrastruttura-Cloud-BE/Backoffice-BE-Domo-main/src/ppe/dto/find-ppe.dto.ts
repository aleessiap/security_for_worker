import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { IPersonalProtectiveEquipment, PPETypeEnum } from "@visioscientiae/backoffice-packages-domo";
import { FindUserDto } from "src/user/dto/find-user.dto";
import { Type } from "class-transformer";

export class FindPPEDto implements IPersonalProtectiveEquipment {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsString()
    @Type(() => String)
    name: string;

    @IsEnum(PPETypeEnum)
    @Type(() => String)
    type: PPETypeEnum;

    @IsBoolean()
    @Type(() => Boolean)
    available: boolean;

    @IsOptional()
    @IsUUID()
    @Type(() => String)
    userId?: string;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

    // Populable fields
    @IsOptional()
    @ValidateNested()
    @Type(() => FindUserDto)
    belongsTo?: FindUserDto;
}