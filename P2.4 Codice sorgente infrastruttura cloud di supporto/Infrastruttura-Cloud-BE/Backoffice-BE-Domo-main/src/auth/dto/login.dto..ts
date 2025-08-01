import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ILoggedUser, ILoginUser } from "@visioscientiae/backoffice-packages-domo";
import { FindUserDto } from "src/user/dto/find-user.dto";

export class LoginDto implements ILoginUser {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoggedUserDto implements ILoggedUser {
    @ValidateNested()
    @Type(() => FindUserDto)
    user: FindUserDto;

    @IsNotEmpty()
    @IsString()
    token: string
}