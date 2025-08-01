<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="!editMode ? $t('environment.add') : $t('environment.edit')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <form>
            <div class="flex flex-column gap-2">
                <label for="name">{{ $t('environment.form.name') }}</label>
                <InputText type="text" id="name" v-model="name" :placeholder="$t('environment.form.namePlaceholder')" :invalid="v$.name.$error" />
                <Message class="mt-1" v-if="v$.name.$error" severity="error" :closable="false">{{  v$.name.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="type">{{ $t('environment.form.type') }}</label>
                <Dropdown :disabled="editMode" id="type" v-model="type" :options="Object.values(EnvironmentTypeEnum)" :placeholder="$t('environment.form.typePlaceholder')" :invalid="v$.type.$error">
                    <template #value="slotProps">
                        <span v-if="slotProps.value" class="flex align-items-center">
                            <Chip  :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.value)" class="p-0 mr-2"/>
                            {{ $t(`environment.type.${slotProps.value}`) }}
                        </span>
                        <span v-else>{{ $t('environment.form.typePlaceholder') }}</span>
                    </template>

                    <template #option="slotProps">
                        <Chip  :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.option)" class="p-0 mr-2"/>
                        <span>{{ $t(`environment.type.${slotProps.option}`) }}</span>
                    </template>
                </Dropdown>
                <Message class="mt-1" v-if="v$.type.$error" severity="error" :closable="false">{{  v$.type.$errors[0].$message }}</Message>
            </div>
        </form>

        <template #footer>
            <Button :label="$t('general.buttons.save')" icon="pi pi-check" @click="createEnvironment" severity="success" :disabled="v$.$error" :loading="loading"/>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ErrorTitles, ICreatePersonalProtectiveEquipment, IPaginateQuery, PPETypeEnum } from '@visioscientiae/backoffice-packages-domo';

import { useVuelidate } from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { GenericPaginatedResponse } from '@/apis/utility/generic-response';
import { searchedText } from '@/utility/Table';
import { EnvironmentTypeEnum, ICreateEnvironment, IEnvironment, IUpdateEnvironment } from '@visioscientiae/backoffice-packages-domo/lib/esm/environment.interface';
import { useEnvironmentStore } from '@/stores/environment';
import { getEnvironmentTypeIcon } from '@/utility/Severity';

export default defineComponent({
    name: 'PPEFormModal',
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
            type: Object as PropType<IEnvironment>, 
            default: undefined,
        },
    },
    emits: ['update:showModal', 'update:editMode', 'refreshData'],
    data() {
        return {
            EnvironmentTypeEnum,

            environmentStore: useEnvironmentStore(),

            show: this.showModal,

            name: this.editMode ? this.oldData?.name : undefined as string|undefined,
            type: this.editMode ? this.oldData?.type : undefined as PPETypeEnum|undefined,

            loading: false as boolean,

            v$: useVuelidate(),

            searchedText,
            getEnvironmentTypeIcon
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
            this.$emit('update:editMode', false)
        },
        async createEnvironment() {
            this.v$.$validate();
            if (this.v$.$error) 
                return;

            this.loading = true;

            if(this.editMode) {
                const environmentToUpdate = {
                    name: this.name,
                } as IUpdateEnvironment;

                try {
                    await this.environmentStore.update(this.oldData?.id as string, environmentToUpdate);

                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('environment.toast.editSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('environment.toast.editFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            } else {
                const environment = {
                    name: this.name,
                    type: this.type,
                } as ICreateEnvironment;
    
                try {
                    await this.environmentStore.create(environment);
    
                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('environment.toast.createSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('environment.toast.createFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }
    
            }
            
            this.loading = false;
        }
    },
    watch: {
        async showModal(value) {
            this.show = value;
            
            if(value) {                
                this.name = this.editMode ? this.oldData?.name : undefined;
                this.type = this.editMode ? this.oldData?.type : undefined;

                this.loading = false;

                this.v$.$reset();
            }
        }
    },
    validations() {
        return {
            name: {
                required: helpers.withMessage(this.$t('environment.form.nameRequired'), required),
            },
            type: {
                required: helpers.withMessage(this.$t('environment.form.typeRequired'), requiredIf(!this.editMode)),
            },
        }
    },
});
</script>