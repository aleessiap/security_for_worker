import { ICreatePersonalProtectiveEquipment, IError, IPaginateQuery, IPersonalProtectiveEquipment, IUpdatePersonalProtectiveEquipment } from "@visioscientiae/backoffice-packages-domo";
import { GenericPaginatedResponse, GenericResponse } from "./utility/generic-response";

import axios from "./utility/axios-middleware";

const ppeEndpoint = 'ppes';

export default {
    findPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IPersonalProtectiveEquipment[]>> => {
        let result = new GenericPaginatedResponse<IPersonalProtectiveEquipment[]>();
        try {
            const response = await axios.get (ppeEndpoint, { params: {...paginateParameters} });
            result.data = response.data.data as IPersonalProtectiveEquipment[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    findRelatedByMe: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IPersonalProtectiveEquipment[]>> => {
        let result = new GenericPaginatedResponse<IPersonalProtectiveEquipment[]>();
        try {
            const response = await axios.get (`${ppeEndpoint}/me`, { params: {...paginateParameters} });
            result.data = response.data.data as IPersonalProtectiveEquipment[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    create: async (ppe: ICreatePersonalProtectiveEquipment): Promise<GenericResponse<IPersonalProtectiveEquipment>> => {
        let result = new GenericResponse<IPersonalProtectiveEquipment>();
        try {
            const response = await axios.post (ppeEndpoint, ppe);
            result.data = response.data.data as IPersonalProtectiveEquipment;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    update: async (ppeId: string, ppe: IUpdatePersonalProtectiveEquipment): Promise<GenericResponse<IPersonalProtectiveEquipment>> => {
        let result = new GenericResponse<IPersonalProtectiveEquipment>();
        try {
            const response = await axios.patch (`${ppeEndpoint}/${ppeId}`, ppe);
            result.data = response.data as IPersonalProtectiveEquipment;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    delete: async (ppeId: string): Promise<GenericResponse<IPersonalProtectiveEquipment>> => {
        let result = new GenericResponse<IPersonalProtectiveEquipment>();
        try {
            const response = await axios.delete (`${ppeEndpoint}/${ppeId}`);
            result.data = response.data.data as IPersonalProtectiveEquipment;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    }
}