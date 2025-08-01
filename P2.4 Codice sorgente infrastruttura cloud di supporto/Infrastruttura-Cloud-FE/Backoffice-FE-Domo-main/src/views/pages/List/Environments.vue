<template>
    <div class="card p-1">
        <DataTable
            lazy
            stripedRows 
            :value="environmentStore.paginatedEnvironments.data"
            :loading="loadingTable" 
            v-model:filters="filters"
            :paginator="true"
            :rows="environmentStore.getItemsPerPage"
            :totalRecords="environmentStore.getTotalItems"
            :rowsPerPageOptions="[10, 25, 100]"
            :currentPageReportTemplate="$t('general.paginationReportTemplate', {first: '{first}', last: '{last}', totalRecords: '{totalRecords}'})"
            :sortField="environmentStore.getSortByField"
            :sortOrder="convertSortOrderToInt(environmentStore.getSortByOrder as string)"
            :globalFilterFields="['type']"
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
                            <i class="pi pi-image text-primary text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('environment.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-1">
                        <Button :label="$t('environment.add')" icon="pi pi-plus" class="mr-2 mt-2 md:mt-0" severity="success" @click="addModal = true" />
                        <IconField iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('environment.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="name" :header="$t('environment.table.name')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.name, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="type" :header="$t('environment.table.type')" :showFilterMatchModes="false">
                <template #body="slotProps">
                    <Chip :label="$t(`environment.type.${slotProps.data.type}`)" :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.data.type)" />
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Object.values(EnvironmentTypeEnum)" :placeholder="$t('environment.table.filterByEnvironmentType')" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #value="slotProps">
                            <div class="flex align-items-center">
                                <span v-if="slotProps.value && slotProps.value.length > 0" v-for="(value, index) in slotProps.value">
                                    <Chip v-if="index < 4" class="mx-1" :label="$t(`environment.type.${value}`)" :image="'images/icons/Environment/' + getEnvironmentTypeIcon(value)" />
                                    <Chip v-else class="mx-1" :label="'+' + (slotProps.value.length - 4)" />
                                </span>
                                <span v-else>{{ $t('environment.table.filterByEnvironmentType') }}</span>
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
                        
            <Column field="createdAt" :header="$t('iot.table.createdAt')" sortable>
                <template #body="slotProps">
                    {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
                </template>
            </Column>

            <Column headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('environment.table.actions') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button icon="pi pi-pencil" severity="secondary" rounded @click="callEditModal(slotProps.data)"/>
                        <Button icon="pi pi-trash" severity="danger" rounded @click="callDeleteModal(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <EnvironmentFormModal v-model:showModal="addModal" v-model:editMode="editModal" :oldData="environmentStore.currentSelectedEnvironment" @refreshData="refreshData = true"/>

        <DeleteModal v-model:showModal="deleteModal" :loading="loadingModal" :modalTitle="$t('environment.delete')" :valueToDelete="environmentStore.currentSelectedEnvironment.name" @delete="deleteIotDevice" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ErrorTitles, IotDeviceTypeEnum, IPaginateQuery } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';

import EnvironmentFormModal from '@/components/forms/EnvironmentFormModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';

import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';

import { getEnvironmentTypeIcon } from '@/utility/Severity';
import { searchedText } from '@/utility/Table';
import { useEnvironmentStore } from '@/stores/environment';
import { EnvironmentTypeEnum, IEnvironment } from '@visioscientiae/backoffice-packages-domo/lib/esm/environment.interface';

export default defineComponent({
    name: 'IotDevices',
    components: {
        EnvironmentFormModal,
        DeleteModal,
    },
    data() {
        return {
            refreshData: false,

            environmentStore: useEnvironmentStore(),

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
                type: {value: [] as string[]},
            },

            convertSortOrderToInt,
            getEnvironmentTypeIcon,
            searchedText,
            EnvironmentTypeEnum,
        };
    },
    async mounted() {
        await this.fetchEnvironments({page: this.page, limit: this.limit} as IPaginateQuery);
    },
    methods: {
        callDeleteModal(environment: IEnvironment) {
            this.deleteModal = true;
            this.environmentStore.currentSelectedEnvironment = environment;
        },
        callEditModal(environment: IEnvironment) {
            this.addModal = true;
            this.editModal = true;
            this.environmentStore.currentSelectedEnvironment = environment;
        },
        async fetchEnvironments(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.environmentStore.findPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('iot.toast.fetchFailure'), this.$toast);      
            }

            this.loadingTable = false;
        },
        async onPage(event: any) {
            this.page = event.page + 1;
            this.limit = event.rows;
            
            await this.fetchEnvironments({
                page: this.page, 
                limit: this.limit, 
                sortBy: `${this.environmentStore.getSortByField}:${this.environmentStore.getSortByOrder}`,
                searchBy: ['name', 'type'],
                search: this.filters.global.value,
                'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchEnvironments({
                page: 1, 
                limit: this.environmentStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`,
                searchBy: ['name', 'type'],
                search: this.filters.global.value,
                'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async onGlobalFilter(value: string) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingTable = true;

                await this.fetchEnvironments({
                    page: 1, 
                    limit: this.environmentStore.getItemsPerPage, 
                    sortBy: `${this.environmentStore.getSortByField}:${this.environmentStore.getSortByOrder}`,
                    searchBy: ['identifierCode', 'installedOn.name'],
                    search: value,
                    'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
                } as IPaginateQuery);

                this.loadingTable = false;
            }, 500);
        },
        async onFilter(event: any) { 
            await this.fetchEnvironments({
                page: 1, 
                limit: this.environmentStore.getItemsPerPage, 
                sortBy: `${this.environmentStore.getSortByField}:${this.environmentStore.getSortByOrder}`,
                searchBy: ['identifierCode', 'installedOn.name'],
                search: event.filters.global.value,
                'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async deleteIotDevice() {
            this.loadingModal = true; 

            try {
                await this.environmentStore.delete(this.environmentStore.currentSelectedEnvironment.id);

                this.deleteModal = false;
                this.$toast.add({severity: 'success', summary: this.$t('iot.toast.deleteSuccess'), life: 3000 });
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('iot.toast.deleteFailure'), err.detail, this.$toast);
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
                this.environmentStore.currentSelectedEnvironment = {} as IEnvironment;
        },
        editModal(value) {
            if (!value)
                this.environmentStore.currentSelectedEnvironment = {} as IEnvironment;
        },
        'filters.global.value'(value) {
            this.onGlobalFilter(value);
        },
        async refreshData(value) {
            if (value) {
                this.refreshData = false;
                await this.fetchEnvironments({
                    page: this.environmentStore.getCurrentPage, 
                    limit: this.environmentStore.getItemsPerPage, 
                    sortBy: `${this.environmentStore.getSortByField}:${this.environmentStore.getSortByOrder}`,
                    searchBy: ['name', 'type'],
                    search: this.filters.global.value,
                    'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
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