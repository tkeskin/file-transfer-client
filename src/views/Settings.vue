<template>
    <section class="section section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew" style="background: #05395f"></div>
        <div class="container">
            <card class="border-0" shadow body-classes="p-3">
                <div class="card-header" style="background-color: transparent">
                    Config - Save
                </div>
                <div class="card-body">
                    <ValidationObserver ref="observer" v-slot="{ passes }">
                        <form id="ftpServerForm" name="form"
                              @submit.prevent="passes(saveProject)"
                              @reset="resetForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="configKey"
                                                    alternative placeholder="Key"
                                                    v-model="appConfigDto.configKey"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="configValue"
                                                    alternative placeholder="Value"
                                                    v-model="appConfigDto.configValue"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                            <hr/>
                            <button class="btn btn-success btn-sm" type="submit">Save</button>
                            <button class="btn btn-danger btn-sm" type="reset">Reset</button>
                        </form>
                    </ValidationObserver>
                </div>
            </card>
            <hr/>
            <card class="border-0" shadow body-classes="pt-3">
                <div class="card-header" style="background-color: transparent">
                    Config - List
                </div>
                <div class="card-body">
                    <vuetable ref="vuetable"
                              :api-mode="false"
                              :css="css.table"
                              :fields="appConfigFields"
                              :per-page="css.perPage"
                              :data-manager="dataManager"
                              pagination-path="pagination"
                              @vuetable:pagination-data="onPaginationData">
                        <div slot="actions" slot-scope="props">
                            <base-button type="primary" size="sm"
                                         v-on:click="editProject(props.rowData)">
                                Edit
                            </base-button>
                            <base-button type="danger" size="sm"
                                         v-on:click="deleteProject(props.rowData)">
                                Delete
                            </base-button>
                        </div>
                    </vuetable>
                    <div style="margin-top:10px">
                        <vuetable-pagination ref="pagination"
                                             class="pull-right"
                                             :css="css.pagination"
                                             @vuetable-pagination:change-page="onChangePage">
                        </vuetable-pagination>
                    </div>
                </div>
            </card>
        </div>
    </section>
</template>

<script>
    import AppConfigDto from '../models/app-config';
    import AppConfigService from "../services/appconfig.service"
    import TableConfig from "../components/lib/tableConfig";
    import SwalConfig from "../components/lib/swalConfig";
    import _ from "lodash";

    export default {
        name: 'app-config',

        data() {
            return {
                css: TableConfig,
                swalConfig: SwalConfig,
                appConfigDto: new AppConfigDto('', ''),
                submitted: false,
                successful: false,
                message: '',
                appConfigList: [],
                appConfigFields: [
                    {
                        name: "configKey",
                        title: '<i class="fa fa-at"></i> Key'
                    },
                    {
                        name: "configValue",
                        title: '<i class="fa fa-location-arrow"></i> Value'
                    },
                    {
                        name: "actions",
                        title: 'Actions'
                    }
                ]
            };
        },

        watch: {
            // eslint-disable-next-line no-unused-vars
            appConfigList(newVal, oldVal) {
                this.$refs.vuetable.refresh();
            }
        },

        mounted() {
            this.getProject();
        },

        methods: {

            getProject() {
                AppConfigService.getAppConfig().then(
                    response => {
                        this.appConfigList = response.data.appConfigList;
                    },
                    error => {
                        this.appConfigList = error.response.data;
                    }
                );
            },

            saveProject() {
                this.$swal(this.swalConfig.confirm).then((result) => {
                    if (result.value) {
                        AppConfigService.saveAppConfig(this.appConfigDto).then(
                            response => {
                                this.message = response.data;
                                this.getProject();
                                this.resetForm();
                                this.$swal(this.swalConfig.successToast);
                            },
                            error => {
                                this.message = error.message;
                                this.$swal(this.swalConfig.errorToast);
                            }
                        );
                    } else {
                        this.$swal.close();
                        //this.$swal('Cancelled', '', 'info')
                    }
                })
            },

            editProject: function (p) {
                this.appConfigDto.configKey = p.configKey;
                this.appConfigDto.configValue = p.configValue;
            },

            deleteProject: async function (p) {
                await
                    this.$swal(this.swalConfig.confirm).then((result) => {
                        if (result.value) {
                            AppConfigService.deleteAppConfig(p).then(
                                response => {
                                    this.appConfigList = response.data;
                                    this.getProject();
                                    this.resetForm();
                                    this.$swal(this.swalConfig.successToast)
                                },
                                error => {
                                    this.appConfigList = error.response.data;
                                }
                            );

                        } else {
                            this.$swal.close();
                            //this.$swal('Cancelled', '', 'info')
                        }
                    })

            },

            resetForm() {
                this.appConfigDto.configKey = "";
                this.appConfigDto.configValue = "";
                requestAnimationFrame(() => {
                    this.$refs.observer.reset();
                });
            },

            onPaginationData(paginationData) {
                this.$refs.pagination.setPaginationData(paginationData);
            },

            onChangePage(page) {
                this.$refs.vuetable.changePage(page)
            },

            dataManager(sortOrder, pagination) {
                if (this.appConfigList.length < 1) return;

                let local = this.appConfigList;

                // sortOrder can be empty, so we have to check for that as well
                if (sortOrder.length > 0) {
                    local = _.orderBy(
                        local,
                        sortOrder[0].sortField,
                        sortOrder[0].direction
                    );
                }


                pagination = this.$refs.vuetable.makePagination(
                    local.length,
                    this.css.perPage
                );

                let from = pagination.from - 1;
                let to = from + this.css.perPage;

                return {
                    pagination: pagination,
                    data: _.slice(local, from, to)
                };
            },
        }
    };
</script>