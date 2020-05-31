<template>
    <section class="section section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew" style="background: #05395f"></div>
        <div class="container">
            <card class="border-0" shadow body-classes="p-3">
                <div class="card-header" style="background-color: transparent">
                    FTP Server - Save
                </div>
                <div class="card-body">
                    <ValidationObserver ref="observer" v-slot="{ passes }">
                        <form id="ftpServerForm" name="form"
                              @submit.prevent="passes(saveftpServer)"
                              @reset="resetForm">
                            <div class="row">
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="name"
                                                    alternative placeholder="Name"
                                                    v-model="ftpServerDto.name"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="protocol"
                                                    alternative placeholder="Protocol"
                                                    v-model="ftpServerDto.protocol"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="hostAdress"
                                                    alternative placeholder="Host Adress"
                                                    v-model="ftpServerDto.hostAdress"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="number" name="port"
                                                    alternative placeholder="Port"
                                                    v-model="ftpServerDto.port"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="text" name="username"
                                                    alternative placeholder="Username"
                                                    v-model="ftpServerDto.username"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                                <div class="col-md-6">
                                    <validation-provider rules="required" v-slot="{ errors }">
                                        <base-input type="password" name="password"
                                                    alternative placeholder="Password"
                                                    v-model="ftpServerDto.password"/>
                                        <span>{{ errors[0] }}</span>
                                    </validation-provider>
                                </div>
                            </div>
                            <hr/>
                            <button class="btn btn-success btn-sm" type="submit">Save</button>
                            <button class="btn btn-danger btn-sm" type="reset">Reset</button>
                            <button type="button" class="btn btn-secondary btn-sm"
                                    v-on:click="testConnection(ftpServerDto)">Test
                            </button>
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
                    FTP Server - List
                </div>
                <div class="card-body">
                    <vuetable ref="vuetable"
                              :api-mode="false"
                              :css="css.table"
                              :fields="ftpServerFields"
                              :per-page="css.perPage"
                              :data-manager="dataManager"
                              pagination-path="pagination"
                              @vuetable:pagination-data="onPaginationData">
                        <div slot="actions" slot-scope="props">
                            <base-button type="primary" size="sm"
                                         v-on:click="editFtpServer(props.rowData)">
                                Edit
                            </base-button>
                            <base-button type="danger" size="sm"
                                         v-on:click="deleteFtpServer(props.rowData)">
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
    import FtpServerDto from '../models/ftp-server';
    import PublicService from "../services/public.service";
    import TableConfig from "../components/lib/tableConfig";
    import SwalConfig from "../components/lib/swalConfig";
    import _ from "lodash";

    export default {
        name: 'ftpServer',

        data() {
            return {
                css: TableConfig,
                swalConfig: SwalConfig,
                ftpServerDto: new FtpServerDto('', '', '', '', '',
                    '', ''),
                submitted: false,
                successful: false,
                message: '',
                ftpServerList: [],
                ftpServerFields: [
                    {
                        name: "name",
                        title: '<i class="fa fa-at"></i> Name'
                    },
                    {
                        name: "protocol",
                        title: '<i class="fa fa-power-off"></i> Protocol'
                    },
                    {
                        name: "hostAdress",
                        title: '<i class="fa fa-address-book"></i> Host Adress'
                    },
                    {
                        name: "port",
                        title: '<i class="fa fa-ban"></i> Port'
                    },
                    {
                        name: "username",
                        title: '<i class="fa fa-bank"></i> Username'
                    },
                    {
                        name: "password",
                        title: '<i class="fa fa-asterisk"></i> Password',
                        formatter() {
                            return '*****'
                        }
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
            ftpServerList(newVal, oldVal) {
                this.$refs.vuetable.refresh();
            }
        },

        mounted() {
            this.getFtpServer();
        },

        methods: {
            getFtpServer() {
                PublicService.getFtpServer().then(
                    response => {
                        this.ftpServerList = response.data.ftpServerList;
                    },
                    error => {
                        this.ftpServerList = error.response.data;
                    }
                );
            },

            saveftpServer() {

                this.$swal(this.swalConfig.confirm).then((result) => {
                    if (result.value) {
                        PublicService.saveFtpServer(this.ftpServerDto).then(
                            response => {
                                this.message = response.data;
                                this.getFtpServer();
                                this.resetForm();
                                this.$swal(this.swalConfig.successToast);
                            },
                            error => {
                                this.message = error.message;
                            }
                        );
                    } else {
                        this.$swal.close();
                        //this.$swal('Cancelled', '', 'info')
                    }
                })


            },

            editFtpServer: function (fts) {
                this.ftpServerDto.id = fts.id;
                this.ftpServerDto.name = fts.name;
                this.ftpServerDto.protocol = fts.protocol;
                this.ftpServerDto.hostAdress = fts.hostAdress;
                this.ftpServerDto.port = fts.port;
                this.ftpServerDto.username = fts.username;
                this.ftpServerDto.password = fts.password;
            },

            deleteFtpServer: async function (fts) {

                await
                    this.$swal(this.swalConfig.confirm).then((result) => {
                        if (result.value) {
                            PublicService.deleteFtpServer(fts).then(
                                response => {
                                    this.ftpServerList = response.data.ftpServerList;
                                    this.$swal(this.swalConfig.successToast);
                                    this.getFtpServer();
                                    this.resetForm();
                                },
                                error => {
                                    this.ftpServerList = error.response.data;
                                }
                            );

                        } else {
                            this.$swal.close();
                            //this.$swal('Cancelled', '', 'info')
                        }
                    })
            },

            resetForm() {
                this.ftpServerDto.id = "";
                this.ftpServerDto.name = "";
                this.ftpServerDto.protocol = "";
                this.ftpServerDto.hostAdress = "";
                this.ftpServerDto.port = "";
                this.ftpServerDto.username = "";
                this.ftpServerDto.password = "";
                requestAnimationFrame(() => {
                    this.$refs.observer.reset();
                });
            },

            testConnection: function (ftpServerDto) {
                this.$refs.observer.validate().then(success => {
                    if (!success) {
                        return;
                    }
                    PublicService.testConnection(ftpServerDto).then(
                        response => {
                            this.message = response;
                        },
                        error => {
                            this.message = error.message;
                        }
                    );
                });

            },

            onPaginationData(paginationData) {
                this.$refs.pagination.setPaginationData(paginationData);
            },

            onChangePage(page) {
                this.$refs.vuetable.changePage(page)
            },

            dataManager(sortOrder, pagination) {
                if (this.ftpServerList.length < 1) return;

                let local = this.ftpServerList;

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
            }
        }
    };
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>