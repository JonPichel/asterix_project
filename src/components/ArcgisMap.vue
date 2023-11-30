<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"

import { ArcgisMap } from "src/esri/map"
import { DataRecord } from "src/asterix"
import { point } from "@turf/helpers";
import { GPSCoords } from "src/coords";


let map: ArcgisMap

onMounted(() => {
  map = new ArcgisMap("viewDiv")
})

onBeforeUnmount(() => {
  map.destroy()
})

defineExpose({
  addToMap(records: DataRecord[]) {
    map.addDataRecords(records)
  }
}) 
</script>

<template>
  <div id="viewDiv"></div>
  <div id="sliderDiv"></div>
</template>

<style scoped>
#viewDiv {
  position: absolute;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
#sliderDiv {
  position: fixed;
  left: 12vw;
  right: 10vw;
  bottom: 20px;
  max-width: 1360px;
}
</style>