<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="!editMode ? $t('iot.add') : $t('iot.edit')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <form>
            <div class="flex flex-column gap-2">
                <label for="identifierCode">{{ $t('iot.form.identifierCode') }}</label>
                <div class="flex align-items-center justify-content-between gap-3">
                    <InputText :disabled="editMode" type="text" id="identifierCode" v-model="identifierCode" :placeholder="$t('iot.form.identifierCodePlaceholder')" :invalid="v$.identifierCode.$error" />
                    <Button v-if="!editMode" label="Generate Code" class="p-1 w-6" raised @click="generateIdentifierCode"/>
                </div>
                <Message class="mt-1" v-if="v$.identifierCode.$error" severity="error" :closable="false">{{  v$.identifierCode.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="type">{{ $t('iot.form.type') }}</label>
                <Dropdown :disabled="editMode" id="type" v-model="type" :options="Object.values(IotDeviceTypeEnum)" :placeholder="$t('iot.form.typePlaceholder')" :invalid="v$.type.$error">
                    <template #value="slotProps">
                            <span v-if="slotProps.value" class="flex align-items-center">
                                <Chip :image="'images/icons/IoT/' + getIoTDeviceTypeIcon(slotProps.value)" class="p-0 mr-2"/>
                                {{ $t(`iot.type.${slotProps.value}`) }}
                            </span>
                            <span v-else>{{ $t('iot.form.typePlaceholder') }}</span>
                    </template>

                    <template #option="slotProps">
                        <Chip :image="'images/icons/IoT/' + getIoTDeviceTypeIcon(slotProps.option)" class="p-0 mr-2"/>
                        <span>{{ $t(`iot.type.${slotProps.option}`) }}</span>
                    </template>
                </Dropdown>
                <Message class="mt-1" v-if="v$.type.$error" severity="error" :closable="false">{{  v$.type.$errors[0].$message }}</Message>
            </div>

            <div v-if="type === IotDeviceTypeEnum.OPERATOR" class="flex flex-column gap-2 mt-3">
                <label for="ppeId">{{ $t('iot.form.ppe') }}<Badge :value="$t('general.optional')" severity="info" class="mx-2"></Badge></label>
                <Dropdown id="ppeId" v-model="objectToRelate" :options="paginatedPPElist.data" showClear :loading="loadingPPEs">
                    <template #header>
                        <div class="flex flex-column">
                            <InputText type="text" v-model="searchValue"  @input="onSearchPPEs(1)" class="m-2" :placeholder="$t('iot.form.searchPPEs')"/>
                        </div>
                    </template>

                    <template #option="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <Chip  :image="'images/icons/PPE/' + getPPETypeIcon(slotProps.option.type)" class="p-0"/>
                                <span>|</span>
                                <span v-html="searchedText(slotProps.option.name, searchValue as string)"></span>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <div v-if="paginatedPPElist.meta" class="flex justify-content-center align-items-center gap-2">
                            <Button :disabled="paginatedPPElist.meta?.currentPage <= 1" icon="pi pi-angle-left" @click="onSearchPPEs(paginatedPPElist.meta?.currentPage - 1)" />
                            <Button class="m-2" :disabled="paginatedPPElist.meta?.totalPages <= paginatedPPElist.meta?.currentPage" icon="pi pi-angle-right" @click="onSearchPPEs(paginatedPPElist.meta?.currentPage + 1)" />
                            </div>
                    </template>

                    <template #value="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <span v-if="slotProps.value">{{ slotProps.value.name }}</span>
                                <span v-else>{{ $t('iot.form.ppePlaceholder') }}</span>
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div>{{ $t('general.notFound') }}</div>
                    </template>
                </Dropdown>
            </div>

            <div v-if="type === IotDeviceTypeEnum.ENVIROMENT" class="flex flex-column gap-2 mt-3">
                <label for="ppeId">{{ $t('iot.form.environment') }}<Badge :value="$t('general.optional')" severity="info" class="mx-2"></Badge></label>
                <Dropdown id="ppeId" v-model="objectToRelate" :options="paginatedEnvironmentList.data" showClear :loading="loadingEnvironments">
                    <template #header>
                        <div class="flex flex-column">
                            <InputText type="text" v-model="searchValue"  @input="onSearchEnvironments(1)" class="m-2" :placeholder="$t('iot.form.searchEnvironments')"/>
                        </div>
                    </template>

                    <template #option="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <Chip  :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.option.type)" class="p-0"/>
                                <span>|</span>
                                <span v-html="searchedText(slotProps.option.name, searchValue as string)"></span>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <div v-if="paginatedEnvironmentList.meta" class="flex justify-content-center align-items-center gap-2">
                            <Button :disabled="paginatedEnvironmentList.meta?.currentPage <= 1" icon="pi pi-angle-left" @click="onSearchEnvironments(paginatedEnvironmentList.meta?.currentPage - 1)" />
                            <Button class="m-2" :disabled="paginatedEnvironmentList.meta?.totalPages <= paginatedEnvironmentList.meta?.currentPage" icon="pi pi-angle-right" @click="onSearchEnvironments(paginatedEnvironmentList.meta?.currentPage + 1)" />
                            </div>
                    </template>

                    <template #value="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <span v-if="slotProps.value">{{ slotProps.value.name }}</span>
                                <span v-else>{{ $t('iot.form.searchEnvironments') }}</span>
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
            <Button :label="$t('general.buttons.save')" icon="pi pi-check" @click="createIoTDevice" severity="success" :disabled="v$.$error" :loading="loading"/>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ErrorTitles, ICreateIotDevice, ICreatePersonalProtectiveEquipment, IIotDevice, IotDeviceTypeEnum, IPaginateQuery, IPersonalProtectiveEquipment, IUpdateIotDevice, IUser, PPETypeEnum, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

import { useVuelidate } from '@vuelidate/core';
import { alphaNum, helpers, required, requiredIf } from '@vuelidate/validators';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { usePersonalProtectiveEquipmentStore } from '@/stores/ppe';
import { GenericPaginatedResponse } from '@/apis/utility/generic-response';
import { useIoTDeviceStore } from '@/stores/iot';
import { searchedText } from '@/utility/Table';
import { getEnvironmentTypeIcon, getIoTDeviceTypeIcon, getPPETypeIcon } from '@/utility/Severity';
import { IEnvironment } from '@visioscientiae/backoffice-packages-domo/lib/esm/environment.interface';
import { useEnvironmentStore } from '@/stores/environment';

export default defineComponent({
    name: 'IoTDeviceFormModal',
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
            type: Object as PropType<IIotDevice>, 
            default: undefined,
        },
    },
    emits: ['update:showModal', 'update:editMode', 'refreshData'],
    data() {
        return {
            IotDeviceTypeEnum,

            ppeStore: usePersonalProtectiveEquipmentStore(),
            environmentStore: useEnvironmentStore(),
            iotDeviceStore: useIoTDeviceStore(),
            
            searchValue: undefined as string|undefined,
            timer: undefined as any,

            show: this.showModal,

            paginatedPPElist: {} as GenericPaginatedResponse<IPersonalProtectiveEquipment[]>,
            paginatedEnvironmentList: {} as GenericPaginatedResponse<IEnvironment[]>,

            identifierCode: this.editMode ? this.oldData?.identifierCode : undefined as string|undefined,
            type: this.editMode ? this.oldData?.type : undefined as IotDeviceTypeEnum|undefined,
            objectToRelate: this.editMode ? this.oldData?.installedOn : undefined as IPersonalProtectiveEquipment|IEnvironment|undefined,

            loading: false as boolean,
            loadingPPEs: false as boolean,
            loadingEnvironments: false as boolean,

            v$: useVuelidate(),

            searchedText,
            getPPETypeIcon,
            getEnvironmentTypeIcon,
            getIoTDeviceTypeIcon
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
            this.$emit('update:editMode', false)
        },
        async onSearchPPEs(page?: number) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingPPEs = true;

                try{
                    this.paginatedPPElist = await this.ppeStore.findPaginated({page: page ?? 1, limit: 15, search: this.searchValue, searchBy: ['identifierCode', 'installedOn.name'], 'filter.installedDevice.ppeId': '$null'} as IPaginateQuery);

                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('ppe.toast.fetchFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            
                this.loadingPPEs = false;
            }, 500);
        },
        async onSearchEnvironments(page?: number) {
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                this.loadingEnvironments = true;

                try{
                    this.paginatedEnvironmentList = await this.environmentStore.findPaginated({page: page ?? 1, limit: 15, search: this.searchValue, searchBy: ['name'], 'filter.installedDevice.environmentId': '$null'} as IPaginateQuery);

                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('environment.toast.fetchFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

                this.loadingEnvironments = false;
            }, 500);
        },
        async createIoTDevice() {
            this.v$.$validate();
            if (this.v$.$error) 
                return;

            this.loading = true;

            if(this.editMode) {
                const iotDeviceToUpdate = {
                    ppeId: this.oldData?.type === IotDeviceTypeEnum.OPERATOR ? (this.objectToRelate?.id ?? null) : undefined,
                    environmentId: this.oldData?.type === IotDeviceTypeEnum.ENVIROMENT ? (this.objectToRelate?.id ?? null) : null,
                } as IUpdateIotDevice;

                try {
                    await this.iotDeviceStore.update(this.oldData?.id as string, iotDeviceToUpdate);

                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('iot.toast.editSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('iot.toast.editFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            } else {
                const iotDevice = {
                    identifierCode: this.identifierCode,
                    type: this.type,
                } as ICreateIotDevice;

                if(this.type === IotDeviceTypeEnum.OPERATOR)
                    iotDevice.ppeId = this.objectToRelate?.id;
                else if(this.type === IotDeviceTypeEnum.ENVIROMENT)
                    iotDevice.environmentId = this.objectToRelate?.id;
    
                try {
                    await this.iotDeviceStore.create(iotDevice);
    
                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('iot.toast.createSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('iot.toast.createFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }
            }

            this.loading = false;
        },
        generateIdentifierCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            this.identifierCode = result;
        }
    },
    watch: {
        async showModal(value) {
            this.show = value;
            
            if(value) {
                this.identifierCode = this.editMode ? this.oldData?.identifierCode : undefined,
                this.type = this.editMode ? this.oldData?.type : undefined,
                this.objectToRelate = this.editMode ? this.oldData?.installedOn : undefined,

                this.paginatedPPElist = {} as GenericPaginatedResponse<IPersonalProtectiveEquipment[]>;
                this.searchValue = undefined;

                this.loading = false;
                this.loadingPPEs = false;

                if(this.oldData?.type === IotDeviceTypeEnum.OPERATOR)
                    this.onSearchPPEs(1);
                else if(this.oldData?.type === IotDeviceTypeEnum.ENVIROMENT)
                    this.onSearchEnvironments(1);

                this.v$.$reset();
            }
        },
        async type(value) {
            if(value === IotDeviceTypeEnum.OPERATOR) {
                this.paginatedPPElist = {} as GenericPaginatedResponse<IPersonalProtectiveEquipment[]>;
                this.searchValue = undefined;

                if(!this.editMode)
                    this.objectToRelate = undefined;
                
                    this.onSearchPPEs(1);
            } else if(value === IotDeviceTypeEnum.ENVIROMENT) {
                this.paginatedEnvironmentList = {} as GenericPaginatedResponse<IEnvironment[]>;
                this.searchValue = undefined;

                if(!this.editMode)
                    this.objectToRelate = undefined;

                this.onSearchEnvironments(1);
            }
        }
    },
    validations() {
        return {
            identifierCode: {
                required: helpers.withMessage(this.$t('iot.form.identifierCodeRequired'), requiredIf(!this.editMode)),
                alphaNum: helpers.withMessage(this.$t('iot.form.identifierCodeAlphaNumeric'), alphaNum),
                length: helpers.withMessage(this.$t('iot.form.identifierCodeLength'), (value: string) => value.length === 8),
            },
            type: {
                required: helpers.withMessage(this.$t('iot.form.typeRequired'), required),
            },
        }
    },
});
</script>