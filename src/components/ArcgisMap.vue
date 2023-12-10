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
  }
}) 

/*
function convertirKML() {
  let kml = `
    <Folder> 
      <name>rutas</name> 
      <open>1</open>`;

  for (const aircraft of map.planeLayer.aircrafts) {
    kml += `
      <Style id="yellowLineGreenPoly">
        <LineStyle>
          <color>7f00ff00</color> 
          <width>4</width>
        </LineStyle>
      </Style>
      <Placemark>
        <name>${aircraft.aircraftID}</name>
        <styleUrl>#yellowLineGreenPoly</styleUrl>
        <LineString>
          <tessellate>1</tessellate>
          <altitudeMode>absolute</altitudeMode>
          <coordinates>
    `;
    for (const  record of aircraft.route) {
      const coords = record.gpsCoords
      if(coords)
      kml += `${coords.lon},${coords.lat},${coords.alt} `;
    }
    kml += `
          </coordinates>
        </LineString>
      </Placemark>
    `;
  }
  kml += "</Folder>";

  // Crear un objeto Blob con los datos en formato KML
  const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });

  // Crear un enlace para la descarga del archivo
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "aircraftTracks.kml";

  // Agregar el enlace al documento y simular un clic para iniciar la descarga
  document.body.appendChild(link);
  link.click();

  // Eliminar el enlace del documento
  document.body.removeChild(link);
}
*/
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