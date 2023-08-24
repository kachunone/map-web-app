<template>
  <!-- A view showing current location and coordinates -->
  <div class="flex flex-col w-[95%]">
    <div class="flex flex-col">
      <button
        @click="getCurrentPosition"
        class="bg-blue-500 text-white rounded p-2 self-start w-auto"
      >
        Get Current Location
      </button>
      <div class="flex flex-col bg-slate-200 rounded w-full self-center m-3">
        <h6 class="va-h6 'bg-gray-200">Your current location:</h6>
        <div class="bg-gray-300 flex items-center h-24 rounded-b">
          <div v-if="loading">
            <va-progress-circle indeterminate :thickness="0.3" />
          </div>
          <div v-else>
            <p class="m-1">{{ currentAddress }}</p>
            <button
              v-if="currentAddress"
              class="bg-blue-500 text-white rounded p-2 m-1"
              @click="
                showOnMap(
                  currentCoordinates.lat,
                  currentCoordinates.lng,
                  currentAddress
                )
              "
            >
              Search On Map
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      id="map"
      class="w-full self-center h-[500px] bg-yellow-200 rounded"
    ></div>

    <!-- search bar for searching location -->
    <div class="flex w-full self-center m-2">
      <button
        @click="searchLocation"
        class="bg-green-500 text-white rounded p-3"
      >
        Search
      </button>
      <input
        v-model="address"
        @keyup.enter="searchLocation"
        type="text"
        class="p-3 w-full rounded ml-2"
        placeholder="Enter a name of location"
      />
    </div>
    <TimeDisplay v-model:timeInfo="timeInfo" class="w-full self-center" />
    <LocationTable :searchedLocations="searchedLocations" />
  </div>
</template>

<script setup>
import { Loader } from "@googlemaps/js-api-loader";
import { ref, onMounted } from "vue";
import LocationTable from "./LocationTable.vue";
import TimeDisplay from "./TimeDisplay.vue";
import { fetchTimeZoneInfo } from "../helper.js";

let map = null;
const address = ref("");
const currentAddress = ref("");
const currentCoordinates = ref("");
const loading = ref(false);

//the var is binded to TimeDisplay component
const timeInfo = ref({});

let searchedLocations = ref([]);

function addDummydata() {
  searchedLocations.value.unshift({
    marker: null,
    address: "New York",
    selected: false,
  });
}

onMounted(() => {
  console.log("component mounted");
  initializeMap();
});

async function initializeMap() {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY,
  });
  await loader.importLibrary("maps");

  map = new google.maps.Map(document.getElementById("map"), {
    mapId: "MAP_SEARCH",
    zoom: 15,
    center: new google.maps.LatLng(43.7170823750029, -79.33888347817272),
  });
}

async function showOnMap(lat, lng, address) {
  if (!map) {
    return;
  }

  map.setCenter(new google.maps.LatLng(lat, lng));
  const marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(lat, lng),
  });

  searchedLocations.value.unshift({
    marker: marker,
    address: address.toUpperCase(),
    selected: false,
  });

  const coordinates = {
    lat: lat,
    lng: lng,
  };
  const info = await fetchTimeZoneInfo(coordinates);
  timeInfo.value = info;
}

async function searchLocation() {
  if (address.value === "") {
    alert("Address cannot be empty!");
    return;
  }

  const { Geocoder } = await google.maps.importLibrary("geocoding");
  const geocoder = new Geocoder();
  geocoder.geocode(
    { address: address.value },
    async function (results, status) {
      if (status === "OK") {
        showOnMap(
          results[0].geometry.location.lat(),
          results[0].geometry.location.lng(),
          address.value
        );
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }
  );
}

async function getCurrentPosition() {
  try {
    loading.value = true;
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    loading.value = false;
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    const geocoder = new Geocoder();
    geocoder
      .geocode({
        location: new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        ),
      })
      .then((response) => {
        if (response.results[0]) {
          currentAddress.value = response.results[0].formatted_address;
          currentCoordinates.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));
  } catch (error) {
    throw error;
  }
}
</script>
