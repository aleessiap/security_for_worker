<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="!editMode ? $t('ppe.add') : $t('ppe.edit')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <form>
            <div class="flex flex-column gap-2">
                <label for="name">{{ $t('ppe.form.name') }}</label>
                <InputText type="text" id="name" v-model="name" :placeholder="$t('ppe.form.namePlaceholder')" :invalid="v$.name.$error" />
                <Message class="mt-1" v-if="v$.name.$error" severity="error" :closable="false">{{  v$.name.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="type">{{ $t('ppe.form.type') }}</label>
                <Dropdown :disabled="editMode" id="type" v-model="type" :options="Object.values(PPETypeEnum)" :placeholder="$t('ppe.form.typePlaceholder')" :invalid="v$.type.$error">
                    <template #value="slotProps">
                        <span v-if="slotProps.value" class="flex align-items-center">
                            <Chip :image="'images/icons/PPE/' + getPPETypeIcon(slotProps.value)" class="p-0 mr-2"/>
                            {{ $t(`ppe.type.${slotProps.value}`) }}
                        </span>
                        <span v-else>{{ $t('ppe.form.typePlaceholder') }}</span>
                    </template>

                    <template #option="slotProps">
                        <Chip  :image="'images/icons/PPE/' + getPPETypeIcon(slotProps.option)" class="p-0 mr-2"/>
                        <span>{{ $t(`ppe.type.${slotProps.option}`) }}</span>
                    </template>
                </Dropdown>
                <Message class="mt-1" v-if="v$.type.$error" severity="error" :closable="false">{{  v$.type.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="available">{{ $t('ppe.form.available') }}</label>
                <InputSwitch v-model="available" />
            </div>
            
            <div class="flex flex-column gap-2 mt-3">
                <label for="userId">{{ $t('ppe.form.operator') }}<Badge :value="$t('general.optional')" severity="info" class="mx-2"></Badge></label>
                <Dropdown id="userId" v-model="userToRelate" :options="paginatedUserList.data" showClear :loading="loadingOperators">
                    <template #header>
                        <div class="flex flex-column">
                            <InputText type="text" v-model="searchValue" @input="onSearch(1)" class="m-2" :placeholder="$t('ppe.form.searchOperators')"/>
                        </div>
                    </template>

                    <template #option="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <span v-html="searchedText(slotProps.option.name, searchValue as string)"></span>
                                <span v-html="searchedText(slotProps.option.surname, searchValue as string)"></span>
                                <span>/</span>
                                <span v-html="searchedText(slotProps.option.email, searchValue as string)"></span>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <div v-if="paginatedUserList.meta" class="flex justify-content-center align-items-center gap-2">
                            <Button :disabled="paginatedUserList.meta?.currentPage <= 1" icon="pi pi-angle-left" @click="onSearch(paginatedUserList.meta?.currentPage - 1)" />
                            <Button class="m-2" :disabled="paginatedUserList.meta?.totalPages <= paginatedUserList.meta?.currentPage" icon="pi pi-angle-right" @click="onSearch(paginatedUserList.meta?.currentPage + 1)" />
                            </div>
                    </template>

                    <template #value="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <span v-if="slotProps.value">{{ slotProps.value.email }}</span>
                                <span v-else>{{ $t('ppe.form.operatorPlaceholder') }}</span>
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div>{{ $t('general.notFound') }}</div>
                    </template>
                </Dropdown>
            </div>
        </form>

        <template #footer>
            <Button :label="$t('general.buttons.save')" icon="pi pi-check" @click="createPPE" severity="success" :disabled="v$.$error" :loading="loading"/>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ErrorTitles, ICreatePersonalProtectiveEquipment, IPaginateQuery, IPersonalProtectiveEquipment, IUpdatePersonalProtectiveEquipment, IUser, PPETypeEnum, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

import { useVuelidate } from '@vuelidate/core';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { usePersonalProtectiveEquipmentStore } from '@/stores/ppe';
import { useUserStore } from '@/stores/user';
import { GenericPaginatedResponse } from '@/apis/utility/generic-response';
import { searchedText } from '@/utility/Table';
import { getPPETypeIcon } from '@/utility/Severity';

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
            type: Object as PropType<IPersonalProtectiveEquipment>, 
            default: undefined,
        },
    },
    emits: ['update:showModal', 'update:editMode', 'refreshData'],
    data() {
        return {
            PPETypeEnum,
            getPPETypeIcon,

            ppeStore: usePersonalProtectiveEquipmentStore(),
            userStore: useUserStore(),

            searchValue: undefined as string|undefined,
            timer: undefined as any,

            show: this.showModal,

            paginatedUserList: {} as GenericPaginatedResponse<IUser[]>,

            name: this.editMode ? this.oldData?.name : undefined as string|undefined,
            type: this.editMode ? this.oldData?.type : undefined as PPETypeEnum|undefined,
            available: this.editMode ? this.oldData?.available : true,
            userToRelate: this.editMode ? this.oldData?.belongsTo : undefined as IUser|undefined,

            loading: false as boolean,
            loadingOperators: false as boolean,

            v$: useVuelidate(),

            searchedText,
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
            this.$emit('update:editMode', false)
        },
        async onSearch(page?: number) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingOperators = true;

                try{
                    this.paginatedUserList = await this.userStore.findPaginatedOperators({page: page ?? 1, limit: 15, search: this.searchValue, searchBy: ['email', 'name', 'surname']} as IPaginateQuery);

                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('operator.toast.fetchFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            
                this.loadingOperators = false;
            }, 500);
        },
        async createPPE() {
            this.v$.$validate();
            if (this.v$.$error) 
                return;

            this.loading = true;

            if(this.editMode) {
                const ppeToUpdate = {
                    name: this.name,
                    available: this.available,
                    userId: this.userToRelate?.id ?? null,
                } as IUpdatePersonalProtectiveEquipment;

                try {
                    await this.ppeStore.update(this.oldData?.id as string, ppeToUpdate);

                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('ppe.toast.editSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('ppe.toast.editFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            } else {
                const ppe = {
                    name: this.name,
                    type: this.type,
                    available: this.available,
                    userId: this.userToRelate?.id,
                } as ICreatePersonalProtectiveEquipment;
    
                try {
                    await this.ppeStore.create(ppe);
    
                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('ppe.toast.createSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('ppe.toast.createFailure'), err.detail, this.$toast);
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
                await this.onSearch();
                
                this.name = this.editMode ? this.oldData?.name : undefined;
                this.type = this.editMode ? this.oldData?.type : undefined;
                this.available = this.editMode ? this.oldData?.available : true;
                this.userToRelate = this.editMode ? this.oldData?.belongsTo : undefined;

                this.paginatedUserList = {} as GenericPaginatedResponse<IUser[]>;
                this.searchValue = undefined;

                this.loading = false;
                this.loadingOperators = false;

                this.v$.$reset();
            }
        }
    },
    validations() {
        return {
            name: {
                required: helpers.withMessage(this.$t('ppe.form.nameRequired'), required),
            },
            type: {
                required: helpers.withMessage(this.$t('ppe.form.typeRequired'), requiredIf(!this.editMode)),
            },
        }
    },
});
</script>