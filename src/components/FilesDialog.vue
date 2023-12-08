<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useFileStore, LoadedFile } from "stores/file-store"
import { DataRecord, TableColumn } from "src/asterix"

import Category048 from "src/asterix/cat048"

import Papa from "papaparse"

import { QTable, QTableProps } from "quasar"
import DataRecord048 from "src/asterix/cat048/record"
import { A } from "app/dist/electron/UnPackaged/assets/index.4b8dfcc6"

const fileStore = useFileStore()

const fileInput = ref<HTMLInputElement | null>(null)


const props = defineProps<{
  visible: boolean;
}>()

const emit = defineEmits<{
  loadToMap: [],
}>()

const tableRef = ref<InstanceType<typeof QTable>>()

const buttonsDisabled = ref(false)
const rows = ref<DataRecord048[]>([])
const loading = ref(false)
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 10
})

async function fetchRecords(start: number, count: number) {
  return fetch("http://localhost:5757/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      start,
      count
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.text()
  }).then(async data => {
    return await new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        complete: (results) => resolve(results.data),
        error: (error: any) => reject(error)
      })
    }).then(data => {
      console.log("Parsed CSV:", data)
      return data
    }).catch(error => {
      console.error("CSV parsing error:", error)
      throw new Error("CSV parsing error")
    })
  }).catch(error => {
    console.error("Error fetching records:", error)
  })
}


const columns = ref<TableColumn[]>(Category048.tableColumns())

function selectFile(file: LoadedFile) {
  buttonsDisabled.value = true
  const filename = encodeURIComponent(file.filename)
  fetch(`http://localhost:5757/change/${filename}`, {
    method: "POST"
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    fileStore.selectedFile = file

    pagination.value.sortBy = "desc"
    pagination.value.descending = false
    pagination.value.page = 1
    pagination.value.rowsPerPage = 50
    pagination.value.rowsNumber = file.count

    buttonsDisabled.value = false
  }).catch(error => {
    console.error("File change failed:", error)
    buttonsDisabled.value = false
  })
}

function addFiles(event: Event) {
  const formData = new FormData()
  const file = (event.target as HTMLInputElement).files![0]
  formData.append("file", file)
  const filename = file.name

  fetch("http://localhost:5757/upload", {
    method: "POST",
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.json()
  }).then(async data => {
    console.log("File uploaded successfully:", data)
    await fileStore.getFiles()
        if (filename !== undefined) {
          const toSelect = fileStore.loadedFiles.find(
            value => value.filename === filename
          )
          if (toSelect !== undefined) {
            selectFile(toSelect)
          }
        }
  }).catch(error => {
    console.error("File upload failed:", error)
  })
}

function viewTable() {
  tableRef.value?.requestServerInteraction()
}

function removeFiles() {
  if (fileStore.selectedFile === null) return

  buttonsDisabled.value = true

  const filename = encodeURIComponent(fileStore.selectedFile.filename)
  fetch(`http://localhost:5757/delete/${filename}`, {
    method: "DELETE",
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    fileStore.selectedFile = null
    fileStore.getFiles()
    buttonsDisabled.value = false
  }).catch(error => {
    console.error("File deletion failed:", error)
    buttonsDisabled.value = false
  })
}

async function onRequest(props: Parameters<NonNullable<QTableProps["onRequest"]>>[0]) {
  loading.value = true
  const {page, rowsPerPage, sortBy, descending} = props.pagination
  //const filter = props.filter
  console.log(props.pagination)
  console.log(pagination)

  const startRow = (page - 1) * rowsPerPage
  const count = rowsPerPage
  const records: any = await fetchRecords(startRow, count)

  rows.value.splice(0, rows.value.length, ...records)
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  loading.value = false
}

async function exportCSV() {
  if (fileStore.selectedFile === null) return

  fetch(`http://localhost:5757/csv/${fileStore.selectedFile.filename}`, {
    method: "POST"
  }).then(response => {
    if (!response.ok) {
      console.error("Error exporting csv")
    }
  })
}

async function exportKML() {
  if (fileStore.selectedFile === null) return

  fetch(`http://localhost:5757/kml/${fileStore.selectedFile.filename}`, {
    method: "POST"
  }).then(response => {
    if (!response.ok) {
      console.error("Error exporting kml")
    }
  })
}

onMounted(() => {
  fileStore.getFiles()
})
</script>

<template>
  <q-dialog :model-value="props.visible">
    <div class="dialog-content row bg-red">
      <div class="col-auto bg-blue" style="width:300px; max-width:50%">
        <div class="column" style="height: 100%">
          <div class="col" style="width: 100%">
            <q-scroll-area style="height: 100%">
              <q-item v-for="file in fileStore.loadedFiles" :key="file.filename"
                clickable @click="selectFile(file)"
                :active="fileStore.selectedFile?.filename === file.filename"
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
            <q-btn round icon="list" @click="exportCSV" size="sm"/>
            <q-btn round icon="terrain" @click="exportKML" size="sm"/>
            <q-btn round :disable="buttonsDisabled" icon="delete" size="sm" @click="removeFiles" />
          </div>
          <q-btn @click="viewTable">View table</q-btn>
          <q-btn @click="emit('loadToMap')">Plot</q-btn>
        </div>
      </div>
      <div class="col bg-purple" style="height: 100%">
        <q-table
          title="Data Records Category 048"
          ref="tableRef"
          :columns="columns"
          :rows="rows"
          v-model:pagination="pagination"
          :loading="loading"
          @request="onRequest"
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