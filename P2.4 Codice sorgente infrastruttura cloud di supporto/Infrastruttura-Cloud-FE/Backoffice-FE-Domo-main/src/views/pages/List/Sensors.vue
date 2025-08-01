<template>
    <div class="card p-1">
        <DataTable
            lazy
            stripedRows 
            :value="sensorStore.paginatedSensors.data"
            :loading="loadingTable" 
            v-model:filters="filters"
            :paginator="true"
            :rows="sensorStore.getItemsPerPage"
            :totalRecords="sensorStore.getTotalItems"
            :rowsPerPageOptions="[10, 25, 100]"
            :currentPageReportTemplate="$t('general.paginationReportTemplate', {first: '{first}', last: '{last}', totalRecords: '{totalRecords}'})"
            :sortField="sensorStore.getSortByField"
            :sortOrder="convertSortOrderToInt(sensorStore.getSortByOrder as string)"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            tableStyle="min-width: 50rem"
            class="p-datatable-custom"
            @page="onPage($event)"
            @sort="onSort($event)">
             
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <div class="flex align-items-center justify-content-center">
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-cog text-primary text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('sensor.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-1">
                        <Button :label="$t('sensor.add')" icon="pi pi-plus" class="mr-2 mt-2 md:mt-0" severity="success" @click="addModal = true" />
                        <IconField iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('sensor.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="identifierCode" :header="$t('sensor.table.identifierCode')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.identifierCode, filters['global'].value)"></span>
                </template>
            </Column>
                        
            <Column field="createdAt" :header="$t('sensor.table.createdAt')" sortable>
                <template #body="slotProps">
                    {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
                </template>
            </Column>

            <Column field="containedWithin" :header="$t('sensor.table.containedWithin')">
                <template #body="slotProps">
                    <Chip v-if="slotProps.data.iotDeviceId">
                        <i class="pi pi-mobile mr-2" style="font-size: 1rem"></i>
                        <span v-html="searchedText(slotProps.data.containedWithin.identifierCode, filters['global'].value)"></span>
                    </Chip>
                </template>
            </Column>

            <Column headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('sensor.table.actions') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button icon="pi pi-pencil" severity="secondary" rounded @click="callEditModal(slotProps.data)" />
                        <Button icon="pi pi-trash" severity="danger" rounded @click="callDeleteModal(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <SensorFormModal v-model:showModal="addModal" v-model:editMode="editModal" :oldData="sensorStore.currentSelectedSensor" @refreshData="refreshData = true"/>

        <DeleteModal v-model:showModal="deleteModal" :loading="loadingModal" :modalTitle="$t('sensor.delete')" :valueToDelete="sensorStore.currentSelectedSensor.identifierCode" @delete="deleteSensor" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ErrorTitles, IPaginateQuery, ISensor, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { useAuthStore } from '@/stores/auth';

import SensorFormModal from '@/components/forms/SensorFormModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';

import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';
import { useSensorStore } from '@/stores/sensor';
import { searchedText } from '@/utility/Table';

export default defineComponent({
    name: 'Sensors',
    components: {
        SensorFormModal,
        DeleteModal,
    },
    data() {
        return {
            refreshData: false,

            sensorStore: useSensorStore(),

            addModal: false,
            editModal: false,
            deleteModal: false,

            loadingTable: false,
            loadingModal: false,

            page: 1,
            limit: 10,

            timer: 0 as any,
            filters: {
                global: {value: ''}
            },

            convertSortOrderToInt,
            searchedText,
            UserRoleEnum,
        };
    },
    async mounted() {
        await this.fetchSensors({page: this.page, limit: this.limit} as IPaginateQuery);
    },
    methods: {
        callDeleteModal(sensor: ISensor) {
            this.deleteModal = true;
            this.sensorStore.currentSelectedSensor = sensor;
        },
        callEditModal(sensor: ISensor) {
            this.addModal = true;
            this.editModal = true;
            this.sensorStore.currentSelectedSensor = sensor;
        },
        async fetchSensors(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.sensorStore.findPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('sensor.toast.fetchFailure'), this.$toast);      
            }

            this.loadingTable = false;
        },
        async onPage(event: any) {
            this.page = event.page + 1;
            this.limit = event.rows;
            
            await this.fetchSensors({
                page: this.page, 
                limit: this.limit, 
                sortBy: `${this.sensorStore.getSortByField}:${this.sensorStore.getSortByOrder}`,
                searchBy: ['name', 'containedWithin.identifierCode'],
                search: this.filters.global.value
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchSensors({
                page: 1, 
                limit: this.sensorStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`,
                searchBy: ['name', 'containedWithin.identifierCode'],
                search: this.filters.global.value
            } as IPaginateQuery);
        },
        async onGlobalFilter(value: string) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingTable = true;

                await this.fetchSensors({
                    page: 1, 
                    limit: this.sensorStore.getItemsPerPage, 
                    sortBy: `${this.sensorStore.getSortByField}:${this.sensorStore.getSortByOrder}`,
                    searchBy: ['name', 'containedWithin.identifierCode'],
                    search: value
                } as IPaginateQuery);
            }, 500);
        },
        async deleteSensor() {
            this.loadingModal = true; 

            try {
                await this.sensorStore.delete(this.sensorStore.currentSelectedSensor.id);

                this.deleteModal = false;
                this.$toast.add({severity: 'success', summary: this.$t('sensor.toast.deleteSuccess'), life: 3000 });
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('sensor.toast.deleteFailure'), err.detail, this.$toast);
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
                this.sensorStore.currentSelectedSensor = {} as ISensor;
        },
        editModal(value) {
            if (!value)
                this.sensorStore.currentSelectedSensor = {} as ISensor;
        },
        'filters.global.value'(value) {
            this.onGlobalFilter(value);
        },
        async refreshData(value) {
            if (value) {
                this.refreshData = false;
                await this.fetchSensors({
                    page: this.sensorStore.getCurrentPage, 
                    limit: this.sensorStore.getItemsPerPage, 
                    sortBy: `${this.sensorStore.getSortByField}:${this.sensorStore.getSortByOrder}`,
                    searchBy: ['name', 'containedWithin.identifierCode'],
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