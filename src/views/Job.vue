<template>
    <section class="section section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew" style="background: #05395f"></div>
        <div class="container">
            <card class="border-0" shadow body-classes="p-3">
                <div class="card-header" style="background-color: transparent">
                    Job - Save
                </div>
                <div class="card-body">
                    <ValidationObserver ref="observer" v-slot="{ passes }">
                        <form id="jobForm" name="jobForm"
                              @submit.prevent="passes(saveJob)">
                            <div class="row">
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <multiselect v-model="valueProject"
                                                     :options="optionsProject"
                                                     :multiple="false" :close-on-select="true"
                                                     :clear-on-select="false"
                                                     :preserve-search="true"
                                                     placeholder="Project"
                                                     label="name" track-by="name"
                                                     :preselect-first="false">
                                        </multiselect>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <multiselect v-model="value" :options="options"
                                                     :multiple="true" :close-on-select="false"
                                                     :clear-on-select="false"
                                                     :preserve-search="true"
                                                     placeholder="Select Host"
                                                     label="name" track-by="name"
                                                     :preselect-first="false">
                                        </multiselect>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                            <hr/>
                            <div class="row" v-for="(input, index) in inputs"
                                 v-bind:key="index">
                                <div class="col-md-6">
                                    <base-input type="text" name="downloadUrl" alternative
                                                placeholder="File Download Adress"
                                                v-model="input.downloadUrl"/>
                                </div>
                                <div class="col-md-4">
                                    <base-input type="text" name="uploadPath" alternative
                                                placeholder="File Upload Path"
                                                v-model="input.uploadPath"/>
                                </div>
                                <div class="col-md-2">
                                    <base-button type="danger" size="sm"
                                                 @click="deleteRow(index)">Delete
                                    </base-button>
                                </div>
                            </div>
                            <base-button type="secondary" size="sm"
                                         @click="addRow">Add
                                file
                            </base-button>
                            <hr/>
                            <div class="row">
                                <div class="col-md-6">
                                    <div>
                                        <base-checkbox class="mb-3" v-model="autoStart">
                                            Auto Start
                                        </base-checkbox>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-success btn-sm" type="submit">Save</button>
                        </form>
                    </ValidationObserver>
                </div>
                <div class="card-footer" style="background-color: transparent">
                    <base-alert :type="successful ? 'success' : 'default'" v-if="message"
                                dismissible>
                        <span class="alert-inner-text"><strong>{{message}}</strong></span>
                    </base-alert>
                </div>
            </card>
            <hr/>
            <card class="border-0" shadow body-classes="pt-3">
                <div class="card-header" style="background-color: transparent">
                    Job - List
                </div>
                <div class="card-body">
                    <vuetable ref="vuetable"
                              :api-mode="false"
                              :css="css.table"
                              :sort-order="sortOrder"
                              :fields="fields"
                              :per-page="perPage"
                              :data-manager="dataManager"
                              pagination-path="pagination"
                              @vuetable:pagination-data="onPaginationData">
                        <div slot="actions" slot-scope="props">
                            <base-button type="primary" size="sm"
                                         v-on:click="startJob(props.rowData)">
                                Upload
                            </base-button>
                            <base-button type="primary" size="sm"
                                         v-on:click="startDownload(props.rowData)">
                                Download
                            </base-button>
                            <base-button type="danger" size="sm"
                                         v-on:click="deleteJob(props.rowData)">
                                Delete
                            </base-button>
                            <base-button type="success" size="sm"
                                         v-on:click="detail(props.rowData)">
                                Detail
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
        <modal :show.sync="modals.modal" scrollable
               modal-classes="modal-dialog-centered modal-xl">
            <h6 slot="header" class="modal-title" id="modal-title-default">Job - Detail</h6>
            <div style="overflow: scroll;">
                <vuetable
                        :data=jobDestinationViewList
                        :fields=jobDestfields>
                </vuetable>
            </div>
        </modal>
    </section>
</template>

