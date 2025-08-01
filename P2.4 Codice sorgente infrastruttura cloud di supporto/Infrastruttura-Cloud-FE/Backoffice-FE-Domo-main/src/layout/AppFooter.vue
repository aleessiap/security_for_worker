<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.png`;
});
const sponsor1Url = computed(() => {
    return `layout/images/sponsor1.png`;
});
const sponsor2Url = computed(() => {
    return `layout/images/sponsor2.png`;
});
</script>

<template>
    <div class="layout-footer justify-content-between p-0 mx-4 border-round shadow-1"
        :style="{ backgroundColor: layoutConfig.darkTheme.value ? '#18181b' : 'white' }">
        <div class="flex align-items-center m-2 gap-2">
            <a href="https://www.regione.sardegna.it">
                <img :src="sponsor1Url" class="p-2 border-round" alt="Regione Sardegna"
                    style="height: 5.5rem; background-color: white;" />
            </a>
            <a href="https://www.sardegnaricerche.it">
                <img :src="sponsor2Url" class="p-2 border-round" alt="Sardegna Ricerche"
                    style="height: 5.5rem; background-color: white;" />
            </a>
        </div>

        <div class="flex align-items-center m-2 p-2 border-round" style="background-color: white;">
            <img :src="logoUrl" alt="Logo" height="40" />
            <span class="font-medium mx-2 text-black-alpha-90">{{ $t('general.companyName') }}</span>
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
