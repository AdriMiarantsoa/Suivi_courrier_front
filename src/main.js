import Vue from "vue";
import App from "./App";
import router from "./router/index";
import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";
// import 'bootstrap/dist/js/bootstrap';
// import 'bootstrap/dist/css/bootstrap.css'

Vue.use(PaperDashboard);

router.mode = 'history'; // Ajoutez cette ligne

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
