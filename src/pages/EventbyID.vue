<template>
  <div
    class="d-flex flex-column bg-body-tertiary"
    data-bs-theme="dark"
    style="min-height: 100vh !important; padding: 20px 20px 80px 20px"
  >
    <!-- Tombol Back Ikon Panah Kiri -->
    <router-link
      to="/events"
      class="text-decoration-none text-body-secondary mb-3 d-inline-flex align-items-center"
      style="gap: 4px; padding-bottom: 0.5rem"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
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
      <h4 class="text-light">{{ event.name }}</h4>
      <!-- tambahkan jadwal -->
      <div class="row g-3 mt-2" v-if="event.event_schedules?.length">
        <div
          v-for="(s, i) in event.event_schedules"
          :key="i"
          class="col-12"
          style="margin-top: 10px"
        >
          <div class="card h-100 shadow-sm border-0" style="border-radius: 8px">
            <div class="card-body p-3 position-relative">
              <h6 class="mb-1 text-light" style="font-weight: 500">
                {{ s.descrip }}
              </h6>
              <p class="mb-0 text-muted" style="font-size: 0.9rem">
                {{ s.start_date }} &mdash; {{ s.venue }}
              </p>
              <router-link
                class="btn btn-sm btn-outline-primary mt-2"
                :to="`/report/${s.id}?date=${s.start_date}`"
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
import { useRoute } from "vue-router";
// import axios from "axios";
import axios from "../libs/axios";

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
});
</script>
