<template>
    <div v-if="jobToConfirm !== undefined" class="card flex justify-content-center">
        <Button :label="$t('job.confirmJobModal.warning')" icon="pi pi-exclamation-triangle" severity="info" @click="showConfirmModal = true" />
    </div>
    <PersonalArea :darkModeButton="false" />
    <div class="grid">
        <div class="col-12 xl:col-6">
            <div class="card p-2">
                <DataTable
                    lazy
                    :value="ppeStore.paginatedPPEs.data"
                    :loading="loadingPPEs"
                    :paginator="true"
                    :rows="ppeStore.getItemsPerPage"
                    :totalRecords="ppeStore.getTotalItems"
                    class="p-datatable-custom"
                    @page="onPPEsPage($event)" >
                    
                    <template #header>
                        <div class="flex align-items-center">
                            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-shield text-primary text-xl"></i>
                            </div>
                            <h5 class="m-0 ml-3">{{ $t('ppe.title') }}</h5>
                        </div>
                    </template>

                    <template #empty> {{ $t('general.notFound') }} </template>

                    <Column field="name" :header="$t('ppe.table.name')"></Column>

                    <Column field="type" :header="$t('ppe.table.type')">
                        <template #body="slotProps">
                            <Chip :label="$t(`ppe.type.${slotProps.data.type}`)" :image="'images/icons/PPE/' + getPPETypeIcon(slotProps.data.type)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card p-2">
                <DataTable
                    lazy
                    :value="eventStore.paginatedEvents.data"
                    :loading="loadingEvents"
                    :paginator="true"
                    :rows="eventStore.getItemsPerPage"
                    :totalRecords="eventStore.getTotalItems"
                    class="p-datatable-custom"
                    @page="onEventsPage($event)" >
                    
                    <template #header>
                        <div class="flex align-items-center">
                            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                <i class="pi pi-heart text-blue-500 text-xl"></i>
                            </div>
                            <h5 class="m-0 ml-3">{{ $t('event.operator.title') }}</h5>
                        </div>
                    </template>

                    <template #empty> {{ $t('general.notFound') }} </template>

                    <Column field="timestamp" :header="$t('event.operator.table.timestamp')">
                        <template #body="slotProps">
                            <span>{{ new Date(slotProps.data.timestamp).toLocaleString() }}</span>
                        </template>
                    </Column>

                    <Column field="eventType" :header="$t('event.operator.table.eventType')">
                        <template #body="slotProps">
                            <Chip :label="$t(`event.eventType.${slotProps.data.eventType}`)" :image="'images/icons/Event/' + getEventTypeIcon(slotProps.data.eventType)" />
                        </template>
                    </Column>

                    <Column field="job" :header="$t('event.operator.table.relatedJob')">
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
                </DataTable>
            </div>
        </div>
    </div>

    <ConfirmJobModal v-model:showModal="showConfirmModal" :jobInfo="(jobToConfirm as IJob)" @refreshData="jobToConfirm = undefined" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import PersonalArea from '@/views/pages/PersonalArea.vue';
import { usePersonalProtectiveEquipmentStore } from '@/stores/ppe';
import { IJob, IPaginateQuery } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';

import { getEventTypeIcon, getPPETypeIcon } from '@/utility/Severity'
import { useOperatorEventStore } from '@/stores/operatorEvent';
import { useJobStore } from '@/stores/job';

import ConfirmJobModal from '@/components/ConfirmJobModal.vue';

export default defineComponent({
    name: 'Operator',
    components: {
        PersonalArea,
        ConfirmJobModal
    },
    data() {
        return {
            showConfirmModal: false,
            jobToConfirm: undefined as IJob|undefined,

            jobStore: useJobStore(),
            ppeStore: usePersonalProtectiveEquipmentStore(),
            eventStore: useOperatorEventStore(),
            
            loadingPPEs: false,
            loadingEvents: false,

            ppePage: 1,
            ppeLimit: 5,

            eventPage: 1,
            eventLimit: 5,

            getPPETypeIcon,
            getEventTypeIcon
        }
    },
    async mounted() {
        try {
            this.jobToConfirm = await this.jobStore.getMyAssignedJob();
            this.showConfirmModal = true;

        } catch (err: any) {}

        await this.fetchPPEs({page: this.ppePage, limit: this.ppeLimit} as IPaginateQuery);
        await this.fetchEvents({page: this.eventPage, limit: this.eventLimit} as IPaginateQuery);
    },
    methods: {
        async fetchPPEs(query?: IPaginateQuery) {
            try {
                await this.ppeStore.findRelatedByMe(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('ppe.toast.fetchFailure'), this.$toast);      
            }
        },
        async fetchEvents(query?: IPaginateQuery) {
            try {
                await this.eventStore.findMyPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('event.operator.toast.fetchFailure'), this.$toast);      
            }
        },
        async onPPEsPage(event: any) {
            this.loadingPPEs = true;

            this.ppePage = event.page + 1;
            this.ppeLimit = event.rows;
            
            await this.fetchPPEs({page: this.ppePage, limit: this.ppeLimit, sortBy: `${this.ppeStore.getSortByField}:${this.ppeStore.getSortByOrder}`} as IPaginateQuery);

            this.loadingPPEs = false;
        },
        async onEventsPage(event: any) {
            this.loadingEvents = true;

            this.eventPage = event.page + 1;
            this.eventLimit = event.rows;
            
            await this.fetchEvents({page: this.eventPage, limit: this.eventLimit, sortBy: `${this.eventStore.getSortByField}:${this.eventStore.getSortByOrder}`} as IPaginateQuery);

            this.loadingEvents = false;
        },
    }
});

</script>

<style scoped>
.p-datatable-custom .p-datatable-tbody > tr:hover {
    background-color: #FFFBEB;
}

.p-datatable-loadingPPEs-overlay {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>