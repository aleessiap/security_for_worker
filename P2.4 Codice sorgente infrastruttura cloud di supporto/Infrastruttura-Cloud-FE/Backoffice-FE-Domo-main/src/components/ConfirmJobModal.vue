<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="$t('job.confirmJobModal.title')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <div class="flex flex-column justify-content-center align-items-center mb-3">
            <div>{{ $t('job.confirmJobModal.description') }}</div>
            <div>{{ $t('job.confirmJobModal.question') }}</div>
        </div>

        <div class="card p-0">
            <span class="card p-1 mb-1 flex flex-grow-1 justify-content-center text-xl bg-primary font-bold">{{ $t('job.confirmJobModal.jobInfo') }}</span>
            <table class="p-2">
                <tr>
                    <td class="font-bold p-2">{{ $t('job.confirmJobModal.jobName') }}:</td>
                    <td>{{ jobInfo.name }}</td>
                </tr>
                <tr>
                    <td class="font-bold p-2">{{ $t('job.confirmJobModal.startDate') }}:</td>
                    <td>{{ new Date(jobInfo.startDate).toLocaleString() }}</td>
                </tr>
                <tr>
                    <td class="font-bold p-2">{{ $t('job.confirmJobModal.environmentName') }}:</td>
                    <td>{{ jobInfo.environmentName}}</td>
                </tr>
                <tr>
                    <td class="font-bold p-2">{{ $t('job.confirmJobModal.environmentType') }}:</td>
                    <td>
                        <Chip :label="$t(`environment.type.${jobInfo.environmentType}`)" :image="'images/icons/Environment/' + getEnvironmentTypeIcon(jobInfo.environmentType)" />
                    </td>
                </tr>
                <tr>
                    <td class="font-bold p-2">{{ $t('job.confirmJobModal.createdBy') }}:</td>
                    <td>
                        <Chip :label="jobInfo.creatorEmail" :image="'images/icons/User/team_leader.png'" />
                    </td>
                </tr>
            </table> 
        </div>

        <template #footer>
            <Button :label="$t('job.confirmJobModal.deny')" icon="pi pi-times" severity="danger" :loading="loading" @click="denyJob" />
            <Button :label="$t('job.confirmJobModal.confirm')" icon="pi pi-check" severity="success" :loading="loading" @click="confirmJob"/>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { useJobStore } from '@/stores/job';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { getEnvironmentTypeIcon } from '@/utility/Severity';
import { ErrorTitles, IJob } from '@visioscientiae/backoffice-packages-domo';
import { defineComponent, PropType } from 'vue';
 
export default defineComponent({
    name: 'ConfirmJobModal',
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
        jobInfo: {
            type: Object as PropType<IJob>,
            required: true,
        }
    },
    emits: ['update:showModal', 'refreshData'],
    data() {
        return {
            show: this.showModal,

            loading: false,

            jobStore: useJobStore(),

            getEnvironmentTypeIcon
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
        },

        async confirmJob() {
            this.loading = true;

            try {
                await this.jobStore.confirmDenyAssignedJob(true);

                this.closeModal()
                this.$toast.add({severity: 'success', summary: this.$t('job.toast.confirmJobSuccess'), life: 3000 });

                this.$emit('refreshData');   
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('job.toast.confirmJobFailure'), err.detail, this.$toast);
                else
                    HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast); 
            }

            this.loading = false;
        },

        async denyJob() {
            this.loading = true;

            try {
                await this.jobStore.confirmDenyAssignedJob(false);

                this.closeModal()
                this.$toast.add({severity: 'success', summary: this.$t('job.toast.denyJobSuccess'), life: 3000 });

                this.$emit('refreshData');  
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('job.toast.denyJobFailure'), err.detail, this.$toast);
                else
                    HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast); 
            }

            this.loading = false;
        },
    },
    watch: {
        async showModal(value) {
            this.show = value;

            if(value) {}
        },
    },
});
</script>