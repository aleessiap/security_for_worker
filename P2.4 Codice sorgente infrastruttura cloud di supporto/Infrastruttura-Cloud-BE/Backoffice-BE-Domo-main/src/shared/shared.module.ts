import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from './services/hash.service';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'node:fs/promises';
import { IAuth } from '../utils/config.interface';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => config.get('database'),
        }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (confService: ConfigService) => {
                const auth = confService.get<IAuth>('auth');

                return {
                    publicKey: await fs.readFile(auth.jwtPubKey, {encoding: 'utf-8'}),
                    privateKey: await fs.readFile(auth.jwtPrivKey, {encoding: 'utf-8'}),
                    signOptions: {
                        algorithm: auth.jwtAlgorithm as any,
                        expiresIn: auth.jwtExpirationTime
                    }
                }
            }, 
        }),           
    ],
    providers: [HashService],
    exports: [HashService, JwtModule]
})
export class SharedModule { }
