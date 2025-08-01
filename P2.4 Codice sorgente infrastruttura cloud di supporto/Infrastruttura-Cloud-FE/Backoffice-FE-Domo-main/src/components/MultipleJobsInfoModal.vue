<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="$t('job.confirmJobModal.jobsInfo')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <Accordion v-model:activeIndex="active">
            <AccordionTab v-for="jobInfo in jobsInfo">
                <template #header>
                    <span class="flex align-items-center gap-2 w-full">
                        <i v-if="jobInfo.aborted" class="pi pi-times text-red-500 text-xl"></i>
                        <i v-else-if="jobInfo.endDate" class="pi pi-lock text-black-500 text-xl"></i>
                        <i v-else class="pi pi-lock-open text-green-500 text-xl"></i>
                        <span class="font-bold white-space-nowrap mx-2">{{ jobInfo.name }}</span>
                        <span class="font-bold white-space-nowrap mx-2">{{ new Date(jobInfo.startDate).toLocaleString() }}</span>
                    </span>
                </template>
        
                <div>      
                    <table class="p-1">
                        <tr>
                            <td class="font-bold p-2">{{ $t('job.confirmJobModal.jobName') }}:</td>
                            <td>{{ jobInfo.name }}</td>
                        </tr>
                        <tr>
                            <td class="font-bold p-2">{{ $t('job.confirmJobModal.startDate') }}:</td>
                            <td>{{ new Date(jobInfo.startDate).toLocaleString() }}</td>
                        </tr>
                        <tr v-if="jobInfo.endDate">
                            <td class="font-bold p-2">{{ $t('job.confirmJobModal.endDate') }}:</td>
                            <td>{{ new Date(jobInfo.endDate).toLocaleString() }}</td>
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
        
                    <div class="card p-0 mt-4">
                        <span class="card p-1 mb-1 flex flex-grow-1 justify-content-center text-xl bg-primary font-bold">{{ $t('job.jobOperators') }}</span>
                        <ScrollPanel style="height: 300px" :pt="{bary: 'hover:bg-primary-400 bg-primary-300 opacity-100'}">
                            <div v-for="operator in operatorsList" class="flex align-items-center justify-content-between p-3">
                                <div class="flex flex-column">
                                    <span><i class="pi pi-user mr-1"></i>{{ operator.name }} {{ operator.surname }}</span>
                                    <span><i class="pi pi-envelope mr-1"></i>{{ operator.email }}</span>
                                </div>
                                <Tag v-if="operator.confirmed" icon="pi pi-verified" :value="$t('job.confirmedJob')" severity="success" />
                                <Tag v-else-if="operator.confirmed === false" icon="pi pi-times-circle" :value="$t('job.negatedJob')" severity="danger" />
                                <Tag v-else icon="pi pi-question-circle" :value="$t('job.noResponseJob')" severity="secondary" />
                            </div>
                        </ScrollPanel>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>

    </Dialog>
</template>

<script lang="ts">
import { useJobStore } from '@/stores/job';
import { getEnvironmentTypeIcon } from '@/utility/Severity';
import { ErrorTitles, IJob, IJobOperator } from '@visioscientiae/backoffice-packages-domo';
import { defineComponent, PropType } from 'vue';
 
export default defineComponent({
    name: 'MultipleJobInfoModal',
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
        jobsInfo: {
            type: Object as PropType<IJob[]>,
            required: true,
        }
    },
    emits: ['update:showModal', 'refreshData'],
    data() {
        return {
            show: this.showModal,

            loading: false,

            jobStore: useJobStore(),

            operatorsList: [] as IJobOperator[],

            active: null,

            getEnvironmentTypeIcon
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
        },
    },
    watch: {
        async showModal(value) {
            this.show = value;
            this.active = null;

            if(value) {}
        },
        async active(value) {
            if(value > 0)
                this.operatorsList = (await this.jobStore.getById(this.jobsInfo[value].id)).operatorsList;
        }
    },
});
</script>