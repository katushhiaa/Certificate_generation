import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Login.vue";
import SignUp from "./components/SignUp.vue";
import TeacherPage from "./components/TeacherPage.vue";
import StudentPage from "./components/StudentPage.vue";
import GenerateCertificate from "./components/GenerateCertificate.vue";
import CreateCertificate from "./components/createCertificate.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/signup", component: SignUp },
  {
    path: "/teacher",
    component: TeacherPage,
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/student",
    component: StudentPage,
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/certificate",
    component: GenerateCertificate,
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/createCertificate",
    component: CreateCertificate,
    meta: { requiresAuth: true, role: "teacher" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem("user"));

  if (requiresAuth && !user) {
    next("/login");
  } else if (requiresAuth && user) {
    const role = localStorage.getItem("role");
    if (to.meta.role && to.meta.role !== role) {
      if (role === "teacher") {
        next("/teacher");
      } else if (role === "student") {
        next("/student");
      } else {
        next("/login");
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
