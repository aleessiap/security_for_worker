import { ICreateIotDevice, IError, IIotDevice, IPaginateQuery, IUpdateIotDevice } from "@visioscientiae/backoffice-packages-domo";
import { GenericPaginatedResponse, GenericResponse } from "./utility/generic-response";

import axios from "./utility/axios-middleware";
import { formatParams } from "./utility/format-params";

const iotEndpoint = 'iot-devices';

export default {
    findPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<IIotDevice[]>> => {
        let result = new GenericPaginatedResponse<IIotDevice[]>();
        try {
            const response = await axios.get (iotEndpoint, { params: {...paginateParameters} });
            result.data = response.data.data as IIotDevice[];
            result.meta = response.data.meta;
        } catch (err: any) {
            console.log(err);
            result.err = err.response.data as IError;
        }
        return result;
    },

    create: async (device: ICreateIotDevice): Promise<GenericResponse<IIotDevice>> => {
        let result = new GenericResponse<IIotDevice>();
        try {
            const response = await axios.post (iotEndpoint, device);
            result.data = response.data as IIotDevice;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    update: async (deviceId: string, device: IUpdateIotDevice): Promise<GenericResponse<IIotDevice>> => {
        let result = new GenericResponse<IIotDevice>();
        try {
            const response = await axios.patch (`${iotEndpoint}/${deviceId}`, device);
            result.data = response.data as IIotDevice;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    delete: async (deviceId: string): Promise<GenericResponse<IIotDevice>> => {
        let result = new GenericResponse<IIotDevice>();
        try {
            const response = await axios.delete (`${iotEndpoint}/${deviceId}`);
            result.data = response.data as IIotDevice;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    }
}