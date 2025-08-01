import { EventTypeEnum, IOperatorEvent, PPETypeEnum } from "@visioscientiae/backoffice-packages-domo";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { FindJobDto } from "src/job/dto/find-job.dto";
import { FindUserDto } from "src/user/dto/find-user.dto";

export class FindOperatorEventDto implements IOperatorEvent {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsString()
    @Type(() => String)
    operatorName: string;

    @IsString()
    @Type(() => String)
    operatorSurname: string;

    @IsString()
    @Type(() => String)
    operatorEmailAddress: string;

    @IsEnum(PPETypeEnum)
    @Type(() => String)
    ppeType: PPETypeEnum;

    @IsEnum(EventTypeEnum)
    @Type(() => String)
    eventType: EventTypeEnum;

    @IsDate()
    @Type(() => Date)
    timestamp: Date;

    @IsOptional()
    @IsUUID()
    @Type(() => String)
    operatorId?: string;

    @IsUUID()
    @Type(() => String)
    jobId: string;

    //Populable fields
    @IsOptional()
    @ValidateNested()
    @Type(() => FindUserDto)
    emittedBy?: FindUserDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => FindJobDto)
    job?: FindJobDto;
}