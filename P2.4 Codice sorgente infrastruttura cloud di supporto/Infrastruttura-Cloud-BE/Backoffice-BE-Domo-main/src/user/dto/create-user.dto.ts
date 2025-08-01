import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ICreateOperator, ICreateUser, UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

export class CreateUserDto implements ICreateUser {
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    surname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}

export class CreateOperatorDto implements ICreateOperator  {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    surname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}