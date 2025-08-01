import environment from '@/apis/environment'
import { GenericPaginatedResponse } from '@/apis/utility/generic-response'
import { paginationUtils } from '@/utility/Pagination'
import {IPaginateMeta, IPaginateQuery } from '@visioscientiae/backoffice-packages-domo'
import { ICreateEnvironment, IEnvironment, IUpdateEnvironment } from '@visioscientiae/backoffice-packages-domo/lib/esm/environment.interface'
import { defineStore } from 'pinia'

export const useEnvironmentStore = defineStore('environment', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedEnvironments: {} as GenericPaginatedResponse<IEnvironment[]>,
            currentSelectedEnvironment: {} as IEnvironment,
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        getCurrentPage: (state) => { return paginationUtils(state.paginatedEnvironments.meta as IPaginateMeta).getCurrentPage() },
        getItemsPerPage: (state) => { return paginationUtils(state.paginatedEnvironments.meta as IPaginateMeta).getItemsPerPage() },
        getTotalItems: (state) => { return paginationUtils(state.paginatedEnvironments.meta as IPaginateMeta).getTotalItems() },
		getSortByField: (state) => { return paginationUtils(state.paginatedEnvironments.meta as IPaginateMeta).getSortByField() },
        getSortByOrder: (state) => { return paginationUtils(state.paginatedEnvironments.meta as IPaginateMeta).getSortByOrder() },
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        clearStore() {
            this.paginatedEnvironments = {} as GenericPaginatedResponse<IEnvironment[]>;
            this.currentSelectedEnvironment = {} as IEnvironment;
        },

        async findPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IEnvironment[]>> {
            const response = await environment.findPaginated(paginateParameters) as GenericPaginatedResponse<IEnvironment[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedEnvironments = response;

            return response;
        },

        async create(enviromentToCreate: ICreateEnvironment): Promise<IEnvironment> {
            const response = await environment.create(enviromentToCreate);
            if(response.err)
                throw response.err

            return response.data as IEnvironment;
        },

        async update(enviromentId: string, enviromentToUpdate: IUpdateEnvironment): Promise<IEnvironment> {
            const response = await environment.update(enviromentId, enviromentToUpdate);
            if(response.err)
                throw response.err

            return response.data as IEnvironment;
        },

        async delete(enviromentId: string): Promise<IEnvironment> {
            const response = await environment.delete(enviromentId);
            if(response.err)
                throw response.err

            return response.data as IEnvironment;
        }
    },
})