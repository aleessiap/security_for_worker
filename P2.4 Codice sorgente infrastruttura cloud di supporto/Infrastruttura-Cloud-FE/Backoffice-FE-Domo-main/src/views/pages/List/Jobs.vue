<template>
    <div class="card p-1">
        <DataTable
            lazy
            stripedRows 
            :value="jobStore.paginatedJobs.data"
            :loading="loadingTable" 
            v-model:filters="filters"
            :paginator="true"
            :rows="jobStore.getItemsPerPage"
            :totalRecords="jobStore.getTotalItems"
            :rowsPerPageOptions="[10, 25, 100]"
            :currentPageReportTemplate="$t('general.paginationReportTemplate', {first: '{first}', last: '{last}', totalRecords: '{totalRecords}'})"
            :sortField="jobStore.getSortByField"
            :sortOrder="convertSortOrderToInt(jobStore.getSortByOrder as string)"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            tableStyle="min-width: 50rem"
            class="p-datatable-custom"
            @page="onPage($event)"
            @sort="onSort($event)">
             
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <div class="flex align-items-center justify-content-center">
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-briefcase text-primary text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('job.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-1">
                        <IconField iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('job.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>


            <Column field="closed" :header="$t('job.table.status')" style="width: 20px;">
                <template #body="slotProps">
                    <div class="flex justify-content-center">
                        <i v-if="slotProps.data.aborted" class="pi pi-times text-red-500 text-xl"></i>
                        <i v-else-if="slotProps.data.endDate" class="pi pi-lock text-black-500 text-xl"></i>
                        <i v-else class="pi pi-lock-open text-green-500 text-xl"></i>
                    </div>
                </template>
            </Column>

            <Column field="startDate" :header="$t('job.table.startDate')" sortable>
                <template #body="slotProps">
                    {{ new Date(slotProps.data.startDate).toLocaleString() }}
                </template>
            </Column>

            <Column field="endDate" :header="$t('job.table.endDate')" sortable>
                <template #body="slotProps">
                    <div v-if="slotProps.data.endDate">
                        {{ new Date(slotProps.data.endDate).toLocaleString() }}
                    </div>
                    <div v-else></div>
                </template>
            </Column>
            
            <Column field="name" :header="$t('job.table.jobName')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.name, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="environmentName" :header="$t('job.table.environmentName')">
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.environmentName, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="environmentType" :header="$t('job.table.environmentType')">
                <template #body="slotProps">
                    <Chip :label="$t(`environment.type.${slotProps.data.environmentType}`)" :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.data.environmentType)" />
                </template>
            </Column>
            
            <Column field="operatorsList" :header="$t('job.table.operators')">
                <template #body="slotProps">
                    <Button :label="$t('job.table.showOperators')" icon="pi pi-user" severity="info" rounded @click="showOperatorsModal(slotProps.data.operatorsList)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <OperatorsListModal v-model:showModal="showOperators" :operatorsList="selectedJobOperators"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ErrorTitles, IJobOperator, IPaginateQuery, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';

import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';
import { searchedText } from '@/utility/Table';
import { useJobStore } from '@/stores/job';
import { getEnvironmentTypeIcon } from '@/utility/Severity';

import OperatorsListModal from '@/components/OperatorsListModal.vue';

export default defineComponent({
    name: 'Jobs',
    components: {
        OperatorsListModal
    },
    data() {
        return {
            refreshData: false,

            jobStore: useJobStore(),

            loadingTable: false,

            showOperators: false,
            selectedJobOperators: [] as IJobOperator[],

            page: 1,
            limit: 10,

            timer: 0 as any,
            filters: {
                global: {value: ''}
            },

            convertSortOrderToInt,
            searchedText,
            UserRoleEnum,

            getEnvironmentTypeIcon
        };
    },
    async mounted() {
        await this.fetchJobs({page: this.page, limit: this.limit} as IPaginateQuery);
    },
    methods: {
        showOperatorsModal(jobOperators: IJobOperator[]) {
            this.showOperators = true;
            this.selectedJobOperators = jobOperators;
        },
        async fetchJobs(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.jobStore.getPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('job.toast.fetchFailure'), this.$toast);      
            }

            this.loadingTable = false;
        },
        async onPage(event: any) {
            this.page = event.page + 1;
            this.limit = event.rows;
            
            await this.fetchJobs({
                page: this.page, 
                limit: this.limit, 
                sortBy: `${this.jobStore.getSortByField}:${this.jobStore.getSortByOrder}`,
                searchBy: ['name'],
                search: this.filters.global.value
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchJobs({
                page: 1, 
                limit: this.jobStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`,
                searchBy: ['name'],
                search: this.filters.global.value
            } as IPaginateQuery);
        },
        async onGlobalFilter(value: string) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingTable = true;

                await this.fetchJobs({
                    page: 1, 
                    limit: this.jobStore.getItemsPerPage, 
                    sortBy: `${this.jobStore.getSortByField}:${this.jobStore.getSortByOrder}`,
                    searchBy: ['name'],
                    search: value
                } as IPaginateQuery);
            }, 500);
        },
    },
    watch: {
        'filters.global.value'(value) {
            this.onGlobalFilter(value);
        },
        async refreshData(value) {
            if (value) {
                this.refreshData = false;
                await this.fetchJobs({
                    page: this.jobStore.getCurrentPage, 
                    limit: this.jobStore.getItemsPerPage, 
                    sortBy: `${this.jobStore.getSortByField}:${this.jobStore.getSortByOrder}`,
                    searchBy: ['name'],
                    search: this.filters.global.value
                } as IPaginateQuery);
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