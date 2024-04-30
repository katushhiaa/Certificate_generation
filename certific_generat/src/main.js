import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

const vuetify = createVuetify()

createApp(App).use(router).use(vuetify).mount('#app')
