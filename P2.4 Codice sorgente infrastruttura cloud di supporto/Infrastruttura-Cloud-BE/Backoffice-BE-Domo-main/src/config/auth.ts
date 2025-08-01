import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as path from 'node:path';

export default registerAs('auth', () => {
    if (
        !process.env.AUTH_JWT_PUB_KEY_LOCATION ||
        !process.env.AUTH_JWT_PRIV_KEY_LOCATION
    ) {
        Logger.error(`PLEASE DEFINE ENV VARIABLE AUTH_JWT_PUB_KEY_LOCATION and AUTH_JWT_PRIV_KEY_LOCATION`);
        Logger.error('THE APPLICATION WILL __NOT__ START WITHOUT THESE VALUES');
        process.exit(-1);
    }

    const pubLocation = process.env.AUTH_JWT_PUB_KEY_LOCATION;
    const privLocation = process.env.AUTH_JWT_PRIV_KEY_LOCATION;

    const resolvedPubPath = path.resolve(pubLocation);
    const resolvedPrivPath = path.resolve(privLocation);

    return {
        saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS) || 10,
        jwtPubKey: resolvedPubPath,
        jwtPrivKey: resolvedPrivPath,
        jwtAlgorithm: process.env.AUTH_JWT_ALGORITHM || 'RS256',
        jwtExpirationTime: process.env.AUTH_JWT_EXPIRATION_TIME || '24h',
    };
});