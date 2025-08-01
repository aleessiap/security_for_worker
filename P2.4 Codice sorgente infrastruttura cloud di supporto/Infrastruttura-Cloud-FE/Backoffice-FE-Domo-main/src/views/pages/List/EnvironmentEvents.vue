<template>
    <div class="card p-1">
        <DataTable
            lazy
            stripedRows
            :value="eventStore.paginatedEvents.data"
            :loading="loadingTable"
            v-model:filters="filters"
            :paginator="true"
            :rows="eventStore.getItemsPerPage"
            :totalRecords="eventStore.getTotalItems"
            :rowsPerPageOptions="simpleMode ? [10] : [10, 25, 100]"
            :currentPageReportTemplate="$t('general.paginationReportTemplate', {first: '{first}', last: '{last}', totalRecords: '{totalRecords}'})"
            :sortField="eventStore.getSortByField"
            :sortOrder="convertSortOrderToInt(eventStore.getSortByOrder as string)"
            :globalFilterFields="['environmentType', 'eventType', 'emittedBy.name']"
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
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-truck text-blue-500 text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('event.environment.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-3">
                        <Button icon="pi pi-refresh" @click="refreshData = true" severity="secondary" />
                        <Button v-if="simpleMode" icon="pi pi-external-link" @click="$router.push({ name: 'environmentEvents' })" severity="info" />
                        <IconField v-if="!simpleMode" iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('event.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="environmentName" :header="$t('event.environment.table.name')" :sortable="!simpleMode">
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.environmentName, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="timestamp" :header="$t('event.environment.table.timestamp')" :sortable="!simpleMode">
                <template #body="slotProps">
                    <span>{{ new Date(slotProps.data.timestamp).toLocaleString() }}</span>
                </template>
            </Column>

            <Column field="environmentType" :header="$t('event.environment.table.environmentType')" :showFilterMatchModes="false">
                <template #body="slotProps">
                    <Chip :label="$t(`environment.type.${slotProps.data.environmentType}`)" :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.data.environmentType)" />
                </template>
                <template v-if="!simpleMode" #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Object.values(EnvironmentTypeEnum)" :placeholder="$t('event.environment.table.filterByEnvironments')" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #value="slotProps">
                            <div class="flex align-items-center">
                                <span v-if="slotProps.value && slotProps.value.length > 0" v-for="(value, index) in slotProps.value">
                                    <Chip v-if="index < 4" class="mx-1" :label="$t(`environment.type.${value}`)" :image="'images/icons/Environment/' + getEnvironmentTypeIcon(value)" />
                                    <Chip v-else-if="index < 5" class="mx-1" :label="'+' + (slotProps.value.length - 4)" />
                                </span>
                                <span v-else>{{ $t('event.environment.table.filterByEnvironments') }}</span>
                            </div>
                        </template>
                        
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <Chip :label="$t(`environment.type.${slotProps.option}`)" :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.option)" />
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column field="eventType" :header="$t('event.environment.table.eventType')" :showFilterMatchModes="false">
                <template #body="slotProps">
                    <Chip :label="$t(`event.eventType.${slotProps.data.eventType}`)" :image="'images/icons/Event/' + getEventTypeIcon(slotProps.data.eventType)" />
                </template>
                <template v-if="!simpleMode" #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Object.values(EventTypeEnum)" :placeholder="$t('event.environment.table.filterByEvents')" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #value="slotProps">
                            <div class="flex align-items-center">
                                <span v-if="slotProps.value && slotProps.value.length > 0" v-for="(value, index) in slotProps.value">
                                    <Chip v-if="index < 4" class="mx-1" :label="$t(`event.eventType.${value}`)" :image="'images/icons/Event/' + getEventTypeIcon(value)" />
                                    <Chip v-else-if="index < 5" class="mx-1" :label="'+' + (slotProps.value.length - 4)" />
                                </span>
                                <span v-else>{{ $t('event.environment.table.filterByEvents') }}</span>
                            </div>
                        </template>
                        
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <Chip :label="$t(`event.eventType.${slotProps.option}`)" :image="'images/icons/Event/' + getEventTypeIcon(slotProps.option)" />
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column v-if="!simpleMode" headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('event.operator.table.relatedJobs') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button v-if="slotProps.data.jobs" :label="$t('job.table.showOperators')" icon="pi pi-briefcase" severity="info" rounded @click="showJobModal(slotProps.data.jobs)"/>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

    <MultipleJobsInfoModal v-model:showModal="showJob" :jobsInfo="selectedJobs" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { EnvironmentTypeEnum, ErrorTitles, EventTypeEnum, IEnvironmentEvent, IJob, IPaginateQuery, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';

import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';

import { searchedText } from '@/utility/Table';
import { getEnvironmentTypeIcon, getEventTypeIcon, getPPETypeIcon } from '@/utility/Severity';
import { useEnvironmentEventStore } from '@/stores/environmentEvent';

import MultipleJobsInfoModal from '@/components/MultipleJobsInfoModal.vue';

export default defineComponent({
    name: 'EnvironmentEvents',
    components: {
        MultipleJobsInfoModal
    },
    props: {
        simpleMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            refreshData: false,

            eventStore: useEnvironmentEventStore(),

            addModal: false,
            editModal: false,
            deleteModal: false,

            loadingTable: false,
            loadingModal: false,

            showJob: false,
            selectedJobs: {} as IJob[],

            page: 1,
            limit: 10,

            timer: 0 as any,
            filters: {
                global: {value: ''},
                environmentType: {value: [] as string[]},
                eventType: {value: [] as string[]},
                'emittedBy.name': {value: [] as string[]},
            },

            convertSortOrderToInt,
            searchedText,
            getEventTypeIcon,
            getPPETypeIcon,
            getEnvironmentTypeIcon,
            EnvironmentTypeEnum,
            EventTypeEnum
        };
    },
    async mounted() {
        await this.fetchEvents({page: this.page, limit: this.limit} as IPaginateQuery);
    },
    methods: {
        callDeleteModal(event: IEnvironmentEvent) {
            this.deleteModal = true;
            this.eventStore.currentSelectedEvent = event;
        },
        callEditModal(event: IEnvironmentEvent) {
            this.addModal = true;
            this.editModal = true;
            this.eventStore.currentSelectedEvent = event;
        },
        showJobModal(jobs: IJob[]) {
            this.showJob = true;
            this.selectedJobs = jobs;
        },
        async fetchEvents(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.eventStore.findPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('environment.toast.fetchFailure'), this.$toast);      
            }

            this.loadingTable = false;
        },
        async onPage(event: any) {
            this.page = event.page + 1;
            this.limit = event.rows;
            
            await this.fetchEvents({
                page: this.page, 
                limit: this.limit, 
                sortBy: `${this.eventStore.getSortByField}:${this.eventStore.getSortByOrder}`,
                searchBy: ['environmentName'],
                search: this.filters.global.value,
                'filter.environmentType': (this.filters.environmentType.value && this.filters.environmentType.value.length > 0) ? `$in:${this.filters.environmentType.value.join()}` : undefined,
                'filter.eventType': (this.filters.eventType.value && this.filters.eventType.value.length > 0) ? `$in:${this.filters.eventType.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchEvents({
                page: 1, 
                limit: this.eventStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`, 
                searchBy: ['environmentName'],
                search: this.filters.global.value,
                'filter.environmentType': (this.filters.environmentType.value && this.filters.environmentType.value.length > 0) ? `$in:${this.filters.environmentType.value.join()}` : undefined,
                'filter.eventType': (this.filters.eventType.value && this.filters.eventType.value.length > 0) ? `$in:${this.filters.eventType.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async onGlobalFilter(value: string) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                await this.fetchEvents({
                    page: 1, 
                    limit: this.eventStore.getItemsPerPage, 
                    sortBy: `${this.eventStore.getSortByField}:${this.eventStore.getSortByOrder}`,
                    searchBy: ['environmentName'],
                    search: value,
                    'filter.environmentType': (this.filters.environmentType.value && this.filters.environmentType.value.length > 0) ? `$in:${this.filters.environmentType.value.join()}` : undefined,
                    'filter.eventType': (this.filters.eventType.value && this.filters.eventType.value.length > 0) ? `$in:${this.filters.eventType.value.join()}` : undefined,
                } as IPaginateQuery);
            }, 500);
        },
        async onFilter(event: any) { 
            await this.fetchEvents({
                page: 1, 
                limit: this.eventStore.getItemsPerPage, 
                sortBy: `${this.eventStore.getSortByField}:${this.eventStore.getSortByOrder}`,
                searchBy: ['environmentName'],
                search: event.filters.global.value,
                'filter.environmentType': (this.filters.environmentType.value && this.filters.environmentType.value.length > 0) ? `$in:${this.filters.environmentType.value.join()}` : undefined,
                'filter.eventType': (this.filters.eventType.value && this.filters.eventType.value.length > 0) ? `$in:${this.filters.eventType.value.join()}` : undefined,
            } as IPaginateQuery);
        },
    },
    watch: {
        'filters.global.value'(value) {
            this.onGlobalFilter(value);
        },
        async refreshData(value) {
            if (value) {
                this.refreshData = false;
                await this.fetchEvents({
                    page: this.eventStore.getCurrentPage, 
                    limit: this.eventStore.getItemsPerPage, 
                    sortBy: `${this.eventStore.getSortByField}:${this.eventStore.getSortByOrder}`,
                    searchBy: ['environmentName'],
                    search: this.filters.global.value,
                    'filter.environmentType': (this.filters.environmentType.value && this.filters.environmentType.value.length > 0) ? `$in:${this.filters.environmentType.value.join()}` : undefined,
                    'filter.eventType': (this.filters.eventType.value && this.filters.eventType.value.length > 0) ? `$in:${this.filters.eventType.value.join()}` : undefined,
                } as IPaginateQuery);
            }
        }
    },
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