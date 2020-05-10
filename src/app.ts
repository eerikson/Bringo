import Vue from 'vue';
import App from './components/App.vue';
import { EVENT_TYPES } from './lib';

Vue.config.productionTip = false;
console.info(EVENT_TYPES);
new Vue({
  render: (h) => h(App),
}).$mount('#app');
