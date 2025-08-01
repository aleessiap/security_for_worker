import { GenericPaginatedResponse, GenericResponse } from '@/apis/utility/generic-response'
import { ICreatePersonalProtectiveEquipment, IPaginateMeta, IPaginateQuery, IPersonalProtectiveEquipment, IUpdatePersonalProtectiveEquipment } from '@visioscientiae/backoffice-packages-domo'
import { defineStore } from 'pinia'

import ppe from '@/apis/ppe'
import { paginationUtils } from '@/utility/Pagination'

export const usePersonalProtectiveEquipmentStore = defineStore('personalProtectiveEquipment', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedPPEs: {} as GenericPaginatedResponse<IPersonalProtectiveEquipment[]>,
            currentSelectedPPE: {} as IPersonalProtectiveEquipment,
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        getCurrentPage: (state) => { return paginationUtils(state.paginatedPPEs.meta as IPaginateMeta).getCurrentPage() },
        getItemsPerPage: (state) => { return paginationUtils(state.paginatedPPEs.meta as IPaginateMeta).getItemsPerPage() },
        getTotalItems: (state) => { return paginationUtils(state.paginatedPPEs.meta as IPaginateMeta).getTotalItems() },
		getSortByField: (state) => { return paginationUtils(state.paginatedPPEs.meta as IPaginateMeta).getSortByField() },
        getSortByOrder: (state) => { return paginationUtils(state.paginatedPPEs.meta as IPaginateMeta).getSortByOrder() },
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        clearStore() {
            this.paginatedPPEs = {} as GenericPaginatedResponse<IPersonalProtectiveEquipment[]>;
            this.currentSelectedPPE = {} as IPersonalProtectiveEquipment;
        },

        async findPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IPersonalProtectiveEquipment[]>> {
            const response = await ppe.findPaginated(paginateParameters) as GenericPaginatedResponse<IPersonalProtectiveEquipment[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedPPEs = response;

            return response;
        },

        async findRelatedByMe(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IPersonalProtectiveEquipment[]>> {
            const response = await ppe.findRelatedByMe(paginateParameters) as GenericPaginatedResponse<IPersonalProtectiveEquipment[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedPPEs = response;

            return response;
        },

        async create(ppeToCreate: ICreatePersonalProtectiveEquipment): Promise<IPersonalProtectiveEquipment> {
            const response = await ppe.create(ppeToCreate);
            if(response.err)
                throw response.err

            return response.data as IPersonalProtectiveEquipment;
        },

        async update(ppeId: string, ppeToUpdate: IUpdatePersonalProtectiveEquipment): Promise<IPersonalProtectiveEquipment> {
            const response = await ppe.update(ppeId, ppeToUpdate);
            if(response.err)
                throw response.err

            return response.data as IPersonalProtectiveEquipment;
        },

        async delete(ppeId: string): Promise<IPersonalProtectiveEquipment> {
            const response = await ppe.delete(ppeId);
            if(response.err)
                throw response.err

            return response.data as IPersonalProtectiveEquipment;
        }
    },
})