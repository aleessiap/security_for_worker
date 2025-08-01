<template>
    <div class="card p-1">
        <DataTable
            lazy
            stripedRows
            :value="ppeStore.paginatedPPEs.data"
            :loading="loadingTable"
            v-model:filters="filters"
            :paginator="true"
            :rows="ppeStore.getItemsPerPage"
            :totalRecords="ppeStore.getTotalItems"
            :rowsPerPageOptions="[10, 25, 100]"
            :currentPageReportTemplate="$t('general.paginationReportTemplate', {first: '{first}', last: '{last}', totalRecords: '{totalRecords}'})"
            :sortField="ppeStore.getSortByField"
            :sortOrder="convertSortOrderToInt(ppeStore.getSortByOrder as string)"
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
                            <i class="pi pi-shield text-primary text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('ppe.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-1">
                        <Button :label="$t('ppe.add')" icon="pi pi-plus" class="mr-2 mt-2 md:mt-0" severity="success" @click="addModal = true" />
                        <IconField iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" :placeholder="$t('ppe.searchByKeyword')" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="name" :header="$t('ppe.table.name')" sortable>
                <template #body="slotProps">
                    <span v-html="searchedText(slotProps.data.name, filters['global'].value)"></span>
                </template>
            </Column>

            <Column field="type" :header="$t('ppe.table.type')" :showFilterMatchModes="false">
                <template #body="slotProps">
                    <Chip :label="$t(`ppe.type.${slotProps.data.type}`)" :image="'images/icons/PPE/' + getPPETypeIcon(slotProps.data.type)" />
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="Object.values(PPETypeEnum)" :placeholder="$t('ppe.table.filterByPPEs')" class="p-column-filter" style="min-width: 14rem" :maxSelectedLabels="1">
                        <template #value="slotProps">
                            <div class="flex align-items-center">
                                <span v-if="slotProps.value && slotProps.value.length > 0" v-for="(value, index) in slotProps.value">
                                    <Chip v-if="index < 4" class="mx-1" :label="$t(`ppe.type.${value}`)" :image="'images/icons/PPE/' + getPPETypeIcon(value)" />
                                    <Chip v-else-if="index < 5" class="mx-1" :label="'+' + (slotProps.value.length - 4)" />
                                </span>
                                <span v-else>{{ $t('ppe.table.filterByPPEs') }}</span>
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
            
            <Column field="available" :header="$t('ppe.table.availability')" sortable>
                <template #body="slotProps">
                    <Badge :value="slotProps.data.available ? $t('ppe.form.available') : $t('ppe.form.notAvailable')" :severity="slotProps.data.available ? 'success' : 'danger'" />
                </template>
            </Column>
            
            <Column field="createdAt" :header="$t('ppe.table.createdAt')" sortable>
                <template #body="slotProps">
                    {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
                </template>
            </Column>

            <Column field="belongsTo" :header="$t('ppe.table.belongsTo')">
                <template #body="slotProps">
                    <Chip v-if="slotProps.data.userId">
                        <i class="pi pi-user mr-2" style="font-size: 1rem"></i>
                        <span v-html="searchedText(slotProps.data.belongsTo.email, filters['global'].value)"></span>
                    </Chip>
                </template>
            </Column>

            <Column headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('user.table.actions') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button icon="pi pi-pencil" severity="secondary" rounded @click="callEditModal(slotProps.data)"/>
                        <Button icon="pi pi-trash" severity="danger" rounded @click="callDeleteModal(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <PPEFormModal v-model:showModal="addModal" v-model:editMode="editModal" :oldData="ppeStore.currentSelectedPPE" @refreshData="refreshData = true"/>

        <DeleteModal v-model:showModal="deleteModal" :loading="loadingModal" :modalTitle="$t('ppe.delete')" :valueToDelete="ppeStore.currentSelectedPPE.name" @delete="deletePPE" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { ErrorTitles, IPaginateQuery, IPersonalProtectiveEquipment, PPETypeEnum, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';

import PPEFormModal from '@/components/forms/PPEFormModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';

import { convertIntToSortOrder, convertSortOrderToInt } from '@/utility/Pagination';
import { usePersonalProtectiveEquipmentStore } from '@/stores/ppe';

import { getPPETypeIcon } from '@/utility/Severity'
import Badge from 'primevue/badge';
import { searchedText } from '@/utility/Table';

export default defineComponent({
    name: 'PersonalProtectiveEquipments',
    components: {
        PPEFormModal,
        DeleteModal,
    },
    data() {
        return {
            refreshData: false,

            ppeStore: usePersonalProtectiveEquipmentStore(),

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
                available: {value: [] as boolean[]},
            },

            PPETypeEnum,
            convertSortOrderToInt,
            searchedText,
            getPPETypeIcon,
        };
    },
    async mounted() {
        await this.fetchPPEs({page: this.page, limit: this.limit} as IPaginateQuery);
    },
    methods: {
        callDeleteModal(ppe: IPersonalProtectiveEquipment) {
            this.deleteModal = true;
            this.ppeStore.currentSelectedPPE = ppe;
        },
        callEditModal(ppe: IPersonalProtectiveEquipment) {
            this.addModal = true;
            this.editModal = true;
            this.ppeStore.currentSelectedPPE = ppe;
        },
        async fetchPPEs(query?: IPaginateQuery) {
            this.loadingTable = true;

            try {
                await this.ppeStore.findPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('ppe.toast.fetchFailure'), this.$toast);      
            }

            this.loadingTable = false;
        },
        async onPage(event: any) {
            this.page = event.page + 1;
            this.limit = event.rows;
            
            await this.fetchPPEs({
                page: this.page, 
                limit: this.limit, 
                sortBy: `${this.ppeStore.getSortByField}:${this.ppeStore.getSortByOrder}`,
                searchBy: ['name', 'belongsTo.email'],
                search: this.filters.global.value,
                'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async onSort(event: any) {
            await this.fetchPPEs({
                page: 1, 
                limit: this.ppeStore.getItemsPerPage, 
                sortBy: `${event.sortField}:${convertIntToSortOrder(event.sortOrder)}`, 
                searchBy: ['name', 'belongsTo.email'],
                search: this.filters.global.value,
                'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined
            } as IPaginateQuery);
        },
        async onGlobalFilter(value: string) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                await this.fetchPPEs({
                    page: 1, 
                    limit: this.ppeStore.getItemsPerPage, 
                    sortBy: `${this.ppeStore.getSortByField}:${this.ppeStore.getSortByOrder}`,
                    searchBy: ['name', 'belongsTo.email'],
                    search: value,
                    'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
                } as IPaginateQuery);
            }, 500);
        },
        async onFilter(event: any) { 
            await this.fetchPPEs({
                page: 1, 
                limit: this.ppeStore.getItemsPerPage, 
                sortBy: `${this.ppeStore.getSortByField}:${this.ppeStore.getSortByOrder}`,
                searchBy: ['name', 'belongsTo.email'],
                search: event.filters.global.value,
                'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
            } as IPaginateQuery);
        },
        async deletePPE() {
            this.loadingModal = true; 

            try {
                await this.ppeStore.delete(this.ppeStore.currentSelectedPPE.id);

                this.deleteModal = false;
                this.$toast.add({severity: 'success', summary: this.$t('ppe.toast.deleteSuccess'), life: 3000 });
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('ppe.toast.deleteFailure'), err.detail, this.$toast);
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
                this.ppeStore.currentSelectedPPE = {} as IPersonalProtectiveEquipment;
        },
        editModal(value) {
            if (!value)
                this.ppeStore.currentSelectedPPE = {} as IPersonalProtectiveEquipment;
        },
        'filters.global.value'(value) {
            this.onGlobalFilter(value);
        },
        async refreshData(value) {
            if (value) {
                this.refreshData = false;
                await this.fetchPPEs({
                    page: this.ppeStore.getCurrentPage, 
                    limit: this.ppeStore.getItemsPerPage, 
                    sortBy: `${this.ppeStore.getSortByField}:${this.ppeStore.getSortByOrder}`,
                    searchBy: ['name', 'belongsTo.email'],
                    search: this.filters.global.value,
                    'filter.type': (this.filters.type.value && this.filters.type.value.length > 0) ? `$in:${this.filters.type.value.join()}` : undefined,
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