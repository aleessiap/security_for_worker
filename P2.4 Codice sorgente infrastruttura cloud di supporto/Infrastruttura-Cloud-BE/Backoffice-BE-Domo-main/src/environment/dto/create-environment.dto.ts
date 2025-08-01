import { EnvironmentTypeEnum, ICreateEnvironment } from "@visioscientiae/backoffice-packages-domo";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateEnvironmentDto implements ICreateEnvironment {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(EnvironmentTypeEnum)
    type: EnvironmentTypeEnum;
}
