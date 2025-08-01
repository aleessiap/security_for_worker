import { ICreateOperator, ICreateUser, IError, IOperatorWithJobs, IPaginateQuery, IUpdateUser, IUser, UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";
import { GenericPaginatedResponse, GenericResponse } from "./utility/generic-response";

import axios from "./utility/axios-middleware";

const userEndpoint = 'users';
const operatorEndpoint = 'operators';

export default {
    findPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IUser[]>> => {
        let result = new GenericPaginatedResponse<IUser[]>();
        try {
            const response = await axios.get (userEndpoint, { params: {...paginateParameters } });
            result.data = response.data.data as IUser[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    findPaginatedOperator: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IUser[]>> => {
        let result = new GenericPaginatedResponse<IUser[]>();
        try {
            const response = await axios.get (operatorEndpoint, { params: paginateParameters });
            result.data = response.data.data as IUser[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    findPaginatedOperatorWithJobs: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IOperatorWithJobs[]>> => {
        let result = new GenericPaginatedResponse<IOperatorWithJobs[]>();
        try {
            const response = await axios.get (`${operatorEndpoint}/with-jobs`, { params: paginateParameters });
            result.data = response.data.data as IOperatorWithJobs[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    findPaginatedFreeOperator: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IUser[]>> => {
        let result = new GenericPaginatedResponse<IUser[]>();
        try {
            const response = await axios.get (`${operatorEndpoint}/free`, { params: paginateParameters });
            result.data = response.data.data as IUser[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    create: async (user: ICreateUser): Promise<GenericResponse<IUser>> => {
        let result = new GenericResponse<IUser>();
        try {
            const response = await axios.post (userEndpoint, user);
            result.data = response.data as IUser;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    createOperator: async (operator: ICreateOperator): Promise<GenericResponse<IUser>> => {
        let result = new GenericResponse<IUser>();
        try {
            const response = await axios.post (operatorEndpoint, operator);
            result.data = response.data as IUser;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    update: async (userId: string, user: IUpdateUser): Promise<GenericResponse<IUser>> => {
        let result = new GenericResponse<IUser>();
        try {
            const response = await axios.patch (`${userEndpoint}/${userId}`, user);
            result.data = response.data as IUser;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    updateOperator: async (userId: string, operator: IUpdateUser): Promise<GenericResponse<IUser>> => {
        let result = new GenericResponse<IUser>();
        try {
            const response = await axios.patch (`${operatorEndpoint}/${userId}`, operator);
            result.data = response.data as IUser;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    delete: async (userId: string): Promise<GenericResponse<IUser>> => {
        let result = new GenericResponse<IUser>();
        try {
            const response = await axios.delete (`${userEndpoint}/${userId}`);
            result.data = response.data as IUser;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    deleteOperator: async (userId: string): Promise<GenericResponse<IUser>> => {
        let result = new GenericResponse<IUser>();
        try {
            const response = await axios.delete (`${operatorEndpoint}/${userId}`);
            result.data = response.data as IUser;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    }
}