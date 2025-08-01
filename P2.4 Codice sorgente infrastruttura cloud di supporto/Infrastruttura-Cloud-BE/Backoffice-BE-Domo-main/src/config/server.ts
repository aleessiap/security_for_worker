import { registerAs } from "@nestjs/config";

export default registerAs('server', () => {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '127.0.0.1';
    const env = process.env.NODE_ENV || 'dev';
    
    return {
        port,
        host,
        env
    }
}) ;