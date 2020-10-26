import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import ErrorComponent from "./components/Error.vue";
import AppAlertComponent from "./components/AppAlert.vue";

Vue.config.productionTip = false;
Vue.component("app-error", ErrorComponent);
Vue.component("app-alert", AppAlertComponent);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
