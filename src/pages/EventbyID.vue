<template>
  <div
    class="d-flex flex-column bg-body-tertiary"
    data-bs-theme="dark"
    style="min-height: 100vh !important; padding: 20px"
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
                :to="`/report/${s.id}`"
              >
                Lihat Laporan Kehadiran
              </router-link>

              <!-- Tombol Scan Pojok Kanan Bawah -->
              <router-link
                to="/scan"
                :class="[
                  'btn',
                  isToday(s.start_date)
                    ? 'btn-success'
                    : 'btn-secondary disabled',
                  'position-absolute',
                  'd-flex',
                  'align-items-center',
                  'justify-content-center',
                ]"
                style="
                  bottom: 0.75rem;
                  right: 0.75rem;
                  width: 50px;
                  height: 50px;
                  border-radius: 0.5rem;
                "
                :title="
                  isToday(s.start_date)
                    ? 'Scan Kehadiran'
                    : 'Scan hanya bisa dilakukan pada hari acara'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-qr-code-scan"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 12v4a1 1 0 0 1-1 1h-4" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M17 8V7" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M7 17h.01" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <rect x="7" y="7" width="5" height="5" rx="1" />
                </svg>
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
      class="mt-auto text-body-secondary border-top text-center py-3 small"
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

const isToday = (dateString) => {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();

  // Reset time part to 00:00:00 for both dates to compare only the date part
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return eventDate.getTime() === today.getTime();
};

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
