<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-4">
    <div class="card shadow-lg w-100" style="max-width: 400px">
      <div class="card-body">
        <h3 class="card-title text-center mb-1">Login</h3>
        <h4 class="card-title text-center mb-4">Event Attendance</h4>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input
              v-model="username"
              type="text"
              required
              class="form-control"
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="form-control"
            />
          </div>

          <button type="submit" class="btn btn-primary w-100">Login...</button>

          <div
            v-if="error"
            class="alert alert-danger mt-3 p-2 text-center small"
          >
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/auth.js";
import axios from "../libs/axios";

const router = useRouter();
const username = ref("");
const password = ref("");
const error = ref("");

async function handleLogin() {
  error.value = "";
  try {
    const token = await login(username.value, password.value);
    localStorage.setItem("token", token);
    router.push("/events");
  } catch (e) {
    error.value = e?.message || "Login gagal";
  }
}
</script>
