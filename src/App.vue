<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->

    <!-- Main Content -->
    <main
      class="flex-1 space-y-4"
      style="
        background-color: #fafafa;
        padding-bottom: 0rem !important;
        padding-top: 0px !important;
      "
    >
      <router-view />
    </main>
  </div>
</template>

<script setup></script>
<style>
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
