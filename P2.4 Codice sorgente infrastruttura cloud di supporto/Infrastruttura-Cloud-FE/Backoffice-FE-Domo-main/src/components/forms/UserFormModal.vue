<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="headerTitle" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <form>
            <div class="flex flex-column gap-2">
                <label for="name">{{ $t('user.form.name') }}
                    <Badge v-if="!operatorMode" :value="$t('general.optional')" severity="info" class="mx-2"></Badge>
                </label>
                <InputText type="text" id="name" v-model="name" :placeholder="$t('user.form.namePlaceholder')" :invalid="v$.name.$error"/>
                <Message class="mt-1" v-if="v$.name.$error" severity="error" :closable="false">{{  v$.name.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="surname">{{ $t('user.form.surname') }}
                    <Badge v-if="!operatorMode" :value="$t('general.optional')" severity="info" class="mx-2"></Badge>
                </label>
                <InputText type="text" id="surname" v-model="surname" :placeholder="$t('user.form.surnamePlaceholder')" :invalid="v$.surname.$error"/>
                <Message class="mt-1" v-if="v$.surname.$error" severity="error" :closable="false">{{  v$.surname.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="email">{{ $t('user.form.email') }}</label>
                <InputText type="text" id="email" v-model="email" :placeholder="$t('user.form.emailPlaceholder')" :invalid="v$.email.$error"/>
                <Message class="mt-1" v-if="v$.email.$error" severity="error" :closable="false">{{  v$.email.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="password">{{ $t('user.form.password') }}</label>
                <Password id="password" v-model="password" :placeholder="$t('user.form.passwordPlaceholder')" :feedback="false" toggleMask :invalid="v$.password.$error" />
                <Message class="mt-1" v-if="v$.password.$error" severity="error" :closable="false">{{  v$.password.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="confirm-password">{{ $t('user.form.confirmPassword') }}</label>
                <Password id="confirm-password" v-model="confirmPassword" :placeholder="$t('user.form.confirmPasswordPlaceholder')" :feedback="false" toggleMask :invalid="v$.confirmPassword.$error" />
                <Message class="mt-1" v-if="v$.confirmPassword.$error" severity="error" :closable="false">{{  v$.confirmPassword.$errors[0].$message }}</Message>
            </div>

            <div v-if="!operatorMode" class="flex flex-column gap-2 mt-3">
                <label for="role">{{ $t('user.form.role') }}</label>
                <Dropdown :disabled="editMode" id="role" v-model="role" :options="Object.values(UserRoleEnum).filter(role => {if(role !== UserRoleEnum.OPERATOR) return role;})" :placeholder="$t('user.form.rolePlaceholder')" :invalid="v$.role.$error">
                    <template #value="slotProps">
                            <span v-if="slotProps.value" class="flex align-items-center">
                                <Chip :image="'images/icons/User/' + getUserRoleEnum(slotProps.value)" class="mr-2 p-0" />
                                {{ $t(`user.role.${slotProps.value}`) }}
                            </span>
                            <span v-else>{{ $t('user.form.rolePlaceholder') }}</span>
                    </template>

                    <template #option="slotProps">
                        <Chip :image="'images/icons/User/' + getUserRoleEnum(slotProps.option)" class="mr-2 p-0" />
                        <span>{{ $t(`user.role.${slotProps.option}`) }}</span>
                    </template>
                </Dropdown>
                <Message class="mt-1" v-if="v$.role.$error" severity="error" :closable="false">{{  v$.role.$errors[0].$message }}</Message>
            </div>
        </form>

        <template #footer>
            <Button :label="$t('general.buttons.save')" icon="pi pi-check" @click="createUser" severity="success" :disabled="v$.$error" :loading="loading"/>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ErrorTitles, ICreateOperator, ICreateUser, IUpdateUser, IUser, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required, requiredIf } from '@vuelidate/validators';
import { useUserStore } from '@/stores/user';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { getUserRoleEnum } from '@/utility/Severity';

export default defineComponent({
    name: 'UserFormModal',
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
        editMode: {
            type: Boolean,
            default: false,
        },
        oldData: {
            type: Object as PropType<IUser>, 
            default: undefined,
        },
        operatorMode: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['update:showModal', 'update:editMode', 'refreshData'],
    data() {
        return {
            UserRoleEnum,

            userStore: useUserStore(),

            headerTitle: !this.operatorMode ? (this.editMode ? this.$t('user.edit') : this.$t('user.add')) : (this.editMode ? this.$t('operator.edit') : this.$t('operator.add')),

            show: this.showModal,

            name: this.editMode ? this.oldData?.name : undefined as string|undefined,
            surname: this.editMode ? this.oldData?.surname : undefined as string|undefined,
            email: this.editMode ? this.oldData?.email : undefined as string|undefined,
            password: undefined as string|undefined,
            confirmPassword: undefined as string|undefined,
            role: this.editMode ? this.oldData?.role : undefined as UserRoleEnum|undefined,

            loading: false as boolean,

            v$: useVuelidate(),

            getUserRoleEnum
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
            this.$emit('update:editMode', false);
        },
        async createUser() {
            this.v$.$validate();
            if (this.v$.$error) 
                return;
            
            this.loading = true;

            if(this.editMode) {
                const userToUpdate = {
                    name: this.name === '' ? null : this.name,
                    surname: this.surname === '' ? null : this.surname,
                    email: this.email,
                    password: this.password,
                } as IUpdateUser;

                try {
                    if(this.operatorMode)
                        await this.userStore.updateOperator(this.oldData?.id as string, userToUpdate);
                    else
                        await this.userStore.update(this.oldData?.id as string, userToUpdate);

                    this.closeModal();

                    if(this.operatorMode)
                        this.$toast.add({severity: 'success', summary: this.$t('operator.toast.editSuccess'), life: 3000 });
                    else
                        this.$toast.add({severity: 'success', summary: this.$t('user.toast.editSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title)) {
                        if(this.operatorMode)
                            HttpErrorToast(this.$t('operator.toast.editFailure'), err.detail, this.$toast);
                        else
                            HttpErrorToast(this.$t('user.toast.editFailure'), err.detail, this.$toast);
                    }
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            } else {
                const user = {
                    name: this.name,
                    surname: this.surname,
                    email: this.email,
                    password: this.password,
                    role: this.role,
                } as ICreateUser;

                try {
                    if(this.operatorMode)
                        await this.userStore.createOperator({ ...user } as ICreateOperator);
                    else
                        await this.userStore.create(user);

                    this.closeModal();

                    if(this.operatorMode)
                        this.$toast.add({severity: 'success', summary: this.$t('operator.toast.createSuccess'), life: 3000 });
                    else
                        this.$toast.add({severity: 'success', summary: this.$t('user.toast.createSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title)) {
                        if(this.operatorMode)
                            HttpErrorToast(this.$t('operator.toast.createFailure'), err.detail, this.$toast);
                        else
                            HttpErrorToast(this.$t('user.toast.createFailure'), err.detail, this.$toast);
                    }
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }
            }

            this.loading = false;
        }
    },
    watch: {
        showModal(value) {
            this.show = value;

            if (value) {
                this.name = this.editMode ? this.oldData?.name : undefined;
                this.surname = this.editMode ? this.oldData?.surname : undefined;
                this.email = this.editMode ? this.oldData?.email : undefined;
                this.password = undefined;
                this.confirmPassword = undefined;
                this.role = this.editMode ? this.oldData?.role : undefined;

                this.v$.$reset();
                this.loading = false;
            }
        }
    },
    validations() {
        return {
            name: {
                required: helpers.withMessage(this.$t('user.form.nameRequired'), requiredIf(this.operatorMode)),
            },
            surname: {
                required: helpers.withMessage(this.$t('user.form.surnameRequired'), requiredIf(this.operatorMode)),
            },
            email: {
                required: helpers.withMessage(this.$t('user.form.emailValidation'), required),
                email: helpers.withMessage(this.$t('user.form.emailRequired'), email),
            },
            password: {
                required: helpers.withMessage(this.$t('user.form.passwordRequired'), requiredIf(!this.editMode)),
            },
            confirmPassword: {
                required: helpers.withMessage(this.$t('user.form.confirmPasswordValidation'), requiredIf(!this.editMode)),
                sameAsPassword: helpers.withMessage(this.$t('user.form.confirmPasswordValidation'), (value: string) => value === this.password),
            },
            role: {
                required: helpers.withMessage(this.$t('user.form.roleRequired'), requiredIf(!this.editMode && !this.operatorMode)),
            },
        }
    },
});
</script>