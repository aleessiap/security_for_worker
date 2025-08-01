<style lang="scss" scoped></style>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator && item.visible" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<script lang="ts">
import AppMenuItem from './AppMenuItem.vue';

import { useAuthStore } from '@/stores/auth';
import { UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

interface MenuItem {
    label: string;
    icon?: string;
    to?: string;
    url?: string;
    target?: string;
    items?: MenuItem[];
    class?: string;
    badge?: string;
    separator?: boolean;
    disabled?: boolean;
    visible?: boolean;
    preventExact?: boolean;
}

export default {
    components: {
        AppMenuItem
    },
    data() {
        return {
            model: [
                {
                    // label: this.$t('general.sideBar.sections.home'),
                    label: '',
                    visible: true,
                    items: [
                        {
                            label: this.$t('general.sideBar.pages.dashboard'),
                            icon: 'pi pi-fw pi-home',
                            to: this.$router.resolve({ name: 'dashboard' }).path
                        },
                    ]
                },
                {
                    // label: this.$t('general.sideBar.sections.maintenance'),
                    label: '',
                    visible: useAuthStore().userAllowed([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER]),
                    items: [
                        {
                            label: this.$t('general.sideBar.pages.users'),
                            icon: 'pi pi-fw pi-users',
                            visible: useAuthStore().userAllowed([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN]),
                            to: this.$router.resolve({ name: 'users' }).path
                        },
                        {
                            label: this.$t('general.sideBar.pages.operators'),
                            icon: 'pi pi-fw pi-user',
                            to: this.$router.resolve({ name: 'operators' }).path
                        },
                        {
                            label: this.$t('general.sideBar.pages.ppes'),
                            icon: 'pi pi-fw pi-shield',
                            to: this.$router.resolve({ name: 'personalProtectiveEquipments' }).path
                        },
                        {
                            label: this.$t('general.sideBar.pages.environments'),
                            icon: 'pi pi-fw pi-image',
                            to: this.$router.resolve({ name: 'environments' }).path
                        },
                        {
                            label: this.$t('general.sideBar.pages.iotDevices'),
                            icon: 'pi pi-fw pi-mobile',
                            to: this.$router.resolve({ name: 'iotDevices' }).path
                        },
                        {
                            label: this.$t('general.sideBar.pages.sensors'),
                            icon: 'pi pi-fw pi-cog',
                            to: this.$router.resolve({ name: 'sensors' }).path
                        },
                        {
                            label: this.$t('general.sideBar.pages.jobs'),
                            icon: 'pi pi-fw pi-briefcase',
                            to: this.$router.resolve({ name: 'jobs' }).path
                        },
                    ]
                },
                {
                    label: '',
                    visible: useAuthStore().userAllowed([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.COMPANY_ADMIN, UserRoleEnum.SAFETY_MANAGER]),
                    items: [
                        {
                            label: this.$t('general.sideBar.pages.operatorEvents'),
                            icon: 'pi pi-fw pi-heart',
                            to: this.$router.resolve({ name: 'operatorEvents' }).path
                        },
                        {
                            label: this.$t('general.sideBar.pages.environmentEvents'),
                            icon: 'pi pi-fw pi-truck',
                            to: this.$router.resolve({ name: 'environmentEvents' }).path
                        }
                    ]
                }
            ] as MenuItem[],
        }
    },
}

</script>