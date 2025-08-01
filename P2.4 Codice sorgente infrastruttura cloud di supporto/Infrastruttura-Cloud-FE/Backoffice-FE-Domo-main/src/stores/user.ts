import { GenericPaginatedResponse, GenericResponse } from '@/apis/utility/generic-response'
import { ICreateOperator, ICreateUser, IOperatorWithJobs, IPaginateMeta, IPaginateQuery, IUpdateUser, IUser, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo'
import { defineStore } from 'pinia'

import user from '@/apis/user'
import { paginationUtils } from '@/utility/Pagination'

export const useUserStore = defineStore('user', {
	// ----------------------------------------------------------------
    //								state
    // ----------------------------------------------------------------
    state: () => {
        return {
            paginatedUsers: {} as GenericPaginatedResponse<IUser[]|IOperatorWithJobs[]>,
            currentSelectedUser: {} as IUser,
        }
    },
    // ----------------------------------------------------------------
    //								getters
    // ----------------------------------------------------------------
    getters: {
        getCurrentPage: (state) => { return paginationUtils(state.paginatedUsers.meta as IPaginateMeta).getCurrentPage() },
        getItemsPerPage: (state) => { return paginationUtils(state.paginatedUsers.meta as IPaginateMeta).getItemsPerPage() },
        getTotalItems: (state) => { return paginationUtils(state.paginatedUsers.meta as IPaginateMeta).getTotalItems() },
		getSortByField: (state) => { return paginationUtils(state.paginatedUsers.meta as IPaginateMeta).getSortByField() },
        getSortByOrder: (state) => { return paginationUtils(state.paginatedUsers.meta as IPaginateMeta).getSortByOrder() },
	},
    // ----------------------------------------------------------------
    //								actions
    // ----------------------------------------------------------------
    actions: {
        clearStore() {
            this.paginatedUsers = {} as GenericPaginatedResponse<IUser[]>;
            this.currentSelectedUser = {} as IUser;
        },

        async findPaginated(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IUser[]>> {
            const response = await user.findPaginated(paginateParameters) as GenericPaginatedResponse<IUser[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedUsers = response;

            return response;
        },

        async findPaginatedOperators(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IUser[]>> {
            const response = await user.findPaginatedOperator(paginateParameters) as GenericPaginatedResponse<IUser[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedUsers = response;

            return response;
        },

        async findPaginatedOperatorsWithJobs(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IOperatorWithJobs[]>> {
            const response = await user.findPaginatedOperatorWithJobs(paginateParameters) as GenericPaginatedResponse<IOperatorWithJobs[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedUsers = response;

            return response;
        },

        async findPaginatedFreeOperators(paginateParameters?: IPaginateQuery, addStore: boolean = true): Promise<GenericPaginatedResponse<IUser[]>> {
            const response = await user.findPaginatedFreeOperator(paginateParameters) as GenericPaginatedResponse<IUser[]>;
            if(response.err)
                throw response.err

            if(addStore)
                this.paginatedUsers = response;

            return response;
        },

        async create(userToCreate: ICreateUser): Promise<IUser> {
            const response = await user.create(userToCreate);
            if(response.err)
                throw response.err

            return response.data as IUser;
        },

        async createOperator(operatorToCreate: ICreateOperator): Promise<IUser> {
            const response = await user.createOperator(operatorToCreate);
            if(response.err)
                throw response.err

            return response.data as IUser;
        },

        async update(userId: string, userToUpdate: IUpdateUser): Promise<IUser> {
            const response = await user.update(userId, userToUpdate);
            if(response.err)
                throw response.err

            return response.data as IUser;
        },

        async updateOperator(userId: string, operatorToUpdate: IUpdateUser): Promise<IUser> {
            const response = await user.updateOperator(userId, operatorToUpdate);
            if(response.err)
                throw response.err

            return response.data as IUser;
        },

        async delete(userId: string): Promise<IUser> {
            const response = await user.delete(userId);
            if(response.err)
                throw response.err

            return response.data as IUser;
        },

        async deleteOperator(userId: string): Promise<IUser> {
            const response = await user.deleteOperator(userId);
            if(response.err)
                throw response.err

            return response.data as IUser;
        }
    },
})