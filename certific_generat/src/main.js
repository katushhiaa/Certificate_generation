import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import Vue from 'vue'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const vuetify = createVuetify()

const app = createApp(App)
app.use(router)
app.use(vuetify)
Vue.use(BootstrapVue)

app.mount('#app')
