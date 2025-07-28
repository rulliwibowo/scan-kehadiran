import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import EventList from "../pages/EventList.vue";
import EventbyID from "../pages/EventbyID.vue";
import Scan from "../pages/Scan.vue";
import Report from "../pages/Report.vue";

const routes = [
  { path: "/", redirect: "/events" },
  { path: "/login", component: Login },
  { path: "/events", component: EventList },
  { path: "/events/:id", component: EventbyID },
  { path: "/scan", component: Scan },
  { path: "/report/:id", component: Report },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem("token");

  if (to.path === "/login" && token) {
    return next("/events"); // kalau sudah login, jangan ke halaman login lagi
  }

  if (authRequired && !token) {
    return next("/login"); // kalau belum login, redirect
  }

  next();
});

export default router;
