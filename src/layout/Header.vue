<template>
    <header class="header-global">
        <base-nav class="navbar-main" transparent type="" effect="light" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/theme/logo100.png" alt="aa-100">
            </router-link>

            <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
                <li class="nav-item">
                    <a class="nav-link" href="/project">Project</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/ftp-server">FTP Server</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/job">Job</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/status">Status</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/settings">Settings</a>
                </li>
            </ul>

            <!--            <ul class="navbar-nav align-items-lg-center ml-lg-auto">
                            <li class="nav-item">
                                <a class="nav-link nav-link-icon" href="#"
                                   target="_blank" rel="noopener" data-toggle="tooltip" title="Instagram">
                                    <i class="fa fa-instagram"></i>
                                    <span class="nav-link-inner&#45;&#45;text d-lg-none">Instagram</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link nav-link-icon" href="#"
                                   target="_blank" rel="noopener" data-toggle="tooltip" title="Linkedin">
                                    <i class="fa fa-linkedin"></i>
                                    <span class="nav-link-inner&#45;&#45;text d-lg-none">Linkedin</span>
                                </a>
                            </li>
                        </ul>-->

            <!--            <div class="col-2 d-flex justify-content-end align-items-center" v-if="!currentUser">
                            <li class="col-0 d-flex">
                                <a href="/login" class="btn btn-sm btn-outline-secondary">
                                    Giriş
                                </a>
                            </li>
                        </div>-->

            <div class="col-3 d-flex justify-content-end align-items-center" v-if="currentUser">
                <li class="col-0 d-flex">
                    <a href="/profile" class="btn btn-sm btn-outline-secondary">
                        {{currentUser.username}}
                    </a>
                </li>
                <!--<li class="col-0 d-flex" v-if="showUserBoard">
                    <a href="/user" class="btn btn-sm btn-outline-secondary">
                        <font-awesome-icon icon="user"/>
                        Kullanıcı Alanı
                    </a>
                </li>
                <li class="col-0 d-flex" v-if="showAdminBoard">
                    <a href="/admin" class="btn btn-sm btn-outline-secondary">
                        <font-awesome-icon icon="user"/>
                        Admin Alanı
                    </a>
                </li>
                <li class="col-0 d-flex" v-if="showModeratorBoard">
                    <a href="/mod" class="btn btn-sm btn-outline-secondary">
                        <font-awesome-icon icon="user"/>
                        Moderator Alanı
                    </a>
                </li>-->
                <li class="col-0 d-flex">
                    <a href class="btn btn-sm btn-outline-secondary" @click="logOut">
                        Çıkış
                    </a>
                </li>
            </div>
        </base-nav>
    </header>
</template>
<script>

    export default {

        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            },
            showUserBoard() {
                if (this.currentUser) {
                    return this.currentUser.roles.includes('ROLE_USER');
                }

                return false;
            },
            showAdminBoard() {
                if (this.currentUser) {
                    return this.currentUser.roles.includes('ROLE_ADMIN');
                }

                return false;
            },
            showModeratorBoard() {
                if (this.currentUser) {
                    return this.currentUser.roles.includes('ROLE_MODERATOR');
                }

                return false;
            }
        },
        methods: {
            logOut() {
                this.$store.dispatch('auth/logout');
                this.$router.push('/login');
            }
        }
    };
</script>
<style>
</style>
