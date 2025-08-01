import event from '@/apis/event'
import { GenericPaginatedResponse, GenericResponse } from '@/apis/utility/generic-response'
import { paginationUtils } from '@/utility/Pagination'
import {IOperatorEvent, IPaginateMeta, IPaginateQuery } from '@visioscientiae/backoffice-packages-domo'
import { defineStore } from 'pinia'

export const useOperatorEventStore = defineStore('operatorEvent', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedEvents: {} as GenericPaginatedResponse<IOperatorEvent[]>,
            currentSelectedEvent: {} as IOperatorEvent,
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        getCurrentPage: (state) => { return paginationUtils(state.paginatedEvents.meta as IPaginateMeta).getCurrentPage() },
        getItemsPerPage: (state) => { return paginationUtils(state.paginatedEvents.meta as IPaginateMeta).getItemsPerPage() },
        getTotalItems: (state) => { return paginationUtils(state.paginatedEvents.meta as IPaginateMeta).getTotalItems() },
		getSortByField: (state) => { return paginationUtils(state.paginatedEvents.meta as IPaginateMeta).getSortByField() },
        getSortByOrder: (state) => { return paginationUtils(state.paginatedEvents.meta as IPaginateMeta).getSortByOrder() },
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        clearStore() {
            this.paginatedEvents = {} as GenericPaginatedResponse<IOperatorEvent[]>;
            this.currentSelectedEvent = {} as IOperatorEvent;
        },

        async findPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IOperatorEvent[]>> {
            const response = await event.operatorFindPaginated(paginateParameters) as GenericPaginatedResponse<IOperatorEvent[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedEvents = response;

            return response;
        },

        async findMyPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IOperatorEvent[]>> {
            const response = await event.operatorFindMyPaginated(paginateParameters) as GenericPaginatedResponse<IOperatorEvent[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedEvents = response;

            return response;
        },

        async findOne(id: string): Promise<IOperatorEvent> {
            const response = await event.operatorFindOne(id) as GenericResponse<IOperatorEvent>;
            if(response.err)
                throw response.err

            this.currentSelectedEvent = response.data as IOperatorEvent;

            return response.data as IOperatorEvent;
        }
    },
})