<script setup lang="ts">
import { computed, ref } from "vue"
import { useRecordStore } from "stores/record-store"
import { DataRecord, TableColumn } from "src/asterix"

import Category048 from "src/asterix/cat048"

import { QTable } from "quasar"

const recordStore = useRecordStore()

const fileInput = ref<HTMLInputElement | null>(null)

const loadedFiles = recordStore.files
const selectedFiles = ref<Set<string>>(new Set())
const buttonsDisabled = ref(false)

const props = defineProps<{
  visible: boolean;
}>()

const emit = defineEmits<{
  addFiles: [files: File[]]
  loadToMap: [records: DataRecord[]],
}>()


const columns = ref<TableColumn[]>(Category048.tableColumns())
const rows = computed(() => Array.from(recordStore.recordsMap.values()).reduce((result, value) => result.concat(value), []))

function addFiles(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files!)
  emit("addFiles", files)
}

function toggleSelect(filename: string) {
  if (selectedFiles.value.has(filename)) {
    selectedFiles.value.delete(filename)
  } else {
    selectedFiles.value.add(filename)
  }
}

function removeFiles() {
  buttonsDisabled.value = true

  selectedFiles.value.forEach(filename => {
    recordStore.removeFile(filename)
  })
  selectedFiles.value.clear()

  buttonsDisabled.value = false
}
</script>

<template>
  <q-dialog :model-value="props.visible">
    <div class="dialog-content row bg-red">
      <div class="col-auto bg-blue" style="width:300px; max-width:50%">
        <div class="column" style="height: 100%">
          <div class="col" style="width: 100%">
            <q-scroll-area style="height: 100%">
              <q-item v-for="file in loadedFiles" :key="file.filename"
                clickable @click="toggleSelect(file.filename)"
                :active="selectedFiles.has(file.filename)"
                active-class="bg-white"
              >
                <q-item-section>
                  <q-item-label>{{ file.filename }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ file.count }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-scroll-area>
          </div>
          <div class="col-auto row no-wrap q-gutter-sm q-pa-sm">
            <q-space></q-space>
            <q-btn round :disable="buttonsDisabled" icon="upload" size="sm" @click="fileInput?.click()"/>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              multiple
              @change="addFiles"
            />
            <q-btn round :disable="buttonsDisabled" icon="delete" size="sm" @click="removeFiles" />
          </div>
          <q-btn @click="emit('loadToMap', rows)">Plot</q-btn>
        </div>
      </div>
      <div class="col bg-purple" style="height: 100%">
        <q-table
          title="Data Records Category 048"
          :columns="columns"
          :rows="rows"
          row-key="id"
          style="height:100%"
        />
      </div>
    </div>
  </q-dialog>
</template>

<style scoped>
.dialog-content {
  width: 2000;
  max-width: 80vw;
  height: 1200px;
  max-height: 80vh;
}
</style>