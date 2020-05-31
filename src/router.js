import Vue from 'vue';
import Router from 'vue-router';
import Home from "./views/Home.vue";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import FtpServer from "./views/FtpServer";
import Job from "./views/Job";
import Status from "./views/Status";
import Project from "./views/Project";

Vue.use(Router);

export const router = new Router({
    linkExactActiveClass: "active",
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            components: {
                header: Header,
                default: Home,
                footer: Footer
            }
        },
        {
            path: '/home',
            components: {
                header: Header,
                default: Home,
                footer: Footer
            }
        },
        {
            path: '/ftp-server',
            components: {
                header: Header,
                default: FtpServer,
                footer: Footer
            }
        },
        {
            path: '/job',
            components: {
                header: Header,
                default: Job,
                footer: Footer
            }
        },
        {
            path: '/project',
            components: {
                header: Header,
                default: Project,
                footer: Footer
            }
        },
        {
            path: '/status',
            components: {
                header: Header,
                default: Status,
                footer: Footer
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/', '/home', '/register', "/ftp-server", "/job",
        "/project","/status"];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    // try to access a restricted page + not logged in
    if (authRequired && !loggedIn) {
        return next('/login');
    } else next();
});
