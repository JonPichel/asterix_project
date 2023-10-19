<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

import { createMap, destroyMap } from 'src/esri/map'

onMounted(() => {
  createMap()
})

onBeforeUnmount(() => {
  destroyMap()
})
</script>

<template>
  <div id="viewDiv"></div>
</template>

<style scoped>
#viewDiv {
  position: absolute;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>