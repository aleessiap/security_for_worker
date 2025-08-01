import sensor from '@/apis/sensor'
import { GenericPaginatedResponse } from '@/apis/utility/generic-response'
import { paginationUtils } from '@/utility/Pagination'
import { ICreateSensor, IPaginateMeta, IPaginateQuery, IPersonalProtectiveEquipment, ISensor, IUpdatePersonalProtectiveEquipment, IUpdateSensor } from '@visioscientiae/backoffice-packages-domo'
import { defineStore } from 'pinia'

export const useSensorStore = defineStore('sensor', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedSensors: {} as GenericPaginatedResponse<ISensor[]>,
            currentSelectedSensor: {} as ISensor,
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        getCurrentPage: (state) => { return paginationUtils(state.paginatedSensors.meta as IPaginateMeta).getCurrentPage() },
        getItemsPerPage: (state) => { return paginationUtils(state.paginatedSensors.meta as IPaginateMeta).getItemsPerPage() },
        getTotalItems: (state) => { return paginationUtils(state.paginatedSensors.meta as IPaginateMeta).getTotalItems() },
		getSortByField: (state) => { return paginationUtils(state.paginatedSensors.meta as IPaginateMeta).getSortByField() },
        getSortByOrder: (state) => { return paginationUtils(state.paginatedSensors.meta as IPaginateMeta).getSortByOrder() },
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        clearStore() {
            this.paginatedSensors = {} as GenericPaginatedResponse<ISensor[]>;
            this.currentSelectedSensor = {} as ISensor;
        },

        async findPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<ISensor[]>> {
            const response = await sensor.findPaginated(paginateParameters) as GenericPaginatedResponse<ISensor[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedSensors = response;

            return response;
        },

        async create(ppeToCreate: ICreateSensor): Promise<ISensor> {
            const response = await sensor.create(ppeToCreate);
            if(response.err)
                throw response.err

            return response.data as ISensor;
        },

        async update(sensorId: string, sensorToUpdate: IUpdateSensor): Promise<ISensor> {
            const response = await sensor.update(sensorId, sensorToUpdate);
            if(response.err)
                throw response.err

            return response.data as ISensor;
        },

        async delete(ppeId: string): Promise<ISensor> {
            const response = await sensor.delete(ppeId);
            if(response.err)
                throw response.err

            return response.data as ISensor;
        }
    },
})