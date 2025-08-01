import { registerAs } from "@nestjs/config";

export default registerAs('token', () => {
    const operatorEventToken = process.env.OPERATOR_EVENT_ENDPOINT_TOKEN || '';
    const environmentEventToken = process.env.ENVIRONMENT_EVENT_ENDPOINT_TOKEN || '';

    return {
        operatorEventToken,
        environmentEventToken,
    }
});