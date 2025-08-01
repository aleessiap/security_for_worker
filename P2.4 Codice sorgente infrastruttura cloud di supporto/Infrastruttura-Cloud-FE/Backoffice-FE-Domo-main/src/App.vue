<template>
    <Toast />
    <router-view />
</template>

<script lang="ts">
import Toast from 'primevue/toast';
import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        Toast,
    },
});
</script>

<style scoped></style>

