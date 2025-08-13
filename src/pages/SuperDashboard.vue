<template>
  <div class="d-flex flex-column vh-100 bg-body-tertiary" data-bs-theme="dark">
    <!-- Header -->
    <header class="p-3 border-bottom shadow-sm">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="mb-0 text-light">Super Dashboard</h3>
        <router-link to="/events" class="btn btn-sm btn-outline-secondary">
          Tampilan Mobile
        </router-link>
      </div>
    </header>

    <!-- Konten Utama dengan 3 Kolom -->
    <main class="flex-fill container-fluid pt-3 overflow-hidden">
      <div class="row h-100">
        <!-- Kolom 1: Daftar Acara -->
        <div class="col-lg-3 d-flex flex-column h-100">
          <h5 class="text-light">Daftar Acara</h5>
          <div v-if="loading.events" class="text-muted">Loading...</div>
          <div v-else class="list-group overflow-auto">
            <a
              href="#"
              v-for="event in events"
              :key="event.id"
              class="list-group-item list-group-item-action"
              :class="{ active: selectedEvent?.id === event.id }"
              @click.prevent="selectEvent(event)"
            >
              {{ event.name }}
            </a>
          </div>
        </div>

        <!-- Kolom 2: Detail Acara & Jadwal -->
        <div
          class="col-lg-4 d-flex flex-column h-100 border-start border-end border-secondary"
        >
          <h5 class="text-light">Detail & Jadwal</h5>
          <div v-if="!selectedEvent" class="text-muted text-center mt-5">
            Pilih acara dari daftar di sebelah kiri.
          </div>
          <div v-else class="overflow-auto">
            <h6 class="text-light">{{ selectedEvent.name }}</h6>
            <div
              v-if="loading.selectedEventDetails"
              class="text-muted text-center mt-4"
            >
              Memuat jadwal...
            </div>
            <div v-else class="list-group">
              <a
                href="#"
                v-for="schedule in selectedEvent.event_schedules"
                :key="schedule.id"
                class="list-group-item list-group-item-action bg-dark-subtle text-light border-secondary"
                :class="{ active: selectedSchedule?.id === schedule.id }"
                @click.prevent="selectSchedule(schedule)"
              >
                <p class="fw-bold mb-1">{{ schedule.descrip }}</p>
                <p class="small text-muted mb-0">
                  {{ schedule.start_date }} &mdash; {{ schedule.venue }}
                </p>
              </a>
            </div>
          </div>
        </div>

        <!-- Kolom 3: Panel Aksi (Laporan / Scan) -->
        <div class="col-lg-5 d-flex flex-column h-100">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="text-light mb-0">Panel Aksi</h5>
            <div v-if="selectedSchedule" class="d-flex gap-2">
              <button
                class="btn btn-sm btn-outline-primary"
                @click="showReport"
                title="Lihat Laporan Kehadiran"
                :class="{ active: activePanel === 'report' }"
              >
                Laporan
              </button>
              <button
                class="btn btn-sm btn-success"
                @click="activateScanner"
                :disabled="!isToday(selectedSchedule.start_date)"
                title="Scan QR untuk jadwal yang dipilih"
                :class="{ active: activePanel === 'scanner' }"
              >
                Scan QR
              </button>
            </div>
          </div>
          <!-- Tampilan Laporan -->
          <div v-if="activePanel === 'report'">
            <div v-if="loading.report" class="text-muted">
              Loading report...
            </div>
            <div v-else-if="report">
              <h6 class="text-info">
                Laporan untuk: {{ selectedSchedule.descrip }}
              </h6>
              <div class="card mb-3 shadow-sm">
                <div class="card-body">
                  <p class="card-text mb-1 text-muted small">
                    Total: <strong>{{ report.total.total }}</strong> | Hadir:
                    <strong>{{ report.total.total_attend }}</strong>
                  </p>
                  <div class="text-center mt-2 pt-2 border-top">
                    <div class="text-muted small">Persentase Kehadiran</div>
                    <div class="display-5 fw-bold text-success">
                      {{ report.total.total_percentage }}%
                    </div>
                  </div>
                </div>
              </div>
              <div class="row g-2">
                <div
                  class="col-6"
                  v-for="item in report.group_report"
                  :key="item.group"
                >
                  <div class="card h-100 shadow-sm">
                    <div class="card-body p-2">
                      <div class="d-flex justify-content-between mb-1">
                        <strong>Grup {{ item.group }}</strong>
                        <span>{{ item.percentage }}%</span>
                      </div>
                      <div class="progress" style="height: 20px">
                        <div
                          class="progress-bar"
                          role="progressbar"
                          :style="{ width: item.percentage + '%' }"
                        >
                          {{ item.attend }}/{{ item.total }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tampilan Scanner -->
          <div v-if="activePanel === 'scanner'">
            <h6 class="text-info">
              Scan untuk: {{ selectedSchedule.descrip }}
            </h6>
            <div
              class="scanner-container bg-black rounded overflow-hidden position-relative"
              style="height: 30vh"
            >
              <video
                ref="videoRef"
                class="w-100 h-100 object-cover"
                autoplay
                playsinline
                muted
              ></video>
              <div class="scan-line"></div>
            </div>
            <p class="mt-2 text-center">{{ scanMessage }}</p>
          </div>

          <!-- Default state (sudah pilih jadwal, belum pilih aksi) -->
          <div
            v-if="selectedSchedule && !activePanel"
            class="text-muted text-center mt-5"
          >
            Pilih aksi "Laporan" atau "Scan QR" di atas untuk jadwal:
            <strong class="d-block text-info mt-2">{{
              selectedSchedule.descrip
            }}</strong>
          </div>
          <!-- Default state (belum pilih jadwal) -->
          <div v-if="!selectedSchedule" class="text-muted text-center mt-5">
            Pilih jadwal di kolom tengah untuk melihat aksi.
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import axios from "../libs/axios";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Swal from "sweetalert2";

// --- State Management ---
const events = ref([]);
const selectedEvent = ref(null);
const selectedSchedule = ref(null);
const report = ref(null);
const activePanel = ref(null); // 'report', 'scanner', or null
const loading = reactive({
  events: true,
  report: false,
  selectedEventDetails: false,
});

// --- Event & Schedule Logic ---
const fetchEvents = async () => {
  try {
    const res = await axios.get("/api/events/index.json");
    events.value = res.data.events;
  } catch (err) {
    console.error("Gagal fetch events:", err);
  } finally {
    loading.events = false;
  }
};

const selectEvent = async (event) => {
  // Jika acara yang sama diklik, tidak perlu fetch ulang
  if (selectedEvent.value?.id === event.id) {
    return;
  }

  // Reset state dan tampilkan data parsial untuk responsivitas UI
  selectedEvent.value = { id: event.id, name: event.name, event_schedules: [] };
  selectedSchedule.value = null;
  report.value = null;
  activePanel.value = null;
  stopCamera();
  loading.selectedEventDetails = true;

  try {
    const res = await axios.patch("/api/events/getByID.json", { id: event.id });
    selectedEvent.value = res.data.event; // Ganti dengan data lengkap dari API
  } catch (err) {
    console.error("Gagal fetch detail acara:", err);
    selectedEvent.value = null; // Hapus jika terjadi error
  } finally {
    loading.selectedEventDetails = false;
  }
};

const selectSchedule = (schedule) => {
  // If the same schedule is clicked, do nothing to avoid re-triggering actions.
  if (selectedSchedule.value?.id === schedule.id) {
    return;
  }
  selectedSchedule.value = schedule;
  activePanel.value = null; // Reset panel aksi
  stopCamera();
  // After selecting a schedule, show the report by default.
  showReport();
};

const showReport = async () => {
  if (!selectedSchedule.value || activePanel.value === "report") return;
  activePanel.value = "report";
  report.value = null;
  loading.report = true;
  try {
    const res = await axios.patch("/api/report/gradNightReport.json", {
      event_schedule_id: selectedSchedule.value.id,
    });
    report.value = {
      total: res.data.data.total_participant,
      group_report: res.data.data.group_report,
    };
  } catch (err) {
    console.error("Gagal ambil laporan:", err);
  } finally {
    loading.report = false;
  }
};

const isToday = (dateString) => {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return eventDate.getTime() === today.getTime();
};

// --- QR Scanner Logic ---
const videoRef = ref(null);
const scanMessage = ref("Arahkan kamera ke QR code...");
let codeReader = null;
let isScanning = false;

const activateScanner = () => {
  if (!selectedSchedule.value || activePanel.value === "scanner") return;
  // Hentikan dulu instance kamera yang mungkin masih aktif
  stopCamera();

  activePanel.value = "scanner";
  report.value = null;

  // Beri jeda singkat untuk memastikan elemen <video> sudah dirender oleh browser
  // sebelum mencoba mengakses kamera. Ini lebih andal daripada nextTick.
  setTimeout(startScan, 100);
};

const startScan = async () => {
  if (!videoRef.value) {
    scanMessage.value = "Gagal menginisialisasi kamera, coba lagi.";
    return;
  }
  if (!codeReader) codeReader = new BrowserMultiFormatReader();
  isScanning = true;
  scanMessage.value = "Mempersiapkan kamera...";
  try {
    const videoInputDevices =
      await BrowserMultiFormatReader.listVideoInputDevices();
    if (videoInputDevices.length < 1) {
      scanMessage.value = "Kamera tidak ditemukan.";
      return;
    }
    const rearCamera =
      videoInputDevices.find((d) => d.label.toLowerCase().includes("back")) ||
      videoInputDevices[0];

    scanMessage.value = "Arahkan kamera ke QR code...";
    codeReader.decodeFromVideoDevice(
      rearCamera.deviceId,
      videoRef.value,
      async (result, err) => {
        if (result && isScanning) {
          isScanning = false; // Prevent multiple scans
          const scannedID = result.getText();

          try {
            const res = await axios.put("/api/participant/attendance.json", {
              id: scannedID,
              attendance: "true",
            });
            const response = res.data.response;
            if (
              response &&
              response.code === 200 &&
              response.data !== "Not found"
            ) {
              Swal.fire(
                "Berhasil",
                `Kehadiran untuk ${response.data.name} berhasil dicatat!`,
                "success"
              );
            } else {
              Swal.fire(
                "Gagal",
                response.message || "Kode QR tidak valid.",
                "error"
              );
            }
          } catch (error) {
            Swal.fire("Error", "Terjadi kesalahan saat memproses QR.", "error");
          }

          // Resume scanning after a short delay
          setTimeout(() => {
            isScanning = true;
          }, 2000);
        }
      }
    );
  } catch (error) {
    scanMessage.value = "Gagal mengakses kamera.";
    console.error("Camera access error:", error);
  }
};

const stopCamera = () => {
  if (codeReader) {
    codeReader.reset();
  }
  isScanning = false;
};

onMounted(fetchEvents);

onBeforeUnmount(stopCamera);
</script>

<style scoped>
.scanner-container {
  position: relative;
  overflow: hidden;
}
.scan-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to right,
    rgba(0, 255, 0, 0.3),
    #00ff00,
    rgba(0, 255, 0, 0.3)
  );
  animation: scanAnimation 3.2s ease-in-out infinite;
  z-index: 10;
}
@keyframes scanAnimation {
  0% {
    top: 0%;
  }
  50% {
    top: calc(100% - 4px);
  }
  100% {
    top: 0%;
  }
}
.overflow-auto {
  overflow-y: auto;
}
</style>
