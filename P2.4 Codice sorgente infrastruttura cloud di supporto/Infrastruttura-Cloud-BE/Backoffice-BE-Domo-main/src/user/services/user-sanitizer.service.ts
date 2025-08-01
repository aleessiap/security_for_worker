import { Injectable } from "@nestjs/common";
import { FindUserDto } from "../dto/find-user.dto";
import { User } from "../entities/user.entity";
import { Paginated } from "nestjs-paginate";

@Injectable()
export class UserSanitizerService {
    constructor() {}

    sanitizeUser(user: User): FindUserDto {
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    sanitizeUsers(users: User[]): FindUserDto[] {
        return users.map(user => this.sanitizeUser(user));
    }
    
    sanitizePaginatedUsers(paginatedUsers: Paginated<User>): Paginated<FindUserDto> {
        return {
            ...paginatedUsers,
            data: this.sanitizeUsers(paginatedUsers.data)
        } as Paginated<FindUserDto>;
    }
}