import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import UserRegister from "../views/UserRegister.vue";
import DashboardView from "../views/DashboardView.vue";
import BloodBankList from "../views/BloodBankList.vue";
import BloodBankLogin from "../views/BloodBankLogin.vue";
import BloodBankRegister from "../views/BloodBankRegister.vue";
import BloodBankDashboard from "../views/BloodBankDashboard.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";

const routes = [
  // Redirect root '/' to login
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/user-register",
    name: "Register",
    component: UserRegister,
  },
  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/blood-banks",
    name: "BloodBanks",
    component: BloodBankList,
  },
  {
    path: "/blood-bank-login",
    name: "BloodBankLogin",
    component: BloodBankLogin,
  },
  {
    path: "/blood-bank-register",
    name: "BloodBankRegister",
    component: BloodBankRegister,
  },
  {
    path: "/blood-bank/dashboard",
    name: "BloodBankDashboard",
    component: BloodBankDashboard,
    meta: { requiresAuth: true, requiresBank: true },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: ResetPassword,
  },
  // Catch-all for unknown routes, redirect to login
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Route Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userType = localStorage.getItem("userType");

  if (to.meta.requiresAuth && !isAuthenticated) {
    if (to.meta.requiresBank) {
      next("/blood-bank-login");
    } else {
      next("/login");
    }
  } else if (to.meta.requiresBank && userType !== 'blood_bank') {
    next("/blood-bank-login");
  } else {
    next();
  }
});

export default router;
