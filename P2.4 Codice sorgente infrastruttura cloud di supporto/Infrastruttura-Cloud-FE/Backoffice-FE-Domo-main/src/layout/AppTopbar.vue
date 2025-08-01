<template>
    <div v-if="userType !== UserRoleEnum.OPERATOR && userType !== UserRoleEnum.TEAM_LEADER" class="layout-topbar pl-0">
        <div>
            <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
    
            <button class="p-link layout-menu-button layout-topbar-button" @click="onBackClick()">
                <i class="pi pi-arrow-left"></i>
            </button>
        </div>

        <router-link to="/" class="layout-topbar-logo layout-topbar-menu">
            <img :src="logoUrl" alt="logo" style="height: 4.0rem;"/>
            <span>{{ $t('general.companyName') }}</span>
        </router-link>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onUserProfileClick()" class="p-link layout-topbar-button" :class="$route.name === 'personalArea' ? 'border-solid border-primary' : ''">
                <i class="pi pi-user"></i>
                <span>Settings</span>
            </button>
        </div>
    </div>
    <div v-else class="layout-topbar custom-layout-topbar flex align-content-center justify-content-center">
        <router-link to="/" class="layout-topbar-logo custom-layout-topbar-logo">
            <img :src="logoUrl" alt="logo" style="height: 4.0rem;"/>
            <span class="title-color">{{ $t('general.companyName') }}</span>
        </router-link>
    </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useLayout } from '@/layout/composables/layout'
import { usePrimeVue } from 'primevue/config'
import { useAuthStore } from '@/stores/auth';
import { UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

const { layoutConfig, onMenuToggle, layoutState } = useLayout();

export default {
    name: 'AppTopbar',
    data() {
        return {
            router: useRouter(),
            primevue: usePrimeVue(),
            topbarMenuActive: false,

            userType: useAuthStore().user.role,
            UserRoleEnum
        }
    },
    mounted() {
        if(this.userType === UserRoleEnum.OPERATOR || this.userType === UserRoleEnum.TEAM_LEADER)
            layoutState.staticMenuDesktopInactive.value = true;
    },
    computed: {
        logoUrl() {
            return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.png`;
        },
        topbarMenuClasses() {
            return {
                'layout-topbar-menu-active': this.topbarMenuActive
            }
        },
    },
    methods: {
        onMenuToggle,
        onTopBarMenuButton() {
            this.topbarMenuActive = !this.topbarMenuActive;
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

        onUserProfileClick() {
            this.router.push({ name: 'personalArea' });
        },

        onBackClick() {
            this.router.go(-1);
        }
    }
}

</script>

<style lang="scss" scoped>
.custom-layout-topbar {
    background-color: #f59f0b !important;
}

.custom-layout-topbar .custom-layout-topbar-logo {
    justify-content: center !important;
    width: 100% !important;
}

.title-color {
    color: #ffffff;
}
</style>