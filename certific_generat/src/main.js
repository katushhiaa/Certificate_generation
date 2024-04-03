import './assets/main.css'
import App from './App.vue'
import router from './router'
import Vue from 'vue'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
