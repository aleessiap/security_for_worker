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
            :globalFilterFields="['ppeType', 'eventType', 'emittedBy.email']"
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
                            <i class="pi pi-heart text-blue-500 text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('event.operator.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-3">
                        <Button icon="pi pi-refresh" @click="refreshData = true" severity="secondary" />
                        <Button v-if="simpleMode" icon="pi pi-external-link" @click="$router.push({ name: 'operatorEvents' })" severity="info" />
                        <IconField v-if="!simpleMode" iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('event.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="operatorName" :header="$t('event.operator.table.name')" :sortable="!simpleMode">
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.operatorName, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="operatorSurname" :header="$t('event.operator.table.surname')" :sortable="!simpleMode">
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.operatorSurname, filters['global'].value)"></span>
                </template>
            </Column>

            <Column v-if="!simpleMode" field="operatorEmailAddress" :header="$t('event.operator.table.email')" :sortable="!simpleMode">
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.operatorEmailAddress, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="timestamp" :header="$t('event.operator.table.timestamp')" :sortable="!simpleMode">
                <template #body="slotProps">
                    <span>{{ new Date(slotProps.data.timestamp).toLocaleString() }}</span>
                </template>
            </Column>

            <Column field="ppeType" :header="$t('event.operator.table.ppe')" :showFilterMatchModes="false">
                <template #body="slotProps">
                    <Chip :label="$t(`ppe.type.${slotProps.data.ppeType}`)" :image="'images/icons/PPE/' + getPPETypeIcon(slotProps.data.ppeType)" />
                </template>
                <template v-if="!simpleMode" #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Object.values(PPETypeEnum)" :placeholder="$t('event.operator.table.filterByPpes')" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #value="slotProps">
                            <div class="flex align-items-center">
                                <span v-if="slotProps.value && slotProps.value.length > 0" v-for="(value, index) in slotProps.value">
                                    <Chip v-if="index < 4" class="mx-1" :label="$t(`ppe.type.${value}`)" :image="'images/icons/PPE/' + getPPETypeIcon(value)" />
                                    <Chip v-else-if="index < 5" class="mx-1" :label="'+' + (slotProps.value.length - 4)" />
                                </span>
                                <span v-else>{{ $t('event.operator.table.filterByPpes') }}</span>
                            </div>
                        </template>
                        
                        <template #option="slotProps">
                            <div class="flex align-items-center gap-2">
                                <Chip :label="$t(`ppe.type.${slotProps.option}`)" :image="'images/icons/PPE/' + getPPETypeIcon(slotProps.option)" />
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column field="eventType" :header="$t('event.operator.table.eventType')" :showFilterMatchModes="false">
                <template #body="slotProps">
                    <Chip :label="$t(`event.eventType.${slotProps.data.eventType}`)" :image="'images/icons/Event/' + getEventTypeIcon(slotProps.data.eventType)" />
                </template>
                <template v-if="!simpleMode" #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Object.values(EventTypeEnum)" :placeholder="$t('event.operator.table.filterByEvents')" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #value="slotProps">
                            <div class="flex align-items-center">
                                <span v-if="slotProps.value && slotProps.value.length > 0" v-for="(value, index) in slotProps.value">
                                    <Chip v-if="index < 4" class="mx-1" :label="$t(`event.eventType.${value}`)" :image="'images/icons/Event/' + getEventTypeIcon(value)" />
                                    <Chip v-else-if="index < 5" class="mx-1" :label="'+' + (slotProps.value.length - 4)" />
                                </span>
                                <span v-else>{{ $t('event.operator.table.filterByEvents') }}</span>
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

            <Column v-if="!simpleMode" field="job" :header="$t('event.operator.table.relatedJob')">
                <template #body="slotProps">
                    <div v-if="slotProps.data.job" class="flex align-items-center gap-2">
                        <Chip>
                            <i class="pi pi-briefcase mr-2" style="font-size: 1rem"></i>
                            {{ slotProps.data.job?.name }}
                        </Chip>
                        <Chip>
                            <i class="pi pi-calendar mr-2" style="font-size: 1rem"></i>
                            {{ new Date(slotProps.data.job?.startDate).toLocaleString() }}
                        </Chip>
                    </div>
                </template>
            </Column>

            <Column v-if="!simpleMode" headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('sensor.table.actions') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button v-if="slotProps.data.job" icon="pi pi-briefcase" severity="info" rounded @click="showJobModal(slotProps.data.job)"/>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>

    <JobInfoModal v-model:showModal="showJob" :jobInfo="selectedJob" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ErrorTitles, EventTypeEnum, IJob, IOperatorEvent, IPaginateQuery, PPETypeEnum, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';

