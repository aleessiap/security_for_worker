import { registerAs } from '@nestjs/config';
import * as fs from 'fs';

export default registerAs('database', () => {
    const type = process.env.DATABASE_TYPE || 'postgres';
    const host = process.env.DATABASE_HOST || '127.0.0.1';
    const port = parseInt(process.env.DATABASE_PORT, 10) || 5432;
    const username = process.env.DATABASE_USER || 'admin';
    const password = process.env.DATABASE_PASSWORD || 'password';
    const database = process.env.DATABASE_NAME || 'db_prova';
    const synchronize = process.env.DATABASE_SYNC === 'true' || false;
    const logging = false;
    const entities = [__dirname + '/../**/*.entity{.ts,.js}'];
    let ssl = undefined;
    if(process.env.DATABASE_SLL === "true"){
        const ca = fs.readFileSync(process.env.DATABASE_SSL_CA_PATH).toString()
        ssl = {
            ca,
            rejectUnauthorized: true,
        }
    }

    return {
        type,
        host,
        port,
        ssl,
        username,
        password,
        database,
        synchronize,
        logging,
        entities,
    };
});