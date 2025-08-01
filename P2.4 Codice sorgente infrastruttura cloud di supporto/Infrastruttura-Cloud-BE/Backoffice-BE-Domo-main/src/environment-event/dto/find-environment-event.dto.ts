import { EnvironmentTypeEnum, EventTypeEnum, IEnvironmentEvent } from "@visioscientiae/backoffice-packages-domo";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { FindEnvironmentDto } from "src/environment/dto/find-environment.dto";
import { FindJobDto } from "src/job/dto/find-job.dto";

export class FindEnvironmentEventDto implements IEnvironmentEvent {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsString()
    @Type(() => String)
    environmentName: string;

    @IsEnum(EnvironmentTypeEnum)
    @Type(() => String)
    environmentType: EnvironmentTypeEnum;

    @IsEnum(EventTypeEnum)
    @Type(() => String)
    eventType: EventTypeEnum;

    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    @IsOptional()
    @IsUUID()
    @Type(() => String)
    environmentId?: string;

    //Populable fields
    @IsOptional()
    @ValidateNested()
    @Type(() => FindEnvironmentDto)
    emittedBy?: FindEnvironmentDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => FindJobDto)
    jobs?: FindJobDto[];
}