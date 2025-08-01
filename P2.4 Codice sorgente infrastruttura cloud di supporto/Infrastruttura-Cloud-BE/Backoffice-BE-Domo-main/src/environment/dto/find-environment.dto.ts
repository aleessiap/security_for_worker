import { EnvironmentTypeEnum, IEnvironment } from "@visioscientiae/backoffice-packages-domo";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString, IsUUID } from "class-validator";

export class FindEnvironmentDto implements IEnvironment {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsString()
    @Type(() => String)
    name: string;

    @IsEnum(EnvironmentTypeEnum)
    @Type(() => String)
    type: EnvironmentTypeEnum;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;
}