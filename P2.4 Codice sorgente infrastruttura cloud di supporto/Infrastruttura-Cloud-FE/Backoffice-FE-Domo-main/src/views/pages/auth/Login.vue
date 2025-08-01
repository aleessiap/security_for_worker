<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-6 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center">
                        <img :src="logoUrl" alt="Logo" class="mb-5 w-10rem flex-shrink-0" />
                    </div>
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">{{ $t('login.welcome') }}{{ $t('general.companyName') }}</div>
                        <span class="text-600 font-medium">{{ $t('login.welcome_message') }}</span>
                    </div>

                    <div>
                        <div class="mb-5">
                            <FloatLabel>
                                <InputText id="email" type="text" :placeholder="$t('login.form.emailPlaceholder')" class="w-full md:w-30rem" style="padding: 1rem" v-model="email" :invalid="v$.email.$error"/>
                                <label for="email" class="block text-900 font-medium mb-2">{{ $t('login.form.email') }}</label>
                            </FloatLabel>
                            <Message v-if="v$.email.$error" severity="error" :closable="false">{{  v$.email.$errors[0].$message }}</Message>
                        </div>
                        
                        <div class="mb-5">
                            <FloatLabel>
                                <Password id="password" v-model="password" :placeholder="$t('login.form.passwordPlaceholder')" :toggleMask="true" :feedback="false" class="w-full md:w-30rem" inputClass="w-full" :invalid="v$.password.$error" :inputStyle="{ padding: '1rem' }"></Password>
                                <label for="password" class="block text-900 font-medium mb-2">{{ $t('login.form.password') }}</label>
                            </FloatLabel>
                            <Message v-if="v$.password.$error" severity="error" :closable="false">{{  v$.password.$errors[0].$message }}</Message>
                        </div>

                        <Button :label="$t('general.login')" class="w-full p-3 text-xl mt-3" :loading="loading" @click="login"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useLayout } from '@/layout/composables/layout';
import { defineComponent } from 'vue';

import { useVuelidate } from '@vuelidate/core';
import { helpers, required, email } from '@vuelidate/validators';

import { useAuthStore } from '@/stores/auth';
import { ErrorTitles, ILoginUser } from '@visioscientiae/backoffice-packages-domo';
import { HttpErrorToast } from '@/utility/ErrorsHandler';

import Message from 'primevue/message';
import Toast from 'primevue/toast';

export default defineComponent({
    name: 'Login',
    components: {
        Toast,
    },
    mounted() {
        const { layoutConfig } = useLayout();

        this.logoUrl = `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.png`;
    },
    data() {
        return {
            loading: false as boolean,

            authStore: useAuthStore(),
        
            email: '' as string,
            password: '' as string,
            logoUrl: '' as string,

            v$: useVuelidate(),
        };
    },
    methods: {
        async login() {
            this.v$.$validate();
            if (this.v$.$error) 
                return;

            this.loading = true;

            const userCredentials = {
                email: this.email,
                password: this.password,
            } as ILoginUser;

            try {
                await this.authStore.login(userCredentials);

                this.$router.push({ name: 'dashboard' });
                // this.$toast.add({severity: 'success', summary: this.$t('login.toast.loginSuccess'), life: 3000 });
            } catch (err: any) {
                this.loading = false;

                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('login.toast.loginFailure'), err.detail, this.$toast);
                else
                    HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);
            }
        },
    },
    validations() {
        return {
            email: {
                required: helpers.withMessage(this.$t('login.form.emailValidation'), required),
                email: helpers.withMessage(this.$t('login.form.emailValidation'), email),
            },
            password: {
                required: helpers.withMessage(this.$t('login.form.passwordValidation'), required),
            }
        };
    },
});
</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
