import event from '@/apis/event'
import { GenericPaginatedResponse, GenericResponse } from '@/apis/utility/generic-response'
import { paginationUtils } from '@/utility/Pagination'
import {IEnvironmentEvent, IPaginateMeta, IPaginateQuery } from '@visioscientiae/backoffice-packages-domo'
import { defineStore } from 'pinia'

export const useEnvironmentEventStore = defineStore('environmentEvent', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedEvents: {} as GenericPaginatedResponse<IEnvironmentEvent[]>,
            currentSelectedEvent: {} as IEnvironmentEvent,
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
            this.paginatedEvents = {} as GenericPaginatedResponse<IEnvironmentEvent[]>;
            this.currentSelectedEvent = {} as IEnvironmentEvent;
        },

        async findPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IEnvironmentEvent[]>> {
            const response = await event.environmentFindPaginated(paginateParameters) as GenericPaginatedResponse<IEnvironmentEvent[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedEvents = response;

            return response;
        },

        async findMyPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IEnvironmentEvent[]>> {
            const response = await event.environmentFindMyPaginated(paginateParameters) as GenericPaginatedResponse<IEnvironmentEvent[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedEvents = response;

            return response;
        },

        async findOne(id: string): Promise<IEnvironmentEvent> {
            const response = await event.environmentFindOne(id) as GenericResponse<IEnvironmentEvent>;
            if(response.err)
                throw response.err

            this.currentSelectedEvent = response.data as IEnvironmentEvent;

            return response.data as IEnvironmentEvent;
        }
    },
})