import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { IAuth } from '../../utils/config.interface';

@Injectable()
export class HashService {
    private saltRounds: number;

    constructor(private confService: ConfigService) {
        const auth = this.confService.get<IAuth>('auth');
        this.saltRounds = auth.saltRounds;
    }

    async compare(hash: string, rawString: string): Promise<boolean> {
        return await bcrypt.compare(rawString, hash);
    }

    async hash(rawString: string): Promise<string> {
        return await bcrypt.hash(rawString, this.saltRounds);
    }
}
