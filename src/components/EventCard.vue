<template>
  <div
    class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
  >
    <h3 class="text-base font-semibold text-gray-900 mb-1">
      {{ event.name }}
    </h3>

    <router-link
      :to="`/events/${event.id}`"
      class="text-sm text-indigo-600 hover:underline"
    >
      ➤ Lihat Detail
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  event: Object,
});
</script>
