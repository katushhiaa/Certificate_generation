import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import SignUp from './components/SignUp.vue'
import TeacherPage from './components/TeacherPage.vue'
import StudentPage from './components/StudentPage.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  { path: '/teacher', component: TeacherPage },
  { path: '/student', component: StudentPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
