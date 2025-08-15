<template>
  <div
    class="d-flex flex-column min-vh-100 bg-body-tertiary"
    style="padding: 20px 20px 80px 20px"
    data-bs-theme="dark"
  >
    <!-- Tombol Kembali -->
    <div class="text-start mb-3">
      <button
        @click="handleBack"
        class="text-body-secondary d-inline-flex align-items-center"
        style="background: none; border: none; padding: 0"
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
      </button>
    </div>

    <!-- Judul -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 text-light">Laporan Kehadiran</h2>
      <router-link
        :to="`/scan?schedule_id=${scheduleId}`"
        :class="[
          'btn',
          isToday(scheduleDate) ? 'btn-success' : 'btn-secondary disabled',
        ]"
        :title="
          isToday(scheduleDate)
            ? 'Scan QR'
            : 'Scan hanya bisa dilakukan pada hari acara'
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-qr-code-scan"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5Z M4 4h1v1H4V4Z"
          />
          <path
            d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm4 1H6v1h1V4Zm1 1H7v1h1V5Zm-1 2H6v1h1V7Z"
          />
          <path
            d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm4-1H6v1h1V9Zm1 1H7v1h1v-1Zm-1 2H6v1h1v-1Z"
          />
          <path
            d="M14 9h-5v5h5V9Zm-4 1h3v3h-3v-3Zm4-1h-1v1h1V9Zm1 1h-1v1h1v-1Zm-1 2h-1v1h1v-1Z"
          />
          <path
            d="M14 2H9v5h5V2Zm-4 1h3v3h-3V3Zm4-1h-1v1h1V2Zm1 1h-1v1h1V4Zm-1 2h-1v1h1V6Z"
          />
        </svg>
        <span class="ms-2">Scan</span>
      </router-link>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-muted">Loading...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>

    <!-- Konten Laporan -->
    <main v-else class="flex-fill">
      <!-- Total -->
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Data Partisipan</h5>
          <p class="card-text mb-1 text-muted small">
            <span
              >Total Undangan: <strong>{{ report.total.total }}</strong></span
            >
            <span class="ms-3"
              >Present: <strong>{{ report.total.total_attend }}</strong></span
            >
          </p>
          <div class="text-center mt-3 pt-2 border-top">
            <div class="text-muted small">Persentase Kehadiran</div>
            <div class="display-4 fw-bold text-success">
              {{ report.total.total_percentage }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Per Grup -->
      <div>
        <h5 class="mb-3 text-light">Detail Kehadiran per Grup</h5>

        <div class="row g-3">
          <div class="col-6" v-for="(item, i) in report.group_report" :key="i">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between mb-1">
                  <strong>{{ item.group }}</strong>
                </div>
                <div class="progress" style="height: 5px">
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    :style="{ width: item.percentage + '%' }"
                    :aria-valuenow="item.percentage"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div
                  class="d-flex justify-content-between small mt-1 text-muted"
                >
                  <span>{{ item.attend }}/{{ item.total }}</span>
                  <span>{{ Math.round(item.percentage) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "../libs/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const handleBack = () => {
  router.back();
};

const route = useRoute();
const scheduleId = route.params.id;
const scheduleDate = route.query.date;

const report = ref(null);
const loading = ref(true);
const error = ref(null);

const isToday = (dateString) => {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return eventDate.getTime() === today.getTime();
};

onMounted(async () => {
  try {
    const res = await axios.patch("/api/report/gradNightReport.json", {
      event_schedule_id: scheduleId,
    });

    // Check for the specific "not found" response from the API
    if (res.data?.data?.code === 204) {
      error.value =
        res.data.data.message || "Data laporan tidak dapat ditemukan.";
      report.value = null; // Ensure report data is cleared
    } else if (res.data?.data?.total_participant) {
      // Handle successful response with data
      report.value = {
        total: res.data.data.total_participant,
        group_report: res.data.data.group_report,
      };
    } else {
      // Handle other unexpected successful responses
      error.value = "Format data laporan tidak valid.";
    }
  } catch (err) {
    error.value = "Gagal mengambil data laporan.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
