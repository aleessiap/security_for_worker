import { IEnvironmentEvent, IError, IOperatorEvent, IPaginateQuery } from "@visioscientiae/backoffice-packages-domo";
import { GenericPaginatedResponse, GenericResponse } from "./utility/generic-response";
import { ICreateEnvironment, IEnvironment, IUpdateEnvironment } from "@visioscientiae/backoffice-packages-domo/lib/esm/environment.interface";

import axios from "./utility/axios-middleware";

const operatorEventEndpoint = 'operator-events';
const environmentEventEndpoint = 'environment-events';

export default {
    operatorFindPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IOperatorEvent[]>> => {
        let result = new GenericPaginatedResponse<IOperatorEvent[]>();
        try {
            const response = await axios.get (operatorEventEndpoint, { params: {...paginateParameters} });
            result.data = response.data.data as IOperatorEvent[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    operatorFindMyPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IOperatorEvent[]>> => {
        let result = new GenericPaginatedResponse<IOperatorEvent[]>();
        try {
            const response = await axios.get (`${operatorEventEndpoint}/me`, { params: {...paginateParameters} });
            result.data = response.data.data as IOperatorEvent[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    operatorFindOne: async (id: string): Promise<GenericResponse<IOperatorEvent>> => {
        let result = new GenericResponse<IOperatorEvent>();
        try {
            const response = await axios.get (`${operatorEventEndpoint}/${id}`);
            result.data = response.data as IOperatorEvent;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    environmentFindPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IEnvironmentEvent[]>> => {
        let result = new GenericPaginatedResponse<IEnvironmentEvent[]>();
        try {
            const response = await axios.get (environmentEventEndpoint, { params: {...paginateParameters} });
            result.data = response.data.data as IEnvironmentEvent[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    environmentFindMyPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IEnvironmentEvent[]>> => {
        let result = new GenericPaginatedResponse<IEnvironmentEvent[]>();
        try {
            const response = await axios.get (`${environmentEventEndpoint}/me`, { params: {...paginateParameters} });
            result.data = response.data.data as IEnvironmentEvent[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    environmentFindOne: async (id: string): Promise<GenericResponse<IEnvironmentEvent>> => {
        let result = new GenericResponse<IEnvironmentEvent>();
        try {
            const response = await axios.get (`${environmentEventEndpoint}/${id}`);
            result.data = response.data as IEnvironmentEvent;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },
}