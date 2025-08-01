<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="!editMode ? $t('sensor.add') : $t('sensor.edit')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <form>
            <div class="flex flex-column gap-2">
                <label for="identifierCode">{{ $t('sensor.form.identifierCode') }}</label>
                <div class="flex align-items-center justify-content-between gap-3">
                    <InputText :disabled="editMode" type="text" id="identifierCode" v-model="identifierCode" :placeholder="$t('sensor.form.identifierCodePlaceholder')" :invalid="v$.identifierCode.$error" />
                    <Button v-if="!editMode" label="Generate Code" class="p-1 w-6" raised @click="generateIdentifierCode"/>
                </div>
                <Message class="mt-1" v-if="v$.identifierCode.$error" severity="error" :closable="false">{{  v$.identifierCode.$errors[0].$message }}</Message>
            </div>
            
            <div class="flex flex-column gap-2 mt-3">
                <label for="iotDeviceId">{{ $t('sensor.form.iotDevice') }}<Badge :value="$t('general.optional')" severity="info" class="mx-2"></Badge></label>
                <Dropdown id="ppeId" v-model="iotDeviceToRelate" :options="paginatedIoTDevicesList.data" showClear :loading="loadingIoTDevices">
                    <template #header>
                        <div class="flex flex-column">
                            <InputText type="text" v-model="searchValue"  @input="onSearch(1)" class="m-2" :placeholder="$t('sensor.form.searchIoTDevice')"/>
                        </div>
                    </template>

                    <template #option="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <Chip  :image="'images/icons/IoT/' + getIoTDeviceTypeIcon(slotProps.option.type)" class="p-0"/>
                                <span>|</span>
                                <span v-html="searchedText(slotProps.option.identifierCode, searchValue as string)"></span>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <div v-if="paginatedIoTDevicesList.meta" class="flex justify-content-center align-items-center gap-2">
                            <Button :disabled="paginatedIoTDevicesList.meta?.currentPage <= 1" icon="pi pi-angle-left" @click="onSearch(paginatedIoTDevicesList.meta?.currentPage - 1)" />
                            <Button class="m-2" :disabled="paginatedIoTDevicesList.meta?.totalPages <= paginatedIoTDevicesList.meta?.currentPage" icon="pi pi-angle-right" @click="onSearch(paginatedIoTDevicesList.meta?.currentPage + 1)" />
                            </div>
                    </template>

                    <template #value="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <span v-if="slotProps.value">{{ slotProps.value.identifierCode }}</span>
                                <span v-else>{{ $t('sensor.form.iotDevicePlaceholder') }}</span>
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
            <Button :label="$t('general.buttons.save')" icon="pi pi-check" @click="createSensor" severity="success" :disabled="v$.$error" :loading="loading"/>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { ErrorTitles, ICreateIotDevice, ICreateSensor, IIotDevice, IotDeviceTypeEnum, IPaginateQuery, IPersonalProtectiveEquipment, ISensor, IUpdateSensor, IUser, PPETypeEnum, UserRoleEnum } from '@visioscientiae/backoffice-packages-domo';

import { useVuelidate } from '@vuelidate/core';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { GenericPaginatedResponse } from '@/apis/utility/generic-response';
import { useIoTDeviceStore } from '@/stores/iot';
import { useSensorStore } from '@/stores/sensor';
import { alphaNum, helpers, required } from '@vuelidate/validators';
import { getIoTDeviceTypeIcon } from '@/utility/Severity';
import { searchedText } from '@/utility/Table';

export default defineComponent({
    name: 'SensorFormModal',
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
            type: Object as PropType<ISensor>, 
            default: undefined,
        },
    },
    emits: ['update:showModal', 'update:editMode', 'refreshData'],
    data() {
        return {
            sensorStore: useSensorStore(),
            iotDeviceStore: useIoTDeviceStore(),

            searchValue: undefined as string|undefined,
            timer: undefined as any,

            show: this.showModal,

            paginatedIoTDevicesList: {} as GenericPaginatedResponse<IIotDevice[]>,

            identifierCode: this.editMode ? this.oldData?.identifierCode : undefined as string|undefined,
            iotDeviceToRelate: this.editMode ? this.oldData?.containedWithin : undefined as IIotDevice|undefined,

            loading: false as boolean,
            loadingIoTDevices: false as boolean,

            v$: useVuelidate(),

            getIoTDeviceTypeIcon,
            searchedText
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
                this.loadingIoTDevices = true;

                try{
                    this.paginatedIoTDevicesList = await this.iotDeviceStore.findPaginated({page: page ?? 1, limit: 10, search: this.searchValue, searchBy: ['identifierCode']} as IPaginateQuery);

                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('iot.toast.fetchFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            
                this.loadingIoTDevices = false;
            }, 500);
        },
        async createSensor() {
            this.v$.$validate();
            if (this.v$.$error) 
                return;

            this.loading = true;

            if(this.editMode) {
                const sensorToUpdate = {
                    iotDeviceId: this.iotDeviceToRelate?.id ?? null,
                } as IUpdateSensor;

                try {
                    await this.sensorStore.update(this.oldData?.id as string, sensorToUpdate);

                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('sensor.toast.editSuccess'), life: 3000 });

                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('sensor.toast.editFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            } else {
                const sensor = {
                    identifierCode: this.identifierCode,
                    iotDeviceId: this.iotDeviceToRelate?.id,
                } as ICreateSensor;
    
                try {
                    await this.sensorStore.create(sensor);
    
                    this.closeModal();
                    this.$toast.add({severity: 'success', summary: this.$t('sensor.toast.createSuccess'), life: 3000 });
    
                    this.$emit('refreshData');
                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('sensor.toast.createFailure'), err.detail, this.$toast);
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
        },
    },
    watch: {
        async showModal(value) {
            this.show = value;

            if(value) {
                await this.onSearch();

                this.identifierCode = this.editMode ? this.oldData?.identifierCode : undefined;
                this.iotDeviceToRelate = this.editMode ? this.oldData?.containedWithin : undefined;

                this.paginatedIoTDevicesList = {} as GenericPaginatedResponse<IIotDevice[]>;
                this.searchValue = undefined;

                this.loading = false;
                this.loadingIoTDevices = false;

                this.v$.$reset();
            }
        }
    },
    validations() {
        return {
            identifierCode: {
                required: helpers.withMessage(this.$t('sensor.form.identifierCodeRequired'), required),
                alphaNum: helpers.withMessage(this.$t('sensor.form.identifierCodeAlphaNumeric'), alphaNum),
                length: helpers.withMessage(this.$t('sensor.form.identifierCodeLength'), (value: string) => value.length === 8),
            }
        }
    },
});
</script>