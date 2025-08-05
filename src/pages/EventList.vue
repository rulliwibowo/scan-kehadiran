<template>
  <div
    class="d-flex flex-column bg-body-tertiary"
    data-bs-theme="dark"
    style="
      min-height: 100vh !important;
      padding-top: 50px;
      padding-left: 20px;
      padding-right: 20px;
    "
  >
    <!-- Header -->
    <header style="margin-bottom: 30px; position: relative">
      <div style="color: white"><h3>List of Events</h3></div>

      <button
        @click="logout"
        title="Logout"
        class="btn btn-link p-0"
        style="position: absolute; top: 0; right: 0"
      >
        <!-- Logout icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-log-out"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </header>

    <!-- Main Content -->
    <main class="flex-fill container" style="padding-left: 0 !important">
      <div class="row g-4">
        <div
          v-for="event in events"
          :key="event.id"
          class="col-12"
          style="margin-top: 12px"
        >
          <div class="card h-100 shadow-sm border-0" style="border-radius: 8px">
            <div class="card-body p-3">
              <router-link
                :to="`/events/${event.id}`"
                class="d-flex justify-content-between align-items-center text-decoration-none text-primary"
              >
                <span class="card-title h6 mb-0" style="font-weight: 400">{{
                  event.name
                }}</span>
                <!-- Ganti ikon panah di sini -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-chevron-right"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="mt-auto text-body-secondary border-top text-center py-3 small"
    >
      SBM ITB Event App © 2025
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const events = ref([]);

const fetchEvents = async () => {
  try {
    const res = await axios.get("/api/events/index.json");
    events.value = res.data.events;
  } catch (err) {
    console.error("[ERROR] Gagal fetch event:", err);
  }
};

const logout = () => {
  localStorage.removeItem("token"); // atau sessionStorage tergantung tempat simpan token
  router.push("/login");
};

onMounted(() => {
  fetchEvents();
});
</script>

<style>
[data-bs-theme="dark"] {
  --bs-primary: #fd7e14;
  --bs-primary-rgb: 253, 126, 20;
  --bs-primary-text-emphasis: #fd9d4a;
  --bs-primary-bg-subtle: #331a04;
  --bs-primary-border-subtle: #663308;
  --bs-link-color: #fd9d4a;
  --bs-link-hover-color: #fdaa60;
  --bs-link-color-rgb: 253, 157, 74;
  --bs-link-hover-color-rgb: 253, 170, 96;
}
</style>
