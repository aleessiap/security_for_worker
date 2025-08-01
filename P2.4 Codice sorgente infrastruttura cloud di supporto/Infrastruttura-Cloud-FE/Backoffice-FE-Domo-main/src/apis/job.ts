import { ICreateJob, IError, IJob, IPaginateQuery } from "@visioscientiae/backoffice-packages-domo";
import { GenericPaginatedResponse, GenericResponse } from "./utility/generic-response";

import axios from "./utility/axios-middleware";

const jobEndpoint = 'jobs';

export default {
    create: async (job: ICreateJob): Promise<GenericResponse<IJob>> => {
        let result = new GenericResponse<IJob>();
        try {
            const response = await axios.post (jobEndpoint, job);
            result.data = response.data.data as IJob;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    endJob: async (jobId: string): Promise<GenericResponse<IJob>> => {
        let result = new GenericResponse<IJob>();
        try {
            const response = await axios.patch (`${jobEndpoint}/${jobId}/end`);
            result.data = response.data as IJob;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    remove: async (jobId: string): Promise<GenericResponse<IJob>> => {
        let result = new GenericResponse<IJob>();
        try {
            const response = await axios.delete (`${jobEndpoint}/${jobId}`);
            result.data = response.data.data as IJob;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    getMyPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IJob[]>> => {
        let result = new GenericPaginatedResponse<IJob[]>();
        try {
            const response = await axios.get (`${jobEndpoint}/me`, { params: {...paginateParameters} });
            result.data = response.data.data as IJob[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    getPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IJob[]>> => {
        let result = new GenericPaginatedResponse<IJob[]>();
        try {
            const response = await axios.get (jobEndpoint, { params: {...paginateParameters} });
            result.data = response.data.data as IJob[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    getById: async (jobId: string): Promise<GenericResponse<IJob>> => {
        let result = new GenericResponse<IJob>();
        try {
            const response = await axios.get (`${jobEndpoint}/${jobId}`);
            result.data = response.data as IJob;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },
    
    getMyAssignedJob: async (): Promise<GenericResponse<IJob>> => {
        let result = new GenericResponse<IJob>();
        try {
            const response = await axios.get (`${jobEndpoint}/me/assigned`);
            result.data = response.data as IJob;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    confirmDenyAssignedJob: async (confirm: boolean): Promise<GenericResponse<IJob>> => {
        let result = new GenericResponse<IJob>();
        try {
            const response = await axios.patch (`${jobEndpoint}/me/assigned`, { confirm });
            result.data = response.data as IJob;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    }
}