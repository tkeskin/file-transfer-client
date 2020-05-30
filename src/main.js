import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import store from './store';
import Argon from "./plugins/argon-kit";
import './assets/app.scss';
import 'sweetalert2/dist/sweetalert2.min.css';
import {extend, ValidationObserver, ValidationProvider} from 'vee-validate';
import {required} from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import Vuetable from 'vuetable-2';
import FadeTransition from 'vue2-transitions';
import VueSweetalert2 from 'vue-sweetalert2';

Vue.config.productionTip = false;

Vue.use(Argon);
Vue.use(VueSweetalert2);
Vue.use(FadeTransition);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('multiselect', Multiselect);
Vue.component('Vuetable', Vuetable);


extend('required', {
    ...required,
    message: 'This field is required'
});

new Vue({
    router,
    store,
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    render: h => h(App)
}).$mount('#app');