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
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            tableStyle="min-width: 50rem"
            class="p-datatable-custom"
            @page="onPage($event)"
            @sort="onSort($event)">
            
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <div class="flex align-items-center justify-content-center">
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-user text-primary text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('operator.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-1">
                        <Button :label="$t('operator.add')" icon="pi pi-plus" class="mr-2 mt-2 md:mt-0" severity="success" @click="addModal = true" />
                        <IconField iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('operator.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="name" :header="$t('operator.table.name')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.name, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="surname" :header="$t('operator.table.surname')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.surname, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="email" :header="$t('operator.table.email')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.email, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="createdAt" :header="$t('operator.table.createdAt')" sortable>
                <template #body="slotProps">
                    {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
                </template>
            </Column>

            <Column field="assignedJob" :header="$t('operator.table.assignedJob')">
                <template #body="slotProps">
                    <div v-if="slotProps.data.currentJob" class="flex align-items-center gap-2">
                        <Chip>
                            <i class="pi pi-briefcase mr-2" style="font-size: 1rem"></i>
                            {{ slotProps.data.currentJob?.name }}
                        </Chip>
                        <Chip>
                            <i class="pi pi-calendar mr-2" style="font-size: 1rem"></i>
                            {{ new Date(slotProps.data.currentJob?.startDate).toLocaleString() }}
                        </Chip>
                    </div>
                </template>
            </Column>

            <Column headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('operator.table.actions') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button v-if="slotProps.data.currentJob" icon="pi pi-briefcase" severity="info" rounded @click="showJobModal(slotProps.data.currentJob)"/>
                        <Button icon="pi pi-pencil" severity="secondary" rounded @click="callEditModal(slotProps.data)" />
                        <Button icon="pi pi-trash" severity="danger" rounded @click="callDeleteModal(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <UserFormModal v-model:showModal="addModal" v-model:editMode="editModal" :oldData="userStore.currentSelectedUser" @refreshData="refreshData = true" :operatorMode="true" />
        <DeleteModal v-model:showModal="deleteModal" :loading="loadingModal" :modalTitle="$t('operator.delete')" :valueToDelete="userStore.currentSelectedUser.email" @delete="deleteUser" />
        <JobInfoModal v-model:showModal="showJob" :jobInfo="selectedJob" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ErrorTitles, IJob, IJobOperator, IPaginateQuery, IUser } from '@visioscientiae/backoffice-packages-domo';
import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { searchedText } from '@/utility/Table';

import { useUserStore } from '@/stores/user';

import UserFormModal from '@/components/forms/UserFormModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';

import JobInfoModal from '@/components/JobInfoModal.vue';

export default defineComponent({
    name: 'Operators',
    components: {
        UserFormModal,
        DeleteModal,
        JobInfoModal
    },
    data() {
        return {
            refreshData: false,

            userStore: useUserStore(),

            addModal: false,
            editModal: false,
            deleteModal: false,

            loadingTable: false,
            loadingModal: false,

            showJob: false,
            selectedJob: {} as IJob,

            page: 1,
            limit: 10,
            
            timer: 0 as any,
            filters: {
                global: {value: ''}
            },
            
            convertSortOrderToInt,
            searchedText,
        };
    },
    async mounted() {
        await this.fetchOperators({page: this.page, limit: this.limit} as IPaginateQuery);
    },
    methods: {
        callDeleteModal(user: IUser) {
            this.deleteModal = true;
            this.userStore.currentSelectedUser = user;
        },
        callEditModal(user: IUser) {
            this.addModal = true;
            this.editModal = true;
            this.userStore.currentSelectedUser = user;
        },
        showJobModal(job: IJob) {
            this.showJob = true;
            this.selectedJob = job;
        },
        async fetchOperators(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.userStore.findPaginatedOperatorsWithJobs(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('operator.toast.fetchFailure'), this.$toast);      
            }

            this.loadingTable = false;
        },
        async onPage(event: any) {
            this.page = event.page + 1;
            this.limit = event.rows;
            
            await this.fetchOperators({
                page: this.page, 
                limit: this.limit, 
                sortBy: `${this.userStore.getSortByField}:${this.userStore.getSortByOrder}`,
                searchBy: ['email', 'name', 'surname'],
                search: this.filters.global.value
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchOperators({
                page: 1, 
                limit: this.userStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`,
                searchBy: ['email', 'name', 'surname'],
                search: this.filters.global.value
            } as IPaginateQuery);
        },
        async onGlobalFilter(value: string) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingTable = true;

                await this.fetchOperators({
                    page: 1, 
                    limit: this.userStore.getItemsPerPage, 
                    sortBy: `${this.userStore.getSortByField}:${this.userStore.getSortByOrder}`,
                    searchBy: ['email', 'name', 'surname'],
                    search: value
                } as IPaginateQuery);

                this.loadingTable = false;
            }, 500);
        },
        async deleteUser() {
            this.loadingModal = true; 

            try {
                await this.userStore.deleteOperator(this.userStore.currentSelectedUser.id);

                this.deleteModal = false;
                this.$toast.add({severity: 'success', summary: this.$t('operator.toast.deleteSuccess'), life: 3000 });
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('operator.toast.fetchFailure'), err.detail, this.$toast);
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
        'filters.global.value' (value) {
            this.onGlobalFilter(value);
        },
        async refreshData(value) {
            if (value) {
                await this.fetchOperators({
                    page: this.userStore.getCurrentPage, 
                    limit: this.userStore.getItemsPerPage, 
                    sortBy: `${this.userStore.getSortByField}:${this.userStore.getSortByOrder}`,
                    searchBy: ['email', 'name', 'surname'],
                    search: this.filters.global.value
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