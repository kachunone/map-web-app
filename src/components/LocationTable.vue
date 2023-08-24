<template>
  <div class="flex flex-col">
    <!-- Table Header -->
    <div class="flex bg-slate-400">
      <div class="w-0 flex flex-col items-center justify-center">
        <button
          class="bg-red-700 text-white rounded p-1 m-1"
          @click="deleteBtnPressed"
        >
          Delete
        </button>
      </div>
      <div class="w-6/12 flex items-center text-lg">
        Searched Locations - {{ searchedLocations.length }} places(s)
      </div>
    </div>
    <!-- Table Body -->
    <div class="bg-slate-800">
      <div
        v-for="(item, index) in itemsInRange"
        :key="index"
        :class="
          'bg-' + (index % 2 === 0 ? 'gray-200' : 'gray-300') + ' flex p-2 pl-0'
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
    </div>
    <va-pagination
      v-model="value"
      class="self-center m-2"
      :visible-pages="4"
      :total="searchedLocations.length"
      :page-size="itemPerPage"
    />
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";

const { searchedLocations } = defineProps(["searchedLocations"]);
const value = ref(1);
const itemPerPage = 10;

const itemsInRange = computed(() => {
  const startIdx = value.value - 1;
  const endIdx = Math.min(searchedLocations.length, startIdx + itemPerPage);
  // the new sliced array's elements has same references to searchedLocation's ones
  return searchedLocations.slice(startIdx, endIdx);
});

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
