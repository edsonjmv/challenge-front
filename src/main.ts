import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './plugins/vuex';
import VueLayers from 'vuelayers';
import JsonCSV from 'vue-json-csv';

Vue.config.productionTip = false;

Vue.use(VueLayers);

Vue.component('downloadCsv', JsonCSV);

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App)
}).$mount('#app');
