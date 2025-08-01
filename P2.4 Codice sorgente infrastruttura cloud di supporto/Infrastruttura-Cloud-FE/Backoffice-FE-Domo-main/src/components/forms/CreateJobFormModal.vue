<template>
    <Dialog v-model:visible="show" :style="{ width: '450px' }" :header="$t('job.add')" :modal="true" class="p-fluid" :draggable="false" :closeOnEscape="false">
        <template #closeicon>
            <Button icon="pi pi-times" class="p-button-text" severity="contrast" @click="closeModal" />
        </template>

        <form>
            <div class="flex flex-column gap-2">
                <label for="name">{{ $t('job.form.name') }}</label>
                <InputText type="text" id="name" v-model="name" :placeholder="$t('job.form.namePlaceholder')" :invalid="v$.name.$error" />
                <Message class="mt-1" v-if="v$.name.$error" severity="error" :closable="false">{{ v$.name.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="ppeId">{{ $t('iot.form.environment') }}</label>
                <Dropdown id="ppeId" v-model="choosenEnvironment" :options="paginatedEnvironmentList.data" showClear :loading="loadingEnvironments" :invalid="v$.choosenEnvironment.$error">
                    <template #header>
                        <div class="flex flex-column">
                            <InputText type="text" v-model="searchEnvironmentsValue"  @input="onSearchEnvironments(1)" class="m-2" :placeholder="$t('iot.form.searchEnvironments')"/>
                        </div>
                    </template>

                    <template #option="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <Chip  :image="'images/icons/Environment/' + getEnvironmentTypeIcon(slotProps.option.type)" class="p-0"/>
                                <span>|</span>
                                <span v-html="searchedText(slotProps.option.name, searchEnvironmentsValue as string)"></span>
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
                                <span v-else>{{ $t('job.form.environmentPlaceholder') }}</span>
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div>{{ $t('general.notFound') }}</div>
                    </template>
                </Dropdown>
                <Message class="mt-1" v-if="v$.choosenEnvironment.$error" severity="error" :closable="false">{{ v$.choosenEnvironment.$errors[0].$message }}</Message>
            </div>

            <div class="flex flex-column gap-2 mt-3">
                <label for="userId">{{ $t('ppe.form.operator') }}</label>
                <Dropdown id="userId" v-model="choosenOperator" :options="paginatedOperatorsList.data" showClear :loading="loadingOperators" :invalid="v$.choosenOperatorsList.$error">
                    <template #header>
                        <div class="flex flex-column">
                            <InputText type="text" v-model="searchOperatorsValue" @input="onSearchOperators(1)" class="m-2" :placeholder="$t('ppe.form.searchOperators')"/>
                        </div>
                    </template>

                    <template #option="slotProps">
                        <div class="flex justify-content-between align-items-center p-1">
                            <div v-if="!choosenOperatorsList.find((op) => op.id === slotProps.option.id)" class="flex align-items-center gap-2">
                                <span v-html="searchedText(slotProps.option.name, searchOperatorsValue as string)"></span>
                                <span v-html="searchedText(slotProps.option.surname, searchOperatorsValue as string)"></span>
                                <span>/</span>
                                <span v-html="searchedText(slotProps.option.email, searchOperatorsValue as string)"></span>
                            </div>
                            <div v-else class="flex align-items-center gap-2 p-1 bg-primary border-round">
                                <i class="pi pi-check"></i>
                                <span v-html="searchedText(slotProps.option.name, searchOperatorsValue as string)"></span>
                                <span v-html="searchedText(slotProps.option.surname, searchOperatorsValue as string)"></span>
                                <span>/</span>
                                <span v-html="searchedText(slotProps.option.email, searchOperatorsValue as string)"></span>
                            </div>
                        </div>
                    </template>

                    <template #footer>
                        <div v-if="paginatedOperatorsList.meta" class="flex justify-content-center align-items-center gap-2">
                            <Button :disabled="paginatedOperatorsList.meta?.currentPage <= 1" icon="pi pi-angle-left" @click="onSearchOperators(paginatedOperatorsList.meta?.currentPage - 1)" />
                            <Button class="m-2" :disabled="paginatedOperatorsList.meta?.totalPages <= paginatedOperatorsList.meta?.currentPage" icon="pi pi-angle-right" @click="onSearchOperators(paginatedOperatorsList.meta?.currentPage + 1)" />
                            </div>
                    </template>

                    <template #value="slotProps">
                        <div class="flex justify-content-between align-items-center">
                            <div class="flex align-items-center gap-2">
                                <span v-if="slotProps.value">{{ slotProps.value.email }}</span>
                                <span v-else>{{ $t('job.form.operatorsPlaceholder') }}</span>
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div>{{ $t('general.notFound') }}</div>
                    </template>
                </Dropdown>
                <Message class="mt-1" v-if="v$.choosenOperatorsList.$error" severity="error" :closable="false">{{ v$.choosenOperatorsList.$errors[0].$message }}</Message>
            </div>

            <div v-if="choosenOperatorsList.length > 0" class="card p-0 mt-4 flip animation-duration-800">
                <span class="bg-primary card p-1 mb-2 flex flex-grow-1 justify-content-center text-xl">
                    {{ $t('job.form.selectedOperators') }} - <Badge :value="choosenOperatorsList.length" severity="secondary" class="mx-2"></Badge>
                </span>
                <ScrollPanel style="height: 200px" :pt="{bary: 'hover:bg-primary-400 bg-primary-300 opacity-100'}">
                    <div v-for="operator in choosenOperatorsList" class="flex align-items-center justify-content-between p-3">
                        <div class="flex flex-column">
                            <span><i class="pi pi-user mr-1"></i>{{ operator.name }} {{ operator.surname }}</span>
                            <span><i class="pi pi-envelope mr-1"></i>{{ operator.email }}</span>
                        </div>
                        <Button icon="pi pi-times" class="p-button-text" @click="choosenOperatorsList = choosenOperatorsList.filter((op) => op.id !== operator.id)"/>
                    </div>
                </ScrollPanel>
            </div>
        </form>

        <template #footer>
            <Button :label="$t('general.buttons.save')" icon="pi pi-check" severity="success" :disabled="v$.$error" :loading="loading" @click="createJob"/>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useVuelidate } from '@vuelidate/core';
import { searchedText } from '@/utility/Table';
import { HttpErrorToast } from '@/utility/ErrorsHandler';
import { ErrorTitles, ICreateJob, IEnvironment, IPaginateQuery, IUser } from '@visioscientiae/backoffice-packages-domo';
import { getEnvironmentTypeIcon } from '@/utility/Severity';
import { useEnvironmentStore } from '@/stores/environment';
import { GenericPaginatedResponse } from '@/apis/utility/generic-response';
import { useUserStore } from '@/stores/user';
import { helpers, required } from '@vuelidate/validators';
import { useJobStore } from '@/stores/job';
 
export default defineComponent({
    name: 'CreateJobFormModal',
    props: {
        showModal: {
            type: Boolean,
            required: true,
        },
    },
    emits: ['update:showModal', 'refreshData'],
    data() {
        return {
            environmentStore: useEnvironmentStore(),
            operatorStore: useUserStore(),
            jobStore: useJobStore(),

            show: this.showModal,

            enironmentsTimer: undefined as any,
            operatorsTimer: undefined as any,

            name: undefined as string|undefined,

            paginatedEnvironmentList: {} as GenericPaginatedResponse<IEnvironment[]>,
            choosenEnvironment: undefined as IEnvironment|undefined,

            paginatedOperatorsList: {} as GenericPaginatedResponse<IUser[]>,
            choosenOperator: undefined as IUser|undefined,
            choosenOperatorsList: [] as IUser[],

            loading: false as boolean,
            loadingEnvironments: false as boolean,
            loadingOperators: false as boolean,

            searchEnvironmentsValue: undefined as string|undefined,
            searchOperatorsValue: undefined as string|undefined,

            v$: useVuelidate(),

            searchedText,
            getEnvironmentTypeIcon
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:showModal', false);
        },
        async onSearchEnvironments(page?: number) {
            clearTimeout(this.enironmentsTimer);
            this.enironmentsTimer = setTimeout(async () => {
                this.loadingEnvironments = true;

                try{
                    this.paginatedEnvironmentList = await this.environmentStore.findPaginated({page: page ?? 1, limit: 15, search: this.searchEnvironmentsValue, searchBy: ['name']} as IPaginateQuery);

                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('environment.toast.fetchFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

                this.loadingEnvironments = false;
            }, 500);
        },
        async onSearchOperators(page?: number) {
            clearTimeout(this.operatorsTimer);
            this.operatorsTimer = setTimeout(async () => {
                this.loadingOperators = true;

                try{    
                    this.paginatedOperatorsList = await this.operatorStore.findPaginatedFreeOperators({page: page ?? 1, limit: 15, search: this.searchOperatorsValue, searchBy: ['email', 'name', 'surname'], 'filter.ppeList.id': '$not:$null'} as IPaginateQuery);

                } catch (err: any) {
                    if (err.title && Object.values(ErrorTitles).includes(err.title))
                        HttpErrorToast(this.$t('operator.toast.fetchFailure'), err.detail, this.$toast);
                    else
                        HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
                }

            
                this.loadingOperators = false;
            }, 500);
        },
        async createJob() {
            this.v$.$validate();
            if (this.v$.$error) 
                return;

            this.loading = true;

            const job = {
                name: this.name,
                operatorsIdsList: this.choosenOperatorsList.map((op) => op.id),
                environmentId: this.choosenEnvironment?.id,
            } as ICreateJob; 

            try {
                await this.jobStore.create(job);

                this.closeModal()
                this.$toast.add({severity: 'success', summary: this.$t('job.toast.createSuccess'), life: 3000 });

                this.$emit('refreshData');            
            } catch (err: any) {
                if (err.title && Object.values(ErrorTitles).includes(err.title))
                    HttpErrorToast(this.$t('job.toast.createFailure'), err.detail, this.$toast);
                else
                    HttpErrorToast(this.$t('general.errorNotExpected'), this.$t('general.errorServer'), this.$toast);           
            }

            this.loading = false;
        }
    },
    watch: {
        async showModal(value) {
            this.show = value;

            if(value) {
                this.loading = false;
                this.loadingEnvironments = false;
                this.loadingOperators = false;

                this.name = undefined;

                this.paginatedEnvironmentList = {} as GenericPaginatedResponse<IEnvironment[]>;
                this.choosenEnvironment = undefined;

                this.paginatedOperatorsList = {} as GenericPaginatedResponse<IUser[]>;
                this.choosenOperator = undefined;

                this.choosenOperatorsList = [];

                this.searchEnvironmentsValue = undefined;
                this.searchOperatorsValue = undefined;

                this.enironmentsTimer = undefined;
                this.operatorsTimer = undefined;

                this.v$.$reset();

                await this.onSearchEnvironments(1);
                await this.onSearchOperators(1);
            }
        },
        choosenOperator(value) {
            if(value) {
                if(!this.choosenOperatorsList.find((op) => op.id === value.id))
                    this.choosenOperatorsList.push(value);
                
                this.choosenOperator = undefined;
            }
        },
    },
    validations() {
        return {
            name: {
                required: helpers.withMessage(this.$t('job.form.nameRequired'), required),
            },
            choosenEnvironment: {
                required: helpers.withMessage(this.$t('job.form.environmentRequired'), required),
            },
            choosenOperatorsList: {
                required: helpers.withMessage(this.$t('job.form.operatorsRequired'), (value: any) => value.length > 0),
            },
        }
    },
});
</script>