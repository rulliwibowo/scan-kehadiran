<template>
  <div
    class="d-flex flex-column bg-body-tertiary"
    data-bs-theme="dark"
    style="min-height: 100vh !important; padding: 20px 20px 80px 20px"
  >
    <!-- Header -->
    <header style="margin-bottom: 30px; position: relative">
      <div style="color: white"><h3>Daftar Acara</h3></div>

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
    <main class="flex-fill container-fluid">
      <!-- Loading State -->
      <div v-if="loading" class="text-center text-muted">
        <p>Loading events...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else-if="events.length > 0" class="row g-4">
        <div
          v-for="event in events"
          :key="event.id"
          class="col-12"
          style="margin-top: 12px; padding: 0px"
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

      <!-- No Events State -->
      <div v-else class="text-center text-muted">
        <p>No events found.</p>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="text-body-secondary border-top text-center py-3 small bg-body-tertiary"
      style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000"
    >
      SBM ITB Event App © 2025
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import axios from "axios";
import axios from "../libs/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const events = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchEvents = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get("/api/events/index.json");
    events.value = res.data.events;
  } catch (err) {
    console.error("[ERROR] Gagal fetch event:", err);
    error.value = "Failed to load events. Please try again later.";
  } finally {
    loading.value = false;
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
