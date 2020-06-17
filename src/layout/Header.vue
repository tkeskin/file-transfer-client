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
            </ul>

            <div class="col-3 d-flex justify-content-end align-items-center" v-if="currentUser">
                <li class="col-0 d-flex">
                    <a href="/profile" class="btn btn-sm btn-outline-secondary">
                        {{currentUser.username}}
                    </a>
                </li>
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
