import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(Router)

export default Router({
  routes: [
    { path: '/', component: Home },
    { path: '/loginComp', component: Login }
  ]
})
