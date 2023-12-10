<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"

import { ArcgisMap } from "src/esri/map"
import { Aircraft } from "src/esri/PlaneLayer"


let map: ArcgisMap

onMounted(() => {
  map = new ArcgisMap("viewDiv")
})

onBeforeUnmount(() => {
  map.destroy()
})

defineExpose({
  addToMap(aircrafts: Aircraft[]) {
    map.addAircrafts(aircrafts)
  },
  clear() {
    map.clear()
  }
}) 

</script>

<template>
  <div id="viewDiv"></div>
  <div id="sliderDiv">
    <!--<q-btn round icon="download" size="sm" @click="convertirKML" />-->
    <q-btn label="X1" size="sm" @click="map.setSpeed(1)" />
    <q-btn label="X2" size="sm" @click="map.setSpeed(2)" />
    <q-btn label="X4" size="sm" @click="map.setSpeed(4)" />
    <q-btn label="X6" size="sm" @click="map.setSpeed(6)" />
  </div>

  <q-btn round id="pathButton" icon="route" color="light-blue" size="sm" @click="map.togglePath()"/>
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

#pathButton {
  position: fixed;
  top: 70px;
  right: 20px;
}
</style>