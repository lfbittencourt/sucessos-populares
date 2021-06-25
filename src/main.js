import Vue from 'vue';
import VueTippy from 'vue-tippy';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueTippy, {
  arrow: true,
  directive: 'tippy',
  maxWidth: 200,
  placement: 'bottom',
  trigger: 'mouseenter',
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