import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';

import { searchedText } from '@/utility/Table';
import { useOperatorEventStore } from '@/stores/operatorEvent';
import { getEventTypeIcon, getPPETypeIcon } from '@/utility/Severity';

import JobInfoModal from '@/components/JobInfoModal.vue';

export default defineComponent({
    name: 'OperatorEvents',
    components: {
        JobInfoModal
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

            eventStore: useOperatorEventStore(),

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
                global: {value: ''},
                ppeType: {value: [] as string[]},
                eventType: {value: [] as string[]},
                'emittedBy.email': {value: [] as string[]},
            },

            convertSortOrderToInt,
            searchedText,
            getEventTypeIcon,
            getPPETypeIcon,
            EventTypeEnum,
            PPETypeEnum
        };
    },
    async mounted() {
        await this.fetchEvents({page: this.page, limit: this.limit} as IPaginateQuery);
    },
    methods: {
        callDeleteModal(event: IOperatorEvent) {
            this.deleteModal = true;
            this.eventStore.currentSelectedEvent = event;
        },
        callEditModal(event: IOperatorEvent) {
            this.addModal = true;
            this.editModal = true;
            this.eventStore.currentSelectedEvent = event;
        },
        showJobModal(job: IJob) {
            this.showJob = true;
            this.selectedJob = job;
        },
        async fetchEvents(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.eventStore.findPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('operator.toast.fetchFailure'), this.$toast);      
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
                searchBy: ['operatorName', 'operatorSurname', 'operatorEmailAddress'],
                search: this.filters.global.value,
                'filter.ppeType': (this.filters.ppeType.value && this.filters.ppeType.value.length > 0) ? `$in:${this.filters.ppeType.value.join()}` : undefined,
                'filter.eventType': (this.filters.eventType.value && this.filters.eventType.value.length > 0) ? `$in:${this.filters.eventType.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchEvents({
                page: 1, 
                limit: this.eventStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`, 
                searchBy: ['operatorName', 'operatorSurname', 'operatorEmailAddress'],
                search: this.filters.global.value,
                'filter.ppeType': (this.filters.ppeType.value && this.filters.ppeType.value.length > 0) ? `$in:${this.filters.ppeType.value.join()}` : undefined,
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
                    searchBy: ['operatorName', 'operatorSurname', 'operatorEmailAddress'],
                    search: value,
                    'filter.ppeType': (this.filters.ppeType.value && this.filters.ppeType.value.length > 0) ? `$in:${this.filters.ppeType.value.join()}` : undefined,
                    'filter.eventType': (this.filters.eventType.value && this.filters.eventType.value.length > 0) ? `$in:${this.filters.eventType.value.join()}` : undefined,
                } as IPaginateQuery);
            }, 500);
        },
        async onFilter(event: any) { 
            await this.fetchEvents({
                page: 1, 
                limit: this.eventStore.getItemsPerPage, 
                sortBy: `${this.eventStore.getSortByField}:${this.eventStore.getSortByOrder}`,
                searchBy: ['operatorName', 'operatorSurname', 'operatorEmailAddress'],
                search: event.filters.global.value,
                'filter.ppeType': (this.filters.ppeType.value && this.filters.ppeType.value.length > 0) ? `$in:${this.filters.ppeType.value.join()}` : undefined,
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
                    searchBy: ['operatorName', 'operatorSurname', 'operatorEmailAddress'],
                    search: this.filters.global.value,
                    'filter.ppeType': (this.filters.ppeType.value && this.filters.ppeType.value.length > 0) ? `$in:${this.filters.ppeType.value.join()}` : undefined,
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