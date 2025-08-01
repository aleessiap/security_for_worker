import { IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { IOperatorWithJobs, IUser, UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";
import { Type } from "class-transformer";
import { FindJobDto, FindJobOperatorDto } from "src/job/dto/find-job.dto";

export class FindUserDto implements IUser {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    name: string;
    
    @IsOptional()
    @IsString()
    @Type(() => String)
    surname: string;

    @IsString()
    @Type(() => String)
    email: string;

    @IsEnum(UserRoleEnum)
    @Type(() => String)
    role: UserRoleEnum;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;
}

export class FindOperatorWithJobsDto implements IOperatorWithJobs {
    @IsUUID()
    @Type(() => String)
    id: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    name: string;
    
    @IsOptional()
    @IsString()
    @Type(() => String)
    surname: string;

    @IsString()
    @Type(() => String)
    email: string;

    @IsEnum(UserRoleEnum)
    @Type(() => String)
    role: UserRoleEnum;

    @IsOptional()
    @ValidateNested()
    @Type(() => FindJobDto)
    currentJob?: FindJobDto;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;
}