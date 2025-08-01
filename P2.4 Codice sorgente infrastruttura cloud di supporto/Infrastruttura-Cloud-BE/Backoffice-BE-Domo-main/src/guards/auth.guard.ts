import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../decorators/role';
import { extractTokenFromHeader } from '../utils/token';
import CustomUnauthorizedException from 'src/exceptions/unauthorized-exception';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, 
        private jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler());
        
        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);
        if (!token) {
            if(!roles)
                return true;
            else
                return Promise.reject(new CustomUnauthorizedException('Missing Token'));
        }

        try {
            const payload =  (await this.jwtService.verifyAsync(token));
            const role = payload.role;
            
            if (roles && !roles.includes(role))
                return Promise.reject(new CustomUnauthorizedException('You do not have permission to access this endpoint'));

            request.user = payload;
            return true
        } catch (err) {
            return Promise.reject(new CustomUnauthorizedException('Invalid Token'));
        }
    }

}