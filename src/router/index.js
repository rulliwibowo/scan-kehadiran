import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/events" },
  { path: "/login", component: () => import("../pages/Login.vue") },
  { path: "/events", component: () => import("../pages/EventList.vue") },
  { path: "/events/:id", component: () => import("../pages/EventbyID.vue") },
  { path: "/scan", component: () => import("../pages/Scan.vue") },
  { path: "/report/:id", component: () => import("../pages/Report.vue") },
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
