<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRecordStore } from "stores/record-store"
import { DataRecord, TableColumn } from "src/asterix"

import Category048 from "src/asterix/cat048"

import Papa from "papaparse"

import { QTable } from "quasar"
import { secondsSinceMidnightToString } from "src/asterix/utils/time"
import DataRecord048 from "src/asterix/cat048/record"
import * as TargetReport from "../asterix/utils/target-report"
import * as Code from "../asterix/utils/code"
import * as BDS from "../asterix/utils/bds"
import * as CCF from "../asterix/utils/ccf"

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
const rows = computed(() => {
  return Array.from(recordStore.recordsMap.values()).reduce((result, value) => result.concat(value), [])
})

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

function downloadCSV() {
  const tableData = rows;

  const csvData = tableData.value.map(({ gpsCoords, timestamp, ...row }) => {
    
    if ("secondsSinceMidnight" in row) {
      row.secondsSinceMidnight = secondsSinceMidnightToString((row as DataRecord048).secondsSinceMidnight)
    }
    if ("targetReportType" in row){
      row.targetReportType = TargetReport.TYPtoString((row as DataRecord048).targetReportType)
    }
    if ("targetReportSimulated" in row){
      row.targetReportSimulated = TargetReport.SIMtoString((row as DataRecord048).targetReportSimulated)
    }
    if ("targetReportRDPChain" in row){
      row.targetReportRDPChain = TargetReport.RDPtoString((row as DataRecord048).targetReportRDPChain)
    }
    if ("targetReportSPI" in row){
      row.targetReportSPI = TargetReport.SPItoString((row as DataRecord048).targetReportSPI)
    }
    if ("targetReportRAB" in row){
      row.targetReportRAB = TargetReport.RABtoString((row as DataRecord048).targetReportRAB)
    }
    if ("targetReportExtendedRange" in row){
      row.targetReportExtendedRange = TargetReport.ERRtoString((row as DataRecord048).targetReportExtendedRange)
    }
    if ("targetReportXPulse" in row){
      row.targetReportXPulse = TargetReport.XPPtoString((row as DataRecord048).targetReportXPulse)
    }
    if ("targetReportMilitaryEmergency" in row){
      row.targetReportMilitaryEmergency = TargetReport.MEtoString((row as DataRecord048).targetReportMilitaryEmergency)
    }
    if ("targetReportMilitaryIdentification" in row){
      row.targetReportMilitaryIdentification = TargetReport.MItoString((row as DataRecord048).targetReportMilitaryIdentification)
    }
    if ("targetReportFoeFri" in row){
      row.targetReportFoeFri = TargetReport.FOEFRItoString((row as DataRecord048).targetReportFoeFri)
    }
    if ("mode3AValidated" in row){
      row.mode3AValidated = Code.ValidatedtoString((row as DataRecord048).mode3AValidated)
    }
    if ("mode3AGarbled" in row){
      row.mode3AGarbled = Code.GarbledtoString((row as DataRecord048).mode3AGarbled)
    }
    if ("mode3ACode" in row){
      row.mode3ACode = (row as DataRecord048).mode3ACode?.toString(8).padStart(4, "0") ?? "N/A"
    }
    if ("flightLevelValidated" in row){
      row.flightLevelValidated = Code.ValidatedtoString((row as DataRecord048).flightLevelValidated)
    }
    if ("flightLevelGarbled" in row){
      row.flightLevelGarbled = Code.GarbledtoString((row as DataRecord048).flightLevelGarbled)
    }
    if ("bds40MCPFCUMode" in row){
      row.bds40MCPFCUMode = BDS.MCPFCUModetoString((row as DataRecord048).bds40MCPFCUMode)
    }
    if ("bds40TargetAltSource" in row){
      row.bds40TargetAltSource = BDS.TargetAltSourcetoString((row as DataRecord048).bds40TargetAltSource)
    }
    if ("targetcnf" in row){
      row.targetcnf = TargetReport.ConfirmedTentavitoString((row as DataRecord048).targetcnf)
    }
    if ("targetrad" in row){
      row.targetrad = TargetReport.TypsensortoString((row as DataRecord048).targetrad)
    }
    if ("targetdou" in row){
      row.targetdou = TargetReport.SignalsLevelsConfidencetoString((row as DataRecord048).targetdou)
    }
    if ("targetmah" in row){
      row.targetmah = TargetReport.ManoeuvreDetectiontoString((row as DataRecord048).targetmah)
    }
    if ("targetcdm" in row){
      row.targetcdm = TargetReport.ClimbingDescendingtoString((row as DataRecord048).targetcdm)
    }
    if ("tre" in row){
      row.tre = TargetReport.TREtoString((row as DataRecord048).tre)
    }
    if ("gho" in row){
      row.gho = TargetReport.GHOtoString((row as DataRecord048).gho)
    }
    if ("sup" in row){
      row.sup = TargetReport.SUPtoString((row as DataRecord048).sup)
    }
    if ("tcc" in row){
      row.tcc = TargetReport.TCCtoString((row as DataRecord048).tcc)
    }
    if ("ccfCOM" in row){
      row.ccfCOM = CCF.COMtoString((row as DataRecord048).ccfCOM)
    }
    if ("ccfSTAT" in row){
      row.ccfSTAT = CCF.STATtoString((row as DataRecord048).ccfSTAT)
    }
    if ("ccfSI" in row){
      row.ccfSI = CCF.SItoString((row as DataRecord048).ccfSI)
    }
    if ("ccfMSSC" in row){
      row.ccfMSSC = CCF.MSSCtoString((row as DataRecord048).ccfMSSC)
    }
    if ("ccfARC" in row){
      row.ccfARC = CCF.ARCtoString((row as DataRecord048).ccfARC)
    }
    if ("ccfAIC" in row){
      row.ccfAIC = CCF.AICtoString((row as DataRecord048).ccfAIC)
    }

    return row as DataRecord048;
  });

  console.log( csvData[0])
  const csv = Papa.unparse(csvData, { header: true, delimiter: ";" });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const tempLink = document.createElement("a");
  tempLink.href = URL.createObjectURL(blob);
  tempLink.setAttribute("download", "datosAsterix.csv");
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
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
            <q-btn round icon="download" size="sm" @click="downloadCSV" />
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