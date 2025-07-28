<template>
  <div
    class="d-flex flex-column"
    style="
      min-height: 96vh !important;
      padding-top: 50px;
      padding-left: 20px;
      padding-right: 20px;
    "
  >
    <!-- Header -->
    <header style="margin-bottom: 30px; position: relative">
      <h3>List of Events</h3>
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
    <footer class="mt-auto text-dark border-top text-center py-2 small">
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
