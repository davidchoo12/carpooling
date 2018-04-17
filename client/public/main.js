import Vue from 'vue';
import Toasted from 'vue-toasted';
import App from './App.vue';
import router from './router';
// import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;

Vue.use(Toasted, {
  theme: 'primary',
  position: 'bottom-right',
  duration: '5000',
  action: {
    text: 'close',
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    }
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
});