<script setup>
import { defineProps, onMounted, ref } from "vue";
const { timeInfo } = defineProps(["timeInfo"]);

onMounted(async () => {
  console.log("timeDisplayer mounted");
});
</script>

<template>
  <!-- A view showing time zone and local time of latest searched location -->
  <div class="flex bg-slate-200 min-h-[48px]">
    <p class="bg-gray-300 flex items-center justify-center">
      Latest searched address TimeZone:
    </p>
    <div class="bg-gray-200 flex items-center justify-center text-blue-500 m-1">
      {{ timeInfo.timeZone }}
    </div>
    <p class="bg-gray-300 flex items-center justify-center">
      Latest searched address LocalTime:
    </p>
    <div class="bg-gray-200 flex items-center justify-center text-blue-500 m-1">
      {{ timeInfo.localTime }}
    </div>
  </div>
</template>
