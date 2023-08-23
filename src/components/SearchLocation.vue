<template>
  <!-- A view showing current location and coordinates -->
  <div class="flex flex-col w-[95vw] my-10">
    <div class="w-full flex flex-col">
      <button
        @click="getCurrentPosition"
        class="bg-blue-500 text-white rounded p-3 mb-5 self-center"
      >
        Get Current Location
      </button>
      <div class="flex flex-col bg-slate-200 rounded mb-4">
        <h6 class="va-h6 'bg-gray-200">Your current location:</h6>
        <div class="bg-gray-300 h-14 flex items-center">
          <div v-if="loading">
            <va-progress-circle indeterminate :thickness="0.3" />
          </div>
          <p v-else="loading">
            {{ currentAddress }}
          </p>
        </div>
        <h6 class="va-h6 bg-gray-200">Your current coordinates:</h6>
        <div class="bg-gray-300 h-14 flex items-center rounded-b">
          <div v-if="loading">
            <va-progress-circle indeterminate :thickness="0.3" />
          </div>
          <p v-else="loading">
            {{ currentCoordinates }}
          </p>
        </div>
      </div>
    </div>

    <!-- search bar for searching location -->
    <div class="flex flex-col items-center justify-center w-full my-2">
      <div class="flex w-full">
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
          class="ml-2 p-2 w-full rounded outline-none"
          placeholder="Enter Address"
        />
      </div>
    </div>

    <!-- A map container -->
    <div id="map" class="w-full h-[700px] bg-yellow-200 rounded"></div>

    <!-- A view showing time zone and local time of latest searched location -->
    <div class="flex flex-col bg-slate-200 rounded my-4">
      <h6 class="va-h6 'bg-gray-200">Latest searched address TimeZone:</h6>
      <div class="bg-gray-300 h-14 flex items-center">
        {{ latestTimeZone }}
      </div>
      <h6 class="va-h6 bg-gray-200">Latest searched address LocalTime:</h6>
      <div class="bg-gray-300 h-14 flex items-center rounded-b">
        {{ latestLocalTime }}
      </div>
    </div>
    <LocationTable :searchedLocations="searchedLocations" />
  </div>
</template>

<script setup>
import { Loader } from "@googlemaps/js-api-loader";
import { ref, onMounted } from "vue";
import LocationTable from "./LocationTable.vue";

let map = null;
const address = ref("");
const currentAddress = ref("");
const currentCoordinates = ref("");
const loading = ref(false);

//DUMMY DATA
const latestTimeZone = ref("Eastern Daylight Time");
const latestLocalTime = ref("2023-08-23T14:30:00");

let searchedLocations = ref([]);

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

  searchedLocations.value.push({
    marker: marker,
    address: address.toUpperCase(),
    selected: false,
  });
}

async function searchLocation() {
  const { Geocoder } = await google.maps.importLibrary("geocoding");
  const geocoder = new Geocoder();
  geocoder.geocode({ address: address.value }, function (results, status) {
    if (status == "OK") {
      showOnMap(
        results[0].geometry.location.lat(),
        results[0].geometry.location.lng(),
        address.value
      );
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
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
          currentCoordinates.value = `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`;
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
