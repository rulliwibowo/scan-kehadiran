<template>
  <div
    class="d-flex flex-column min-vh-100 bg-body-tertiary"
    style="padding: 20px"
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
    <h2 class="mb-4 text-light">Laporan Kehadiran</h2>

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

        <div
          class="card mb-3 shadow-sm"
          v-for="(item, i) in report.group_report"
          :key="i"
        >
          <div class="card-body">
            <div class="d-flex justify-content-between mb-1">
              <strong>Grup {{ item.group }}</strong>
              <span>{{ item.percentage }}%</span>
            </div>
            <div class="progress" style="height: 20px">
              <div
                class="progress-bar bg-primary"
                role="progressbar"
                :style="{ width: item.percentage + '%' }"
                :aria-valuenow="item.percentage"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ item.attend }}/{{ item.total }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="mt-auto text-body-secondary border-top text-center pt-3 small"
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

const report = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const res = await axios.patch("/api/report/gradNightReport.json", {
      event_schedule_id: scheduleId,
    });

    report.value = {
      total: res.data.data.total_participant,
      group_report: res.data.data.group_report,
    };
  } catch (err) {
    error.value = "Gagal mengambil data laporan.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
