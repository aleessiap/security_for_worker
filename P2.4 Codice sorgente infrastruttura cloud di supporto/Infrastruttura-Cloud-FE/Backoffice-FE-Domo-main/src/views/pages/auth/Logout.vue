<template></template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Logout',
    data() {
        return {
            authStore: useAuthStore()
        }
    },
    mounted() {
        this.authStore.logout();
        this.$router.push({ name: 'login' });
    }
});
</script>