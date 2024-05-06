import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Login.vue";
import SignUp from "./components/SignUp.vue";
import TeacherPage from "./components/TeacherPage.vue";
import StudentPage from "./components/StudentPage.vue";
import CustomTable from "./components/CustomTable.vue";
import FinalComp from "./components/FinalComp.vue";
import CreateCertificate from "./components/createCertificate.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/signup", component: SignUp },
  { path: "/teacher", component: TeacherPage },
  { path: "/student", component: StudentPage },
  { path: "/table", component: CustomTable },
  { path: "/certificate", component: FinalComp },
  { path: "/createCertificate", component: CreateCertificate },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
