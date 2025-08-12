<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const videoRef = ref(null);
const message = ref("Waiting QR code scan...");
const router = useRouter();
let codeReader = null;
let scanning = true;
let selectedDeviceId = null;

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
          id: scannedID,
          attendance: "true",
        });

        const response = res.data.response;

        if (
          response &&
          response.code === 200 &&
          response.data !== "Not found"
        ) {
          message.value = "✅ Kehadiran berhasil dicatat!";
        } else {
          await showErrorModal(response.message || "Code Not Found");
        }
      } catch (error) {
        await showErrorModal("Please check your code.");
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

const showErrorModal = async (msg) => {
  const result = await Swal.fire({
    icon: "warning",
    title: "Code Not Found",
    text: msg,
    confirmButtonText: "Close",
    confirmButtonColor: "#d33",
  });

  if (result.isConfirmed) {
    scanning = true;
    startScan(); // restart scan hanya setelah modal ditutup
  }
};

onMounted(async () => {
  codeReader = new BrowserMultiFormatReader();

  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((d) => d.kind === "videoinput");
    selectedDeviceId = videoDevices[0]?.deviceId;

    if (!selectedDeviceId) {
      message.value = "Camera tidak tersedia.";
      return;
    }

    startScan();
  } catch (error) {
    console.error("Tidak bisa akses kamera:", error);
    message.value = "❌ Tidak bisa mengakses kamera.";
  }
});

onBeforeUnmount(() => {
  stopCamera();
});
</script>

<template>
  <div class="d-flex flex-column" style="min-height: 98.5vh; padding: 1rem">
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
