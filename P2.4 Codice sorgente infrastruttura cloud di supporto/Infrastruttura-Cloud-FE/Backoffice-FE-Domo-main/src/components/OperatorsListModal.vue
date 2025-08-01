<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="$t('job.jobOperators')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <ScrollPanel style="height: 400px" :pt="{bary: 'hover:bg-primary-400 bg-primary-300 opacity-100'}">
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
    </Dialog>
</template>

<script lang="ts">
import { IJobOperator } from '@visioscientiae/backoffice-packages-domo';
import { defineComponent, PropType } from 'vue';
 
export default defineComponent({
    name: 'OperatorsListModal',
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
        operatorsList: {
            type: Object as PropType<IJobOperator[]>,
            required: true,
        }
    },
    emits: ['update:showModal', 'refreshData'],
    data() {
        return {
            show: this.showModal,
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

            if(value) {}
        },
    },
});
</script>