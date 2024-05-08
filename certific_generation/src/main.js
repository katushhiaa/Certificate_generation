import { createApp } from "vue";
import App from "./App.vue";
import { BootstrapVue3 } from "bootstrap-vue-3";
import router from "./router.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDataTable } from "vuetify/components/VDataTable";
import { Moveable } from "vue3-moveable";

const app = createApp(App);

const vuetify = createVuetify({
  components: {
    VDataTable,
  },
});

app.use(vuetify);
app.use(BootstrapVue3);
app.use(router);
app.use(movable);
app.mount("#app");
export default vuetify;
