<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "../libs/axios";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";

const videoRef = ref(null);
const message = ref("Waiting QR code scan...");
const route = useRoute();
const router = useRouter();
let codeReader = null;
let scanning = true;
let selectedDeviceId = null;
const eventScheduleId = ref(null);
const recentScans = ref([]);

const startScan = () => {
  if (!selectedDeviceId) {
    message.value = "Camera tidak ditemukan.";
    return;
  }

  // stop dulu biar tidak double scanning
  if (typeof codeReader.stopContinuousDecode === "function") {
    codeReader.stopContinuousDecode();
  }

  codeReader.decodeFromVideoDevice(
    selectedDeviceId,
    videoRef.value,
    async (result, err) => {
      if (!scanning || !result) return;

      scanning = false;
      const scannedID = result.getText();
      message.value = "Waiting QR code scan...";

      try {
        const res = await axios.put("/api/participant/attendance.json", {
          event_schedule_id: eventScheduleId.value,
          id: scannedID,
        });

        const response = res.data.response;

        if (response && response.code === 200 && response.data) {
          const participantName = response.data.name || "Peserta";
          const groupName = response.data.group_participant?.name || "Grup";
          const messageText = response.message || "";

          if (messageText.toLowerCase().includes("already scan")) {
            await showResultModal(
              "Informasi",
              `${participantName} (${groupName}) sudah melakukan scan.`,
              "info"
            );
          } else {
            const scanData = {
              name: participantName,
              group: groupName,
              timestamp: new Date().toLocaleTimeString(),
            };
            recentScans.value.unshift(scanData);
            if (recentScans.value.length > 10) {
              recentScans.value.pop(); // Batasi daftar hanya 10 entri terbaru
            }
            message.value = `✅ ${participantName} - ${groupName}`;
            await Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: `Kehadiran untuk ${participantName} (${groupName}) berhasil dicatat.`,
              timer: 2000,
              showConfirmButton: false,
            });
            setTimeout(() => {
              scanning = true;
              message.value = "Waiting QR code scan...";
            }, 500);
          }
        } else {
          await showResultModal(
            "Gagal",
            response?.message || "Kode QR tidak valid.",
            "error"
          );
        }
      } catch (error) {
        const apiErrorMessage = error.response?.data?.response?.message;
        await showResultModal(
          "Error",
          apiErrorMessage || "Terjadi kesalahan. Silakan coba lagi.",
          "error"
        );
      }
    }
  );
};

const stopCamera = () => {
  try {
    if (codeReader) {
      // reset() akan menghentikan decode dan melepaskan kamera
      codeReader.reset();
    }
  } catch (e) {
    console.warn("Gagal stop kamera:", e);
  }
};

const handleBack = () => {
  stopCamera();
  router.back();
};

const showResultModal = async (title, msg, icon) => {
  await Swal.fire({
    icon: icon,
    title: title,
    text: msg,
    confirmButtonText: "Tutup",
  });
  scanning = true;
  message.value = "Waiting QR code scan...";
};

onMounted(async () => {
  eventScheduleId.value = route.query.schedule_id;
  if (!eventScheduleId.value) {
    message.value = "ID Jadwal tidak valid. Silakan kembali.";
    return;
  }

  // Akses kamera memerlukan koneksi aman (HTTPS) atau localhost
  if (
    window.location.protocol !== "https:" &&
    window.location.hostname !== "localhost"
  ) {
    message.value = "❌ Akses kamera memerlukan koneksi HTTPS.";
    return;
  }

  codeReader = new BrowserMultiFormatReader();

  try {
    const videoInputDevices =
      await BrowserMultiFormatReader.listVideoInputDevices();

    if (videoInputDevices.length < 1) {
      message.value = "Tidak ada kamera yang ditemukan.";
      return;
    }

    // Prioritaskan kamera belakang (environment)
    let rearCamera = videoInputDevices.find((device) =>
      /back|rear|environment/i.test(device.label)
    );

    selectedDeviceId = rearCamera?.deviceId || videoInputDevices[0]?.deviceId;

    if (!selectedDeviceId) {
      message.value = "Camera tidak tersedia.";
      return;
    }

    startScan();
  } catch (error) {
    console.error("Tidak bisa akses kamera:", error);
    if (error.name === "NotAllowedError") {
      message.value = "❌ Anda harus memberikan izin untuk mengakses kamera.";
    } else if (error.name === "NotFoundError") {
      message.value = "❌ Tidak ada kamera yang ditemukan di perangkat ini.";
    } else if (error.name === "NotReadableError") {
      message.value = "❌ Kamera sedang digunakan oleh aplikasi lain.";
    } else {
      message.value =
        "❌ Gagal mengakses kamera. Pastikan izin telah diberikan.";
    }
  }
});

onBeforeUnmount(() => {
  stopCamera();
});
</script>

<template>
  <div
    class="d-flex flex-column"
    style="min-height: 98.5vh; padding: 1rem 0.5rem 0 0.5rem"
  >
    <div class="text-start">
      <button
        @click="handleBack"
        class="text-decoration-none text-dark mb-3 align-items-center"
        style="gap: 4px; padding-bottom: 0.5rem"
      >
        <!-- ikon panah -->
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
      </button>
    </div>

    <h2 class="text-xl font-bold mb-4 text-center">Scan QR Code</h2>

    <div
      class="scanner-container w-100 max-w-md mx-auto bg-black rounded overflow-hidden relative"
      style="height: 40vh"
    >
      <video
        ref="videoRef"
        class="w-full h-full object-cover"
        autoplay
        playsinline
        muted
      ></video>
      <div class="scan-line"></div>
    </div>

    <p class="mt-4 text-center text-lg">{{ message }}</p>

    <!-- Daftar Scan Terbaru -->
    <div
      v-if="recentScans.length > 0"
      class="mt-4 flex-grow-1 overflow-auto"
      style="padding-bottom: 1rem"
    >
      <h6 class="text-center text-muted small mb-2">Histori Scan</h6>
      <ul class="list-group">
        <li
          v-for="(scan, index) in recentScans"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong class="d-block">{{ scan.name }}</strong>
            <small class="text-muted">{{ scan.group }}</small>
          </div>
          <span class="badge bg-secondary rounded-pill">{{
            scan.timestamp
          }}</span>
        </li>
      </ul>
    </div>
    <!-- Footer -->
    <footer class="mt-auto text-dark border-top text-center py-2 small">
      SBM ITB Event App © 2025
    </footer>
  </div>
</template>

<style>
button {
  background: none; /* hilangkan fill */
  border: none; /* hilangkan garis kotak */
  outline: none; /* hilangkan outline saat fokus */
  padding: 0; /* opsional: hilangkan padding default */
}

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
  pointer-events: none;
}

@keyframes scanAnimation {
  0% {
    top: 0%;
  }
  50% {
    top: calc(100% - 4px); /* pas berhenti tepat di bawah */
  }
  100% {
    top: 0%;
  }
}
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
