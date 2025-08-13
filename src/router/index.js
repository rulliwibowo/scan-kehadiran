import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/events" },
  { path: "/login", component: () => import("../pages/Login.vue") },
  { path: "/events", component: () => import("../pages/EventList.vue") },
  { path: "/events/:id", component: () => import("../pages/EventbyID.vue") },
  {
    path: "/super-dashboard",
    component: () => import("../pages/SuperDashboard.vue"),
  },
  { path: "/scan", component: () => import("../pages/Scan.vue") },
  { path: "/report/:id", component: () => import("../pages/Report.vue") },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const appElement = document.getElementById("app");
  if (appElement) {
    // Periksa apakah rute yang dituju adalah salah satu dari dasbor
    const isDashboardRoute = to.path === "/super-dashboard";

    if (isDashboardRoute) {
      // Hapus batasan lebar untuk tampilan desktop
      appElement.style.maxWidth = "none";
      appElement.style.backgroundColor = "transparent"; // Biarkan komponen dasbor mengatur latarnya sendiri
    } else {
      // Kembalikan gaya default untuk halaman mobile
      appElement.style.maxWidth = "500px";
      appElement.style.backgroundColor = "#f8f9fa";
    }
  }
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
