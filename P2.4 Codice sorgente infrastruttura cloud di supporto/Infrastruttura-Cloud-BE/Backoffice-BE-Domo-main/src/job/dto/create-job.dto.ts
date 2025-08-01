import { ICreateJob, IConfirmJob } from "@visioscientiae/backoffice-packages-domo";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateJobDto implements ICreateJob{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @IsUUID('4', { each: true })
    @ArrayMinSize(1)
    operatorsIdsList: string[];

    @IsNotEmpty()
    @IsUUID()
    environmentId: string;
}

export class ConfirmJobDto implements IConfirmJob {
    @IsNotEmpty()
    @IsBoolean()
    confirm: boolean;
}
