<template>
    <PersonalArea :darkModeButton="false" />
    <div v-if="jobStore.paginatedJobs.data && jobStore.paginatedJobs.data?.length > 0" class="card p-1">
        <DataTable
            lazy
            :value="jobStore.paginatedJobs.data"
            :loading="loadingOpenJobs"
            :paginator="true"
            :rows="jobStore.getItemsPerPage"
            :totalRecords="jobStore.getTotalItems"
            class="p-datatable-custom"
            @page="onOpenJobPage($event)" >
            
            <template #header>
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <div class="flex align-items-center justify-content-center">
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-briefcase text-primary text-xl"></i>
                        </div>
                        <h5 class="m-0 ml-3">{{ $t('job.title') }}</h5>
                    </div>
                    <div class="flex flex-column md:flex-row gap-1">
                        <Button :label="$t('job.add')" icon="pi pi-plus" class="mr-2 mt-2 md:mt-0" severity="success" @click="showModal = true" />
                    </div>
                </div>
            </template>

            <template #empty> {{ $t('general.notFound') }} </template>

            <Column field="startDate" :header="$t('job.table.startDate')">
                <template #body="slotProps">
                    {{ new Date(slotProps.data.startDate).toLocaleString() }}
                </template>
            </Column>

            <Column field="name" :header="$t('job.table.jobName')"></Column>

            <Column field="environmentName" :header="$t('job.table.environmentName')"></Column>
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
            
            <Column headerStyle="width:5%; min-width:10rem;" >
                <template #header>
                    <span class="flex-1 text-center">{{ $t('environment.table.actions') }}</span>
                </template>
                <template #body="slotProps">
                    <div class="flex justify-content-center align-items-center gap-3">
                        <Button icon="pi pi-lock" severity="primary" rounded @click="callEditModal(slotProps.data)"/>
                        <Button icon="pi pi-trash" severity="danger" rounded @click="callDeleteModal(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
    <div v-else class="card flex justify-content-center">
        <div class="inline-flex flex-column">
            <span class="mb-3 px-2">{{ $t('job.noJobsWarning') }}</span>
            <Button :label="$t('job.add')" icon="pi pi-plus" severity="success" @click="showModal = true" />
        </div>
    </div>

    <EndJobModal v-model:showModal="showEndJobModal" :jobInfo="jobStore.currentSelectedJob" @refreshData="refreshData = true"></EndJobModal>
    <DeleteModal v-model:showModal="showDeleteModal" :loading="loadingDelete" :modalTitle="$t('job.deleteJobModal.title')" :valueToDelete="jobStore.currentSelectedJob.name" @delete="deleteJob"/>
    <CreateJobFormModal v-model:showModal="showModal" @refreshData="refreshData = true"></CreateJobFormModal>
    <OperatorsListModal v-model:showModal="showOperators" :operatorsList="selectedJobOperators"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import PersonalArea from '@/views/pages/PersonalArea.vue';
import CreateJobFormModal from '@/components/forms/CreateJobFormModal.vue';
import { useJobStore } from '@/stores/job';
import { ErrorTitles, IJob, IJobOperator, IPaginateQuery } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { getEnvironmentTypeIcon } from '@/utility/Severity';
import OperatorsListModal from '@/components/OperatorsListModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import EndJobModal from '@/components/EndJobModal.vue';

export default defineComponent({
    name: 'TeamLeader',
    components: {
        PersonalArea,
        CreateJobFormModal,
        OperatorsListModal,
        DeleteModal,
        EndJobModal
    },
    data() {
        return {
            showModal: false,
            showOperators: false,
            showDeleteModal: false,
            showEndJobModal: false,

            refreshData: false,

            loadingDelete: false,
            loadingOpenJobs: false,

            jobStore: useJobStore(),
            selectedJobOperators: [] as IJobOperator[],

            getEnvironmentTypeIcon
        }
    },
    mounted() {
        this.fetchOpenJobs({'filter.endDate': '$null'} as IPaginateQuery);
    },
    methods: {
        showOperatorsModal(jobOperators: IJobOperator[]) {
            this.showOperators = true;
            this.selectedJobOperators = jobOperators;
        },

        callDeleteModal(job: IJob) {
            this.showDeleteModal = true;
            this.jobStore.currentSelectedJob = job;
        },

        callEditModal(job: IJob) {
            this.showEndJobModal = true;
            this.jobStore.currentSelectedJob = job;
        },

        async fetchOpenJobs(query?: IPaginateQuery) {
            this.loadingOpenJobs = true;

            try {
                await this.jobStore.getMyPaginated(query);
            } catch (err: any) {
                HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('job.toast.fetchFailure'), this.$toast);      
            }

            this.loadingOpenJobs = false;
        },

        async deleteJob() {
            this.loadingDelete = true; 

            try {
                await this.jobStore.delete(this.jobStore.currentSelectedJob?.id as string);

                this.showDeleteModal = false;
                this.$toast.add({severity: 'success', summary: this.$t('job.toast.deleteSuccess'), life: 3000 });
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('job.toast.deleteFailure'), err.detail, this.$toast);
                else
                    HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);      
            }

            this.loadingDelete = false;
            this.refreshData = true;
        },

        async onOpenJobPage(event: any){}
    },
    watch: {
        showDeleteModal(value) {
            if (!value)
                this.jobStore.currentSelectedJob = {} as IJob;
        },
        showEndJobModal(value) {
            if (!value)
                this.jobStore.currentSelectedJob = {} as IJob;
        },
        refreshData(value) {
            if(value) {
                this.fetchOpenJobs({'filter.endDate': '$null'} as IPaginateQuery);
                this.refreshData = false;
            }
        }
    }
});
</script>