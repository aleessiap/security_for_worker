import { Injectable } from "@nestjs/common";
import { LoggedUserDto } from "../dto/login.dto.";
import { ILoggedUser } from "@visioscientiae/backoffice-packages-domo";

@Injectable()
export class AuthSanitizerService {
  constructor() {}

  sanitizeLogin(loggedUser: ILoggedUser): LoggedUserDto {
    return {
        user: {
            id: loggedUser.user.id,
            name: loggedUser.user.name,
            surname: loggedUser.user.surname,
            email: loggedUser.user.email,
            role: loggedUser.user.role,
            createdAt: loggedUser.user.createdAt,
            updatedAt: loggedUser.user.updatedAt
        },
        token: loggedUser.token,
    }
  }
}