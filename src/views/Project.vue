<template>
    <section class="section section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew" style="background: #05395f"></div>
        <div class="container">
            <card class="border-0" shadow body-classes="p-3">
                <div class="card-header" style="background-color: transparent">
                    Project - Save
                </div>
                <div class="card-body">
                    <ValidationObserver ref="observer" v-slot="{ passes }">
                        <form id="ftpServerForm" name="form"
                              @submit.prevent="passes(saveProject)"
                              @reset="resetForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="name"
                                                    alternative placeholder="Name"
                                                    v-model="projectDto.name"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="download_path"
                                                    alternative placeholder="Download Path"
                                                    v-model="projectDto.downloadPath"/>
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
                    Project - List
                </div>
                <div class="card-body">
                    <vuetable ref="vuetable"
                              :api-mode="false"
                              :css="css.table"
                              :fields=fields
                              :per-page=perPage
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
    import ProjectDto from '../models/project';
    import ProjectService from "../services/public.service.project"
    import VuetablePagination from "../components/VuetablePaginationBootstrap4.vue";
    import CssConfig from "../components/lib/VuetableConfig";
    import _ from "lodash";

    export default {
        name: 'project',

        components: {
            VuetablePagination,
        },

        data() {
            return {
                perPage: 3,
                css: CssConfig,
                projectDto: new ProjectDto('', '', ''),
                submitted: false,
                successful: false,
                message: '',
                projectList: [],
                fields: [
                    {
                        name: "name",
                        title: 'Name'
                    },
                    {
                        name: "downloadPath",
                        title: 'Download Path'
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
            projectList(newVal, oldVal) {
                this.$refs.vuetable.refresh();
            }
        },

        mounted() {
            this.getProject();
        },

        methods: {

            getProject() {
                ProjectService.getProject().then(
                    response => {
                        this.projectList = response.data.projectList;
                    },
                    error => {
                        this.projectList = error.response.data;
                    }
                );
            },

            saveProject() {
                ProjectService.saveProject(this.projectDto).then(
                    response => {
                        this.message = response.data;
                        this.getProject();
                        this.resetForm();
                    },
                    error => {
                        this.message = error.message;
                    }
                );

            },

            editProject: function (p) {
                this.projectDto.id = p.id;
                this.projectDto.name = p.name;
                this.projectDto.downloadPath = p.downloadPath;
            },

            deleteProject: async function (p) {
                await
                    ProjectService.deleteProject(p).then(
                        response => {
                            this.projectList = response.data;
                        },
                        error => {
                            this.projectList = error.response.data;
                        }
                    );
                this.getProject();
                this.resetForm();
            },

            resetForm() {
                this.projectDto.id = "";
                this.projectDto.name = "";
                this.projectDto.downloadPath = "";
                requestAnimationFrame(() => {
                    this.$refs.observer.reset();
                });
            },

            onPaginationData(paginationData) {
                this.$refs.pagination.setPaginationData(paginationData);
                this.$refs.paginationInfo.setPaginationData(paginationData);
            },

            onChangePage(page) {
                this.$refs.vuetable.changePage(page)
            },

            dataManager(sortOrder, pagination) {
                if (this.projectList.length < 1) return;

                let local = this.projectList;

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