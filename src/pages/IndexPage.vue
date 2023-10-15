<template>
  <q-page>
    <q-dialog v-model="loadedFilesDialog">
      <div class="dialog-content row bg-red">
        <div class="col-auto bg-blue" style="width:200px; max-width:50%">
          <div class="column" style="height: 100%">
            <div class="col" style="width: 100%">
              <q-scroll-area style="height: 100%">
                <q-item v-for="file in loadedFiles" :key="file.filename"
                  clickable @click="onFileClick(file.filename)"
                  :active="selectedFiles.has(file.filename)"
                  active-class="bg-white"
                >
                  <q-item-section>
                    <q-item-label>{{ file.filename }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{ file.dataRecords.length }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-scroll-area>
            </div>
            <div class="col-auto row no-wrap q-gutter-sm q-pa-sm">
              <q-space></q-space>
              <q-btn round icon="upload" size="sm" @click="fileInput?.click()"/>
              <input
                ref="fileInput"
                type="file"
                style="display: none"
                multiple
                @change="onFileSelect"
              />
              <q-btn round icon="delete" size="sm" @click="onFileDelete" />
            </div>
          </div>
        </div>
        <div class="col bg-purple" style="height: 100%">
          <q-table
            title="Data Records Category 048"
            :columns="columns"
            :rows="rows"
            row-key="name"
            style="height:100%"
            virtual-scroll
            :pagination="{ rowsPerPage: 0 }"
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFileStore } from 'stores/file-store'
import { AsterixFile, TableColumn, DataRecord } from 'src/asterix/model'
import { DataRecord048 } from 'src/asterix/cat048/cat048'

const fileStore = useFileStore()

const loadedFilesDialog = ref(true)
const fileInput = ref<HTMLInputElement | null>(null)

const loadedFiles = fileStore.files
const selectedFiles = ref<Set<string>>(new Set())

const worker = new Worker(new URL('../asterix/worker.ts', import.meta.url), { type: 'module' })

worker.addEventListener('message', e => {
  const asterixFile = e.data as AsterixFile

  const dataRecords: DataRecord[] = []
  for (const record of asterixFile.dataRecords) {
    switch (record.category) {
      case 48:
        const dataRecord = new DataRecord048()
        Object.assign(dataRecord, record)
        dataRecords.push(dataRecord as DataRecord)
        break
      default:
        // UNKNOWN CATEGORY
        continue
    }
  }

  asterixFile.dataRecords = dataRecords
  fileStore.addFile(asterixFile)
})

function onFileSelect(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files!)
  worker.postMessage(files)
}

function onFileClick(filename: string) {
  if (selectedFiles.value.has(filename)) {
    selectedFiles.value.delete(filename)
  } else {
    selectedFiles.value.add(filename)
  }
}

function onFileDelete() {
  fileStore.deleteFiles(Array.from(selectedFiles.value))
  selectedFiles.value.clear()
}

const columns = ref<TableColumn[]>(DataRecord048.columns())
const rows = computed(() => fileStore.files.map(file => file.dataRecords).flat())

</script>

<style scoped>
.dialog-content {
  width: 700px;
  max-width: 80vw;
  height: 400px;
  max-height: 80vh;
}
</style>
