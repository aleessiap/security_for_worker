import { GenericPaginatedResponse, GenericResponse } from '@/apis/utility/generic-response'
import { ICreateJob, IJob, IPaginateMeta, IPaginateQuery, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo'
import { defineStore } from 'pinia'
import { paginationUtils } from '@/utility/Pagination'
import job from '@/apis/job'

export const useJobStore = defineStore('job', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedJobs: {} as GenericPaginatedResponse<IJob[]>,
            currentSelectedJob: {} as IJob,
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        getCurrentPage: (state) => { return paginationUtils(state.paginatedJobs.meta as IPaginateMeta).getCurrentPage() },
        getItemsPerPage: (state) => { return paginationUtils(state.paginatedJobs.meta as IPaginateMeta).getItemsPerPage() },
        getTotalItems: (state) => { return paginationUtils(state.paginatedJobs.meta as IPaginateMeta).getTotalItems() },
		getSortByField: (state) => { return paginationUtils(state.paginatedJobs.meta as IPaginateMeta).getSortByField() },
        getSortByOrder: (state) => { return paginationUtils(state.paginatedJobs.meta as IPaginateMeta).getSortByOrder() },
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        clearStore() {
            this.paginatedJobs = {} as GenericPaginatedResponse<IJob[]>;
            this.currentSelectedJob = {} as IJob;
        },

        async create(jobToCreate: ICreateJob): Promise<IJob> {
            const response = await job.create(jobToCreate);
            if(response.err)
                throw response.err

            return response.data as IJob;
        },

        async endJob(jobId: string): Promise<IJob> {
            const response = await job.endJob(jobId);
            if(response.err)
                throw response.err

            return response.data as IJob;
        },

        async delete(jobId: string): Promise<IJob> {
            const response = await job.remove(jobId);
            if(response.err)
                throw response.err

            return response.data as IJob;
        },

        async getMyPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IJob[]>> {
            const response = await job.getMyPaginated(paginateParameters) as GenericPaginatedResponse<IJob[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedJobs = response;

            return response;
        },

        async getPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IJob[]>> {
            const response = await job.getPaginated(paginateParameters) as GenericPaginatedResponse<IJob[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedJobs = response;

            return response;
        },

        async getById(jobId: string): Promise<IJob> {
            const response = await job.getById(jobId) as GenericResponse<IJob>;
            if(response.err)
                throw response.err

            return response.data as IJob;
        },

        async getMyAssignedJob(): Promise<IJob> {
            const response = await job.getMyAssignedJob() as GenericResponse<IJob>;
            if(response.err)
                throw response.err

            return response.data as IJob;
        },

        async confirmDenyAssignedJob(confirm: boolean): Promise<IJob> {
            const response = await job.confirmDenyAssignedJob(confirm) as GenericResponse<IJob>;
            if(response.err)
                throw response.err

            return response.data as IJob;
        }
    },
})