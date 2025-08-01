import { ICreateSensor, IError, IPaginateQuery, ISensor, IUpdateSensor } from "@visioscientiae/backoffice-packages-domo";
import { GenericPaginatedResponse, GenericResponse } from "./utility/generic-response";

import axios from "./utility/axios-middleware";
import { formatParams } from "./utility/format-params";

const sensorEndpoint = 'sensors';

export default {
    findPaginated: async (paginateParameters?: IPaginateQuery): Promise<GenericPaginatedResponse<ISensor[]>> => {
        let result = new GenericPaginatedResponse<ISensor[]>();
        try {
            const response = await axios.get (sensorEndpoint, { params: {...paginateParameters} });
            result.data = response.data.data as ISensor[];
            result.meta = response.data.meta;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    create: async (sensor: ICreateSensor): Promise<GenericResponse<ISensor>> => {
        let result = new GenericResponse<ISensor>();
        try {
            const response = await axios.post (sensorEndpoint, sensor);
            result.data = response.data as ISensor;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    update: async (sensorId: string, sensor: IUpdateSensor): Promise<GenericResponse<ISensor>> => {
        let result = new GenericResponse<ISensor>();
        try {
            const response = await axios.patch (`${sensorEndpoint}/${sensorId}`, sensor);
            result.data = response.data as ISensor;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    },

    delete: async (sensorId: string): Promise<GenericResponse<ISensor>> => {
        let result = new GenericResponse<ISensor>();
        try {
            const response = await axios.delete (`${sensorEndpoint}/${sensorId}`);
            result.data = response.data as ISensor;
        } catch (err: any) {
            result.err = err.response.data as IError;
        }
        return result;
    }
}