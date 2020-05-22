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
                        <span class="alert-inner--text"><strong>{{message}}</strong></span>
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
                              :data=jobList
                              :fields=fields>
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
                            <base-button type="danger" size="sm"
                                         v-on:click="sse(props.rowData)">
                                sse
                            </base-button>
                        </div>
                    </vuetable>
                </div>
                <div class="card-footer" style="background-color: transparent">
                </div>
            </card>

        </div>
    </section>
</template>

<script>
    import PublicService from "../services/public.service"
    import ProjectService from "../services/public.service.project";

    export default {
        name: 'job',
        data() {
            return {
                submitted: false,
                successful: false,
                autoStart: false,
                message: '',
                jobList: [],
                value: [],
                valueProject: [],
                options: [],
                optionsProject: [],
                inputs: [],
                appName: '',
                fields: [
                    {
                        name: "createdBy",
                        title: 'Created by'
                    },
                    {
                        name: "createdDateTime",
                        title: 'Created time',
                        titleClass: 'center aligned',
                        dataClass: 'center aligned'
                    },
                    {
                        name: "jobStatus",
                        title: 'Job status',
                        titleClass: 'center aligned',
                        dataClass: 'right aligned',
                        formatter(value) {
                            return value === 0 ? 'Beklemede' : 'Tamamlandı'
                        }
                    },
                    {
                        name: "actions",
                        title: 'Actions',
                        titleClass: 'center aligned',
                        dataClass: 'right aligned'
                    }
                ]
            };
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
                        "autoStart" : this.autoStart,
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

            sse: function (fts) {
                PublicService.sse(fts).then(
                    response => {
                        this.jobList = response.data.jobList;
                        this.reload();
                    },
                    error => {
                        this.jobList = error.response.data;
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
            }
        }
    };
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>