<script>
    import PublicService from "../services/public.service"
    import ProjectService from "../services/public.service.project";
    import VuetablePagination from "../components/VuetablePaginationBootstrap4.vue";
    import CssConfig from "../components/lib/VuetableConfig";
    import Modal from "@/components/Modal";
    import _ from "lodash";

    export default {
        name: 'job',

        components: {
            Modal,
            VuetablePagination
        },

        data() {
            return {
                perPage: 5,
                submitted: false,
                successful: false,
                autoStart: false,
                message: '',
                jobList: [],
                jobDestinationViewList: [],
                value: [],
                valueProject: [],
                options: [],
                optionsProject: [],
                inputs: [],
                appName: '',
                modals: {
                    modal: false,
                },

                fields: [
                    {
                        name: "createdBy",
                        title: '<i class="fa fa-user"></i>  Created By',
                        sortField: 'createdBy'
                    },
                    {
                        name: "createdDateTime",
                        title: '<i class="fa fa-clock-o"></i> Created time'
                    },
                    {
                        name: "jobStatus",
                        title: '<i class="fa fa-eye"></i> Job status',
                        formatter(value) {
                            return value === 0 ? 'Beklemede' : 'Tamamlandı'
                        }
                    },
                    {
                        name: "actions",
                        title: 'Actions'
                    }
                ],
                css: CssConfig,

                sortOrder: [
                    {field: 'createdBy', direction: 'asc'}
                ],

                jobDestfields: [
                    {
                        name: "downloadPath",
                        title: 'Download Path'
                    },
                    {
                        name: "download",
                        title: 'Download'
                    },
                    {
                        name: "downloadDateTime",
                        title: 'Download DateTime'
                    },
                    {
                        name: "downloadUrl",
                        title: 'Download Url'
                    },
                    {
                        name: "send",
                        title: 'Send'
                    },
                    {
                        name: "sendDateTime",
                        title: 'Send DateTime'
                    },
                ]

            };
        },

        watch: {
            // eslint-disable-next-line no-unused-vars
            jobList(newVal, oldVal) {
                this.$refs.vuetable.refresh();
            }
        },

        mounted() {
            this.reload();
        },

        methods: {

            getJobList() {
                PublicService.getJobList().then(
                    response => {
                        this.jobList = response.data.jobList;
                    },
                    error => {
                        this.jobList = error.response.data;
                    }
                );
            },

            getFtpServer() {
                PublicService.getFtpServer().then(
                    response => {
                        this.options = response.data.ftpServerList;
                    },
                    error => {
                        this.options = error.response.data;
                    }
                );
            },

            saveJob() {
                PublicService.saveJob({
                    "jobDto": {
                        "createdById": this.valueProject.id,
                        "createdBy": this.valueProject.name,
                        "autoStart": this.autoStart,
                    },
                    "ftpServerDestination": this.value,
                    "fileList": this.inputs
                }).then(
                    response => {
                        this.message = response.data;
                        this.reload();
                    },
                    error => {
                        this.message = error.message;
                    }
                );

            },

            startJob: function (fts) {
                PublicService.startJob(fts).then(
                    response => {
                        this.jobList = response.data.jobList;
                        this.reload();
                    },
                    error => {
                        this.jobList = error.response.data;
                    }
                );
            },

            startDownload: function (fts) {
                PublicService.startDownload(fts).then(
                    response => {
                        this.jobList = response.data.jobList;
                        this.reload();
                    },
                    error => {
                        this.jobList = error.response.data;
                    }
                );
            },

            deleteJob: function (fts) {
                PublicService.deleteJob(fts).then(
                    response => {
                        this.jobList = response.data.jobList;
                        this.reload();
                    },
                    error => {
                        this.jobList = error.response.data;
                    }
                );
            },

            detail: function (fts) {
                this.modals.modal = true;
                PublicService.detail(fts).then(
                    response => {
                        this.jobDestinationViewList = response.data.jobDestinationViewList;
                    },
                    error => {
                        this.jobDestinationViewList = error.response.data;
                    }
                );
            },

            checkFtpServer: function (ftpServerDto) {
                PublicService.checkFtpServer(ftpServerDto).then(
                    response => {
                        this.message = response;
                    },
                    error => {
                        this.message = error.message;
                    }
                );
            },

            addRow() {
                this.inputs.push({downloadUrl: '', uploadPath: ''})
            },

            deleteRow(index) {
                this.inputs.splice(index, 1)
            },

            getProject() {
                ProjectService.getProject().then(
                    response => {
                        this.optionsProject = response.data.projectList;
                    },
                    error => {
                        this.optionsProject = error.response.data;
                    }
                );
            },

            reload() {
                this.getJobList();
                this.getFtpServer();
                this.getProject();
            },

            onPaginationData(paginationData) {
                this.$refs.pagination.setPaginationData(paginationData);
            },

            onChangePage(page) {
                this.$refs.vuetable.changePage(page)
            },

            dataManager(sortOrder, pagination) {
                if (this.jobList.length < 1) return;

                let local = this.jobList;

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
                    this.perPage
                );

                let from = pagination.from - 1;
                let to = from + this.perPage;

                return {
                    pagination: pagination,
                    data: _.slice(local, from, to)
                };
            }
        }
    };
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>