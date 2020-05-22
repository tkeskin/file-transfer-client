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
                              @submit.prevent="passes(ftpServerSave)"
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
                              :data=ftpServerList
                              :fields=fields>
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
                </div>
                <div class="card-footer" style="background-color: transparent">
                </div>
            </card>

        </div>
    </section>
</template>

<script>
    import FtpServerDto from '../models/ftp-server';
    import PublicService from "../services/public.service"

    export default {
        name: 'ftpServer',
        data() {
            return {
                ftpServerDto: new FtpServerDto('', '', '', '', '',
                    '', ''),
                submitted: false,
                successful: false,
                message: '',
                ftpServerList: [],
                fields: [
                    {
                        name: "name",
                        title: 'Name'
                    },
                    {
                        name: "protocol",
                        title: 'Protocol'
                    },
                    {
                        name: "hostAdress",
                        title: 'Host Adress'
                    },
                    {
                        name: "port",
                        title: 'Port'
                    },
                    {
                        name: "username",
                        title: 'Username'
                    },
                    {
                        name: "password",
                        title: 'Password',
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

            ftpServerSave() {
                PublicService.saveFtpServer(this.ftpServerDto).then(
                    response => {
                        this.message = response.data;
                        this.getFtpServer();
                        this.resetForm();
                    },
                    error => {
                        this.message = error.message;
                    }
                );

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
                    PublicService.deleteFtpServer(fts).then(
                        response => {
                            this.ftpServerList = response.data.ftpServerList;
                        },
                        error => {
                            this.ftpServerList = error.response.data;
                        }
                    );
                this.getFtpServer();
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

            }
        }
    };
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>