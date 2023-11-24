<script setup lang="ts">
import { ref } from "vue"
import { useRecordStore } from "stores/record-store"
import ArcgisMap from "src/components/ArcgisMap.vue"
import FilesDialog from "src/components/FilesDialog.vue"

import { FileDecodedMessage } from "src/asterix/worker"
import { DataRecord } from "src/asterix"

const recordStore = useRecordStore()

const map = ref<InstanceType<typeof ArcgisMap> | null>(null)

const filesDialog = ref(true)

const worker = new Worker(new URL("../asterix/worker.ts", import.meta.url), { type: "module" })

worker.addEventListener("message", e => {
  const decodedFile = e.data as FileDecodedMessage
  recordStore.addFile(decodedFile.filename, decodedFile.records)
})

function addFiles(files: File[]) {
  worker.postMessage(files)
}

function plotToMap(records: DataRecord[]) {
  map.value?.addToMap(records)
}
</script>

<template>
  <q-page>
    <ArcgisMap ref="map"></ArcgisMap>
    <FilesDialog :visible="filesDialog" @add-files="addFiles" @load-to-map="plotToMap"></FilesDialog>
  </q-page>
</template>

<style scoped>
</style>