<template>
    <div class="grid">
        <DashboardCard :name="$t('dashboard.cards.operators')" icon="pi-user" imagePath="images/cards/operators.jpg" routeName="operators" />
        <DashboardCard :name="$t('dashboard.cards.ppes')" icon="pi-shield" imagePath="/images/cards/ppes.jpg" routeName="personalProtectiveEquipments" />
        <DashboardCard :name="$t('dashboard.cards.environments')" icon="pi-image" imagePath="/images/cards/environments.jpg" routeName="environments" />
        <DashboardCard :name="$t('dashboard.cards.iotDevices')" icon="pi-mobile" imagePath="/images/cards/iotdevices.jpg" routeName="iotDevices" />
        <DashboardCard :name="$t('dashboard.cards.sensors')" icon="pi-cog" imagePath="/images/cards/sensors.jpg" routeName="sensors" />
        <DashboardCard :name="$t('dashboard.cards.jobs')" icon="pi-briefcase" imagePath="/images/cards/jobs.jpg" routeName="jobs" />
    </div>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-6">
            <OperatorEvents :simpleMode="true"></OperatorEvents>
        </div>
        <div class="col-12 lg:col-6 xl:col-6">
            <EnvironmentEvents :simpleMode="true"></EnvironmentEvents>
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DashboardCard from '../DashboardCard.vue';

import OperatorEvents from '@/views/pages/List/OperatorEvents.vue';
import EnvironmentEvents from '@/views/pages/List/EnvironmentEvents.vue';

export default defineComponent({
    name: 'SafetyManager',
    components: {
        DashboardCard,
        OperatorEvents,
        EnvironmentEvents
    }
});

</script>