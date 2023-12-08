<script setup lang="ts">
import { ref } from "vue"
import ArcgisMap from "src/components/ArcgisMap.vue"
import FilesDialog from "src/components/FilesDialog.vue"
import { Aircraft } from "src/esri/PlaneLayer";

const map = ref<InstanceType<typeof ArcgisMap> | null>(null)

const filesDialog = ref(true)

function plotToMap() {
  fetch("http://localhost:5757/simData", {
    method: "GET"
  }).then(response => {
    if (!response.ok) {
      throw new Error("HTTP ERROR")
    }
    return response.json()
  }).then(jsonData => {
    const aircrafts = jsonData.aircrafts as Aircraft[]
    map.value?.addToMap(aircrafts)
  }).catch(error => {
    console.error("Adding sim data:", error)
  })
}
</script>

<template>
  <q-page>
    <ArcgisMap ref="map"></ArcgisMap>
    <FilesDialog :visible="filesDialog" @load-to-map="plotToMap"></FilesDialog>
  </q-page>
</template>

<style scoped>
</style>