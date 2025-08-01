export enum EnvironmentEnum {
    DEV = 'dev',
    PROD = 'prod',
    TEST = 'test',
}

export interface IServer {
    port: number;
    host: string;
    env: EnvironmentEnum;
}

export interface IDatabase {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    entities: string[];
}

export interface IAuth {
    saltRounds: number;
    jwtPubKey: string;
    jwtPrivKey: string;
    jwtAlgorithm: string;
    jwtExpirationTime: string;
}

export interface IPaginationConfig {
    maxPageSize: number,
    defaultPageSize: number
}

export interface IToken {
    operatorEventToken: string;
    environmentEventToken: string;
}