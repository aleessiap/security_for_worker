import { FastifyRequest } from 'fastify';

export function extractTokenFromHeader(request: FastifyRequest): string | undefined {
    if ((request.headers as any)?.hasOwnProperty('authorization')) {
        const [type, token] = (request.headers as any)?.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    return undefined;
}
