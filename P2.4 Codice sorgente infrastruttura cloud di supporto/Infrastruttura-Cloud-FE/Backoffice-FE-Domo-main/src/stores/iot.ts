import iot from '@/apis/iot'
import { GenericPaginatedResponse } from '@/apis/utility/generic-response'
import { paginationUtils } from '@/utility/Pagination'
import { ICreateIotDevice, IIotDevice, IPaginateMeta, IPaginateQuery, IUpdateIotDevice } from '@visioscientiae/backoffice-packages-domo'
import { defineStore } from 'pinia'

export const useIoTDeviceStore = defineStore('iotDevice', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedIoTDevices: {} as GenericPaginatedResponse<IIotDevice[]>,
            currentSelectedIoTDevice: {} as IIotDevice,
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        getCurrentPage: (state) => { return paginationUtils(state.paginatedIoTDevices.meta as IPaginateMeta).getCurrentPage() },
        getItemsPerPage: (state) => { return paginationUtils(state.paginatedIoTDevices.meta as IPaginateMeta).getItemsPerPage() },
        getTotalItems: (state) => { return paginationUtils(state.paginatedIoTDevices.meta as IPaginateMeta).getTotalItems() },
		getSortByField: (state) => { return paginationUtils(state.paginatedIoTDevices.meta as IPaginateMeta).getSortByField() },
        getSortByOrder: (state) => { return paginationUtils(state.paginatedIoTDevices.meta as IPaginateMeta).getSortByOrder() },
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        clearStore() {
            this.paginatedIoTDevices = {} as GenericPaginatedResponse<IIotDevice[]>;
            this.currentSelectedIoTDevice = {} as IIotDevice;
        },

        async findPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IIotDevice[]>> {
            const response = await iot.findPaginated(paginateParameters) as GenericPaginatedResponse<IIotDevice[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedIoTDevices = response;

            return response;
        },

        async create(deviceToCreate: ICreateIotDevice): Promise<IIotDevice> {
            const response = await iot.create(deviceToCreate);
            if(response.err)
                throw response.err

            return response.data as IIotDevice;
        },

        async update(deviceId: string, deviceToUpdate: IUpdateIotDevice): Promise<IIotDevice> {
            const response = await iot.update(deviceId, deviceToUpdate);
            if(response.err)
                throw response.err

            return response.data as IIotDevice;
        },

        async delete(deviceId: string): Promise<IIotDevice> {
            const response = await iot.delete(deviceId);
            if(response.err)
                throw response.err

            return response.data as IIotDevice;
        }
    },
})