<template>
    <div class="card">
        <div class="flex justify-content-between">
            <Badge :value="$t(`user.role.${authStore.user.role}`)" size="large" severity="primary" class="mb-3"></Badge>
            <div v-if="darkModeButton">
                <Button v-if="darkMode" rounded type="button" icon="pi pi-sun" severity="constrast" @click="toggleDarkMode" />
                <Button v-else rounded type="button" icon="pi pi-moon" severity="constrast" @click="toggleDarkMode" />
            </div>
        </div>
        <div class="text-3xl font-medium text-900 mb-3">
            {{ authStore.user.email }}
        </div>

        <div class="font-medium text-500 mb-3">
            <div v-if="authStore.user.name">
                {{ $t('user.form.name') }}: {{ authStore.user.name }}
            </div>
            <div v-if="authStore.user.surname">
                {{ $t('user.form.surname') }}: {{ authStore.user.surname }}
            </div>
        </div>

        <div class="font-medium text-500 mb-3">
            {{ $t('user.form.createdAt') }}: {{ new Date(authStore.user.createdAt).toLocaleDateString() }}
        </div>
        
        <div class="flex justify-content-end mt-6">
            <Button :label="$t('general.logout')" icon="pi pi-sign-out" severity="danger" @click="$router.push({ name: 'logout' })" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useAuthStore } from '@/stores/auth';

import { useLayout } from '@/layout/composables/layout'
import { usePrimeVue } from 'primevue/config'
import router from '@/router';
import { getUserRoleEnum } from '@/utility/Severity';

const { layoutConfig } = useLayout();

export default defineComponent({
    name: 'PersonalArea',
    data() {
        return {
            authStore: useAuthStore(),
            primevue: usePrimeVue(),

            getUserRoleEnum
        };
    },
    props: {
        darkModeButton: {
            type: Boolean,
            default: true,
        }
    },
    computed: {
        darkMode() {
            return layoutConfig.theme.value.split('-')[1] === 'dark';
        },
    },
    methods: {
        logout() {
            this.authStore.logout();
            this.$router.push({ name: 'login' });
        },
        toggleDarkMode() {
            let oldTheme = layoutConfig.theme.value.split('-');
            let darkMode = oldTheme[1] === 'dark';
            let newTheme = oldTheme[0] + '-' + (darkMode ? 'light' : 'dark') + "-" + oldTheme[2]

            this.primevue.changeTheme(oldTheme.join("-"), newTheme, 'theme-css', () => {
                layoutConfig.theme.value = newTheme;
                layoutConfig.darkTheme.value = !layoutConfig.darkTheme.value;
            });
        },
    },
});
</script>
<style lang="scss" scoped></style>
