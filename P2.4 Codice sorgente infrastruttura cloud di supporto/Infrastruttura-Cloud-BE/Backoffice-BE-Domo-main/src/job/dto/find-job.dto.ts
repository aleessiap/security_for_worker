import { EnvironmentTypeEnum, IJob, IJobOperator } from "@visioscientiae/backoffice-packages-domo";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { FindEnvironmentDto } from "src/environment/dto/find-environment.dto";
import { FindUserDto } from "src/user/dto/find-user.dto";

export class FindJobOperatorDto implements IJobOperator {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsString()
    @Type(() => String)
    name: string;

    @IsString()
    @Type(() => String)
    surname: string;

    @IsString()
    @Type(() => String)
    email: string;

    @IsOptional()
    @Type(() => Boolean)
    confirmed?: boolean;

    @IsBoolean()
    @Type(() => Boolean)
    closedJob?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => FindUserDto)
    operator?: FindUserDto;
}

export class FindJobDto implements IJob {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsString()
    @Type(() => String)
    name: string;

    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @IsString()
    @Type(() => String)
    environmentName: string;

    @IsEnum(EnvironmentTypeEnum)
    @Type(() => String)
    environmentType: EnvironmentTypeEnum;

    @IsString()
    @Type(() => String)
    creatorEmail: string;

    @IsBoolean()
    @Type(() => Boolean)
    aborted: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => FindUserDto)
    jobCreator?: FindUserDto;

    @ValidateNested()
    @Type(() => FindJobOperatorDto)
    operatorsList: FindJobOperatorDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => FindEnvironmentDto)
    environment?: FindEnvironmentDto;
}
