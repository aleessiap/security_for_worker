import { IError, IPaginateQuery } from "@visioscientiae/backoffice-packages-domo";
import { GenericPaginatedResponse, GenericResponse } from "./utility/generic-response";
import { ICreateEnvironment, IEnvironment, IUpdateEnvironment } from "@visioscientiae/backoffice-packages-domo/lib/esm/environment.interface";

import axios from "./utility/axios-middleware";

const environmentEndpoint = 'environments';

export default {
    findPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IEnvironment[]>> => {
        let result = new GenericPaginatedResponse<IEnvironment[]>();
        try {
            const response = await axios.get (environmentEndpoint, { params: {...paginateParameters} });
            result.data = response.data.data as IEnvironment[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    create: async (enviroment: ICreateEnvironment): Promise<GenericResponse<IEnvironment>> => {
        let result = new GenericResponse<IEnvironment>();
        try {
            const response = await axios.post (environmentEndpoint, enviroment);
            result.data = response.data as IEnvironment;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    update: async (environmentId: string, enviroment: IUpdateEnvironment): Promise<GenericResponse<IEnvironment>> => {
        let result = new GenericResponse<IEnvironment>();
        try {
            const response = await axios.patch (`${environmentEndpoint}/${environmentId}`, enviroment);
            result.data = response.data as IEnvironment;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    delete: async (environmentId: string): Promise<GenericResponse<IEnvironment>> => {
        let result = new GenericResponse<IEnvironment>();
        try {
            const response = await axios.delete (`${environmentEndpoint}/${environmentId}`);
            result.data = response.data as IEnvironment;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    }
}