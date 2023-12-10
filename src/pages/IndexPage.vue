<script setup lang="ts">
import { ref } from "vue"
import ArcgisMap from "src/components/ArcgisMap.vue"
import FilesDialog from "src/components/FilesDialog.vue"
import { Aircraft } from "src/esri/PlaneLayer";

const map = ref<InstanceType<typeof ArcgisMap> | null>(null)

const filesDialog = ref(true)

function plotToMap() {
  map.value?.clear()
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

function showDialog() {
  filesDialog.value = true
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Asterix Project
        </q-toolbar-title>

        <q-btn flat round dense icon="folder" class="q-mr-xs" @click="showDialog"/>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <ArcgisMap ref="map"></ArcgisMap>
        <q-dialog v-model="filesDialog">
          <FilesDialog @load-to-map="plotToMap"></FilesDialog>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
</style>