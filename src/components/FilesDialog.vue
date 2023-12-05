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

  const csvData = tableData.value.map(({ timestamp, ...row }) => {
    
    row = toCSV(row as DataRecord048)as DataRecord048;

    return row;
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

function toCSV(record: DataRecord048): object {
  const data = {
    sac: record.sac,
    sic: record.sic,
    secondsSinceMidnight: secondsSinceMidnightToString(record.secondsSinceMidnight),
    lat: record.gpsCoords?.lat.toFixed(6).toString() ?? "N/A",
    lon: record.gpsCoords?.lon.toFixed(6).toString() ?? "N/A",
    targetReportType: TargetReport.TYPtoString(record.targetReportType),
    targetReportSimulated: TargetReport.SIMtoString(record.targetReportSimulated),
    targetReportRDPChain: TargetReport.RDPtoString(record.targetReportRDPChain),
    targetReportSPI:  TargetReport.SPItoString(record.targetReportSPI),
    targetReportRAB: TargetReport.RABtoString(record.targetReportRAB),
    targetReportTest: record.targetReportTest,
    targetReportExtendedRange: TargetReport.ERRtoString(record.targetReportExtendedRange),
    targetReportXPulse: TargetReport.XPPtoString(record.targetReportXPulse),
    targetReportMilitaryEmergency: TargetReport.MEtoString(record.targetReportMilitaryEmergency),
    targetReportMilitaryIdentification: TargetReport.MItoString(record.targetReportMilitaryIdentification),
    targetReportFoeFri: TargetReport.FOEFRItoString(record.targetReportFoeFri),
    rho: record.rho,
    theta: record.theta,
    mode3AValidated: Code.ValidatedtoString(record.mode3AValidated),
    mode3AGarbled: Code.GarbledtoString(record.mode3AGarbled),
    mode3ACode: record.mode3ACode?.toString(8).padStart(4, "0") ?? "N/A",
    flightLevelValidated: Code.ValidatedtoString(record.flightLevelValidated),
    flightLevelGarbled: Code.GarbledtoString(record.flightLevelGarbled),
    flightLevel: record.flightLevel?.toString() ?? "N/A",
    correctedFlightLevel: record.correctedFlightLevel,
    radarPlotSRL: record.radarPlotSRL?.toString() ?? "N/A",
    radarPlotSRR: record.radarPlotSRR?.toString() ?? "N/A",
    radarPlotSAM: record.radarPlotSAM?.toString() + " dBm" ?? "N/A",
    radarPlotPRL: record.radarPlotPRL?.toFixed(3).toString() ?? "N/A",
    radarPlotPAM: record.radarPlotPAM?.toString() + " dBm"  ?? "N/A",
    radarPlotRPD: record.radarPlotRPD?.toFixed(3).toString() + " dBm" ?? "N/A",
    radarPlotAPD: record.radarPlotAPD?.toFixed(3).toString() + " dBm" ?? "N/A",
    aircraftaddress: record.aircraftaddress,
    aircraftid: record.aircraftID,
    bds: record.bds?.join(" ") ?? "",
    bds40MCPFCUSelectedAltitude: record.bds40MCPFCUSelectedAltitude?.toString() ?? "N/A",
    bds40FMSSelectedAltitude: record.bds40FMSSelectedAltitude?.toString() ?? "N/A",
    bds40BarometricPressureSetting: record.bds40BarometricPressureSetting?.toString() ?? "N/A",
    bds40MCPFCUMode: BDS.MCPFCUModetoString(record.bds40MCPFCUMode),
    bds40TargetAltSource: BDS.TargetAltSourcetoString(record.bds40TargetAltSource).toString(),
    bds50Roll: record.bds50Roll?.toString() ?? "N/A",
    bds50TrueTrack: record.bds50TrueTrack?.toString() ?? "N/A",
    bds50GS: record.bds50GS?.toString() ?? "N/A",
    bds50TrackRate: record.bds50TrackRate?.toString() ?? "N/A",
    bds50TAS: record.bds50TAS?.toString() ?? "N/A",
    bds60MagneticHeading: record.bds60MagneticHeading?.toString() ?? "N/A",
    bds60IAS: record.bds60IAS,
    bds60MACH: record.bds60MACH,
    bds60BarometricAltitudeRate: record.bds60BarometricAltitudeRate,
    bds60InertialVerticalVelocity: record.bds60InertialVerticalVelocity,
    tracknumber: record.tracknumber,
    Xcomponent: record.Xcomponent?.toString() ?? "N/A",
    Ycomponent: record.Ycomponent?.toString() ?? "N/A",
    calculatedgroundspeed: record.calculatedgroundspeed,
    calculatedheading: record.calculatedheading,
    targetcnf: TargetReport.ConfirmedTentavitoString(record.targetcnf),
    targetrad: TargetReport.TypsensortoString(record.targetrad),
    targetdou: TargetReport.SignalsLevelsConfidencetoString(record.targetdou),
    targetmah: TargetReport.ManoeuvreDetectiontoString(record.targetmah),
    targetcdm: TargetReport.ClimbingDescendingtoString(record.targetcdm),
    tre: TargetReport.TREtoString(record.tre),
    gho: TargetReport.GHOtoString(record.gho),
    sup: TargetReport.SUPtoString(record.sup),
    tcc: TargetReport.TCCtoString(record.tcc),
    h3D: record.h3D?.toString() ?? "N/A",
    ccfCOM: CCF.COMtoString(record.ccfCOM),
    ccfSTAT: CCF.STATtoString(record.ccfSTAT),
    ccfSI: CCF.SItoString(record.ccfSI),
    ccfMSSC: CCF.MSSCtoString(record.ccfMSSC),
    ccfARC: CCF.ARCtoString(record.ccfARC),
    ccfAIC: CCF.AICtoString(record.ccfAIC),
    ccfB1A: "BDS 1.0 bit 16 = " + record.ccfB1A?.toString() ?? "N/A",
    ccfB1B: "BDS 1.0 bits 37/40 = " + record.ccfB1B?.toString(2).padStart(4, "0") ?? "N/A",
  }

  return data
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