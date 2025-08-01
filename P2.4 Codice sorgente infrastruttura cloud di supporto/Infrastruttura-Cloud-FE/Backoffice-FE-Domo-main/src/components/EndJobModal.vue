<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="$t('job.endJobModal.title')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <div class="flex flex-column justify-content-center align-items-center mb-3">
            <div>{{ $t('job.endJobModal.description') }}</div>
            <div>{{ $t('job.endJobModal.confirmattion') }}</div>
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
                    <td class="font-bold p-2">{{ $t('job.endJobModal.supposedEndDate') }}:</td>
                    <td>{{ supposedEndDate.toLocaleString() }}</td>
                </tr>
            </table> 
        </div>

        <template #footer>
            <Button :label="$t('general.buttons.cancel')" icon="pi pi-times" severity="secondary" @click="closeModal" />
            <Button :label="$t('general.buttons.yes')" icon="pi pi-check" severity="primary" :loading="loading" @click="endJob"/>
        </template>

    </Dialog>
</template>

<script lang="ts">
import { useJobStore } from '@/stores/job';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { ErrorTitles, IJob } from '@visioscientiae/backoffice-packages-domo';
import { defineComponent, PropType } from 'vue';
 
export default defineComponent({
    name: 'EndJobModal',
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
            jobStore: useJobStore(),

            loading: false,
            interval: undefined as any,
            supposedEndDate: new Date(),
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
        },
        updateSupposedEndDate() {
            this.supposedEndDate = new Date();
        },

        async endJob() {
            this.loading = true;

            try {
                await this.jobStore.endJob(this.jobInfo.id);

                this.closeModal();
                this.$toast.add({severity: 'success', summary: this.$t('job.toast.endJobSuccess'), life: 3000 });

                this.$emit('refreshData');
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('job.toast.endJobFailure'), err.detail, this.$toast);
                else
                    HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
            }

            this.loading = false;
        }
    },
    watch: {
        async showModal(value) {
            this.show = value;

            if(value) {}
        },
    },
    mounted() {
        this.interval = setInterval(this.updateSupposedEndDate, 1000);
    },
    beforeUnmount() {
        clearInterval(this.interval);
    }
});
</script>