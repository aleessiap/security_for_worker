<template>
    <div class="card p-1">
        <DataTable
            lazy
            stripedRows 
            :value="userStore.paginatedUsers.data"
            :loading="loadingTable"
            v-model:filters="filters"
            :paginator="true"
            :rows="userStore.getItemsPerPage"
            :totalRecords="userStore.getTotalItems"
            :rowsPerPageOptions="[10, 25, 100]"
            :currentPageReportTemplate="$t('general.paginationReportTemplate', {first: '{first}', last: '{last}', totalRecords: '{totalRecords}'})"
            :sortField="userStore.getSortByField"
            :sortOrder="convertSortOrderToInt(userStore.getSortByOrder as string)"
            :globalFilterFields="['role']"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            tableStyle="min-width: 50rem"
            class="p-datatable-custom"
            filterDisplay="menu" 
            @page="onPage($event)"
            @sort="onSort($event)"
            @filter="onFilter($event)">
             
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <div class="flex align-items-center justify-content-center">
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-users text-primary text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('user.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-1">
                        <Button :label="$t('user.add')" icon="pi pi-plus" class="mr-2 mt-2 md:mt-0" severity="success" @click="addModal = true" />
                        <IconField iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('user.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="email" :header="$t('user.table.email')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.email, filters['global'].value)"></span>
                </template>
            </Column>
            
            <Column field="role" :header="$t('user.table.role')" :showFilterMatchModes="false">
                <template #body="slotProps">
                    <Chip :label="$t(`user.role.${slotProps.data.role}`)" :image="'images/icons/User/' + getUserRoleEnum(slotProps.data.role)" />
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Object.values(UserRoleEnum).filter(role => {if(role !== UserRoleEnum.OPERATOR) return role;})" :placeholder="$t('user.table.filterByRole')" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #value="slotProps">
                            <div class="flex align-items-center">
                                <span v-if="slotProps.value && slotProps.value.length > 0" v-for="(value, index) in slotProps.value">
                                    <Chip v-if="index < 4" class="mx-1" :label="$t(`user.role.${value}`)" :image="'images/icons/User/' + getUserRoleEnum(value)" />
                                    <Chip v-else-if="index < 5" class="mx-1" :label="'+' + (slotProps.value.length - 4)" />
                                </span>
                                <span v-else>{{ $t('user.table.filterByRole') }}</span>
                            </div>
                        </template>
                        
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <Chip :label="$t(`user.role.${slotProps.option}`)" :image="'images/icons/User/' + getUserRoleEnum(slotProps.option)" />
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column field="name" :header="$t('user.table.name')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.name, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="surname" :header="$t('user.table.surname')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.surname, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="createdAt" :header="$t('user.table.createdAt')" sortable>
                <template #body="slotProps">
                    {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
                </template>
            </Column>

            <Column headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('user.table.actions') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button icon="pi pi-pencil" severity="secondary" rounded @click="callEditModal(slotProps.data)" />
                        <Button v-if="authStore.user.id !== slotProps.data.id" icon="pi pi-trash" severity="danger" rounded @click="callDeleteModal(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <UserFormModal v-model:showModal="addModal" @refreshData="refreshData = true"/>
        <UserFormModal v-model:showModal="editModal" :editMode="true" :oldData="userStore.currentSelectedUser" @refreshData="refreshData = true"/>

        <DeleteModal v-model:showModal="deleteModal" :loading="loadingModal" :modalTitle="$t('user.delete')" :valueToDelete="userStore.currentSelectedUser.email" @delete="deleteUser" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ErrorTitles, IPaginateQuery, IUser, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { searchedText } from '@/utility/Table';

import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

import UserFormModal from '@/components/forms/UserFormModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import { getUserRoleEnum } from '@/utility/Severity';

export default defineComponent({
    name: 'Users',
    components: {
        UserFormModal,
        DeleteModal,
    },
    data() {
        return {
            refreshData: false,

            userStore: useUserStore(),
            authStore: useAuthStore(),

            addModal: false,
            editModal: false,
            deleteModal: false,

            loadingTable: false,
            loadingModal: false,

            page: 1,
            limit: 10,

            timer: 0 as any,
            filters: {
                global: {value: ''},
                role: {value: [] as string[]},
            },

            UserRoleEnum,
            convertSortOrderToInt,
            searchedText,
            getUserRoleEnum
        };
    },
    async mounted() {
        await this.fetchUsers({
            page: this.page, 
            limit: this.limit,
            'filter.role': `$not:${UserRoleEnum.OPERATOR}`
        } as IPaginateQuery);
    },
    methods: {
        callDeleteModal(user: IUser) {
            this.deleteModal = true;
            this.userStore.currentSelectedUser = user;
        },
        callEditModal(user: IUser) {
            this.editModal = true;
            this.userStore.currentSelectedUser = user;
        },
        async fetchUsers(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.userStore.findPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('user.toast.fetchFailure'), this.$toast);      
            }

            this.loadingTable = false;
        },
        async onPage(event: any) {

            this.page = event.page + 1;
            this.limit = event.rows;
            
            await this.fetchUsers({
                page: this.page, 
                limit: this.limit, 
                sortBy: `${this.userStore.getSortByField}:${this.userStore.getSortByOrder}`,
                searchBy: ['email', 'name', 'surname'],
                search: this.filters.global.value,
                'filter.role': (this.filters.role.value && this.filters.role.value.length > 0) ? `$in:${this.filters.role.value.join()}` : `$not:${UserRoleEnum.OPERATOR}`
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchUsers({
                page: 1, 
                limit: this.userStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`,
                searchBy: ['email', 'name', 'surname'],
                search: this.filters.global.value,
                'filter.role': (this.filters.role.value && this.filters.role.value.length > 0) ? `$in:${this.filters.role.value.join()}` : `$not:${UserRoleEnum.OPERATOR}`
            } as IPaginateQuery);
        },
        async onGlobalFilter(value: string) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingTable = true;

                await this.fetchUsers({
                    page: 1, 
                    limit: this.userStore.getItemsPerPage, 
                    sortBy: `${this.userStore.getSortByField}:${this.userStore.getSortByOrder}`,
                    searchBy: ['email', 'name', 'surname'],
                    search: value,
                    'filter.role': (this.filters.role.value && this.filters.role.value.length > 0) ? `$in:${this.filters.role.value.join()}` : `$not:${UserRoleEnum.OPERATOR}`
                } as IPaginateQuery);

                this.loadingTable = false;
            }, 500);
        },
        async onFilter(event: any) {
            await this.fetchUsers({
                page: 1, 
                limit: this.userStore.getItemsPerPage, 
                sortBy: `${this.userStore.getSortByField}:${this.userStore.getSortByOrder}`,
                searchBy: ['email', 'name', 'surname'],
                search: event.filters.global.value,
                'filter.role': (this.filters.role.value && this.filters.role.value.length > 0) ? `$in:${this.filters.role.value.join()}` : `$not:${UserRoleEnum.OPERATOR}`
            } as IPaginateQuery);
        },
        async deleteUser() {
            this.loadingModal = true; 

            try {
                await this.userStore.delete(this.userStore.currentSelectedUser.id);

                this.deleteModal = false;
                this.$toast.add({severity: 'success', summary: this.$t('user.toast.deleteSuccess'), life: 3000 });
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('user.toast.deleteFailure'), err.detail, this.$toast);
                else
                    HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);      
            }

            this.loadingModal = false;
            this.refreshData = true;
        },
    },
    watch: {
        deleteModal(value) {
            if (!value)
                this.userStore.currentSelectedUser = {} as IUser;
        },
        editModal(value) {
            if (!value)
                this.userStore.currentSelectedUser = {} as IUser;
        },
        'filters.global.value'(value) {
            this.onGlobalFilter(value);
        },
        async refreshData(value) {
            if (value) {
                await this.fetchUsers({
                    page: this.userStore.getCurrentPage, 
                    limit: this.userStore.getItemsPerPage, 
                    sortBy: `${this.userStore.getSortByField}:${this.userStore.getSortByOrder}`,
                    searchBy: ['email', 'name', 'surname'],
                    search: this.filters.global.value,
                    'filter.role': (this.filters.role.value && this.filters.role.value.length > 0) ? `$in:${this.filters.role.value.join()}` : `$not:${UserRoleEnum.OPERATOR}`
                } as IPaginateQuery);
                this.refreshData = false;
            }
        }
    }
});
</script>

<style>
.p-datatable-custom .p-datatable-tbody > tr:hover {
    background-color: #FFFBEB;
}

.p-datatable-loading-overlay {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>