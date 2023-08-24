<template>
  <div class="flex flex-col">
    <!-- Table Header -->
    <div class="flex bg-slate-400">
      <div class="py-3 w-0 flex flex-col items-center justify-center">
        <button
          class="bg-red-700 text-white rounded p-2 px-4"
          @click="deleteBtnPressed"
        >
          Delete
        </button>
      </div>
      <div class="w-6/12 text flex items-center text-lg">
        Searched Locations
      </div>
    </div>
    <!-- Table Body -->
    <div
      v-for="(item, index) in searchedLocations"
      :key="index"
      :class="
        'bg-' +
        (index % 2 === 0 ? 'gray-200' : 'gray-300') +
        ' flex py-3' +
        (index === 0 ? ' text-blue-500' : '')
      "
    >
      <div class="flex items-center justify-center">
        <va-checkbox class="bg-white w-0" v-model="item.selected" />
      </div>
      <div class="w-6/12 flex items-center justify-center">
        <p class="">
          {{ item.address }}
        </p>
      </div>
    </div>
    <Pagination class="self-center mt-3"></Pagination>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import Pagination from "./Pagination.vue";

const { searchedLocations } = defineProps(["searchedLocations"]);

function deleteBtnPressed() {
  for (let index = searchedLocations.length - 1; index >= 0; index--) {
    const location = searchedLocations[index];
    if (location.selected) {
      searchedLocations.splice(index, 1);
      location.marker.setVisible(false);
      location.marker.setMap(null);
      location.marker.setPosition(null);
      location.marker = null;
    }
  }
}
</script>
