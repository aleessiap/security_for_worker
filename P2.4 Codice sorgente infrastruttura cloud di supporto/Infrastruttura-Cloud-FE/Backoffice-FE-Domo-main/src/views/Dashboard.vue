<template>
    <div>
        <Admin v-if="userType === UserRoleEnum.SUPER_ADMIN || userType === UserRoleEnum.COMPANY_ADMIN" />
        <Operator v-else-if="userType === UserRoleEnum.OPERATOR" />
        <SafetyManager v-else-if="userType === UserRoleEnum.SAFETY_MANAGER" />
        <TeamLeader v-else-if="userType === UserRoleEnum.TEAM_LEADER" />
    </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

import Admin from '@/components/dashboards/Admin.vue';
import Operator from '@/components/dashboards/Operator.vue';
import SafetyManager from '@/components/dashboards/SafetyManager.vue';
import TeamLeader from '@/components/dashboards/TeamLeader.vue';

export default {
    name: "Dashboard",
    data() {
        return {
            UserRoleEnum,

            userType: useAuthStore().user.role,
        };
    },
    components: {
        Admin,
        Operator,
        SafetyManager,
        TeamLeader,
    },
}
</script>
