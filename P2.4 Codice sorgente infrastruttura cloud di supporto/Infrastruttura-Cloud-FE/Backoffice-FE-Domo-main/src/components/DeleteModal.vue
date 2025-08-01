<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="modalTitle" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3 text-red-500" style="font-size: 2rem" />
            <span v-if="valueToDelete">{{ $t('general.deleteMessage') }} <b>{{ valueToDelete }}</b>?</span>
        </div>

        <template #footer>
            <Button :label="$t('general.buttons.no')" icon="pi pi-times" severity="secondary" @click="closeModal" />
            <Button :label="$t('general.buttons.yes')" icon="pi pi-check" severity="danger" :loading="loading" @click="emitDelete"/>
        </template>
    </Dialog>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DeleteModal',
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
        modalTitle: {
            type: String,
            required: true,
        },
        valueToDelete: {
            type: String,
            required: false,
        },
    },
    emits: ['update:showModal', 'delete'],
    data() {
        return {
            show: this.showModal,
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
        },
        emitDelete() {
            this.$emit('delete');
        }
    },
    watch: {
        showModal(value) {
            this.show = value;
        }
    },
});
</script>