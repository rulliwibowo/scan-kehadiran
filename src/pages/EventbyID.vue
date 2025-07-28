<template>
  <div
    class="d-flex flex-column"
    style="
      min-height: 96vh !important;
      padding-top: 1.2rem;
      padding-left: 12px;
      padding-right: 12px;
    "
  >
    <!-- Tombol Back Ikon Panah Kiri -->
    <router-link
      to="/events"
      class="text-decoration-none text-dark mb-3 d-inline-flex align-items-center"
      style="gap: 4px; padding-bottom: 0.5rem"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="#808080"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-chevron-left"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </router-link>
    <div v-if="loading">Loading data...</div>

    <div v-else-if="event">
      <h4>{{ event.name }}</h4>
      <!-- tambahkan jadwal -->
      <div class="row g-3 mt-2" v-if="event.event_schedules?.length">
        <div v-for="(s, i) in event.event_schedules" :key="i" class="col-12">
          <div class="card h-100 shadow-sm border-0" style="border-radius: 8px">
            <div class="card-body p-3">
              <h6 class="mb-1 text-dark" style="font-weight: 500">
                {{ s.descrip }}
              </h6>
              <p class="mb-0 text-muted" style="font-size: 0.9rem">
                {{ s.start_date }} &mdash; {{ s.venue }}
              </p>
              <router-link
                class="btn btn-sm btn-outline-primary mt-2"
                :to="`/report/${s.id}`"
              >
                Lihat Laporan Kehadiran
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- Jika event_schedules kosong -->
      <div v-else class="mt-3 text-muted small">
        No event schedules available.
      </div>
    </div>
    <div v-else>
      <p>Data tidak ditemukan.</p>
    </div>
    <!-- Tombol Menuju Scan -->
    <router-link
      to="/scan"
      class="btn btn-success d-inline-flex align-items-center mt-4"
      style="gap: 6px; font-weight: 500; font-size: 0.95rem; border-radius: 8px"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-camera"
      >
        <path
          d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span>Scan</span>
    </router-link>
    <!-- Footer -->
    <footer class="mt-auto text-dark border-top text-center py-2 small">
      SBM ITB Event App © 2025
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const event = ref(null);
const loading = ref(true);

const fetchEventByID = async () => {
  try {
    const res = await axios.patch("/api/events/getByID.json", {
      id: route.params.id,
    });
    event.value = res.data.event;
    console.log("[DEBUG] Event data:", event.value);
  } catch (err) {
    console.error("[ERROR] Gagal ambil event by ID:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEventByID();
  axios
    .patch("/api/events/getByID.json", {
      id: "b0c0b117-1d2f-4155-85cb-3d260faaa02a",
    })
    .then((res) => console.log("✅ Proxy success:", res.data))
    .catch((err) => console.error("❌ Proxy failed:", err));
});
</script>
