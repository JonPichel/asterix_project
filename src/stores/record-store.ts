import { defineStore } from "pinia"
import { DataRecord } from "src/asterix"
import { ref } from "vue"

type Metadata = {
  filename: string
  aircraftID: string
}

type LoadedFile = {
  filename: string
  count: number
  plotted: boolean
}

export const useRecordStore = defineStore("records", () => {
  const recordsMap = ref<Map<Metadata, DataRecord[]>>(new Map())
  const files = ref<LoadedFile[]>([])

  function addFile(filename: string, records: DataRecord[]) {
    const fileIndex = files.value.findIndex(
      (file) => file.filename === filename
    )
    if (fileIndex === -1) {
      files.value.push({ filename, count: records.length, plotted: false })
    } else {
      files.value[fileIndex].count = records.length
      deleteByFilename(filename)
    }

    const recordsByTarget = new Map<string, DataRecord[]>()
    records.forEach((record) => {
      let records: DataRecord[]
      if (recordsByTarget.has(record.aircraftID!)) {
        records = recordsByTarget.get(record.aircraftID!)!
      } else {
        records = []
      }
      records.push(record)

      recordsByTarget.set(record.aircraftID!, records)
    })

    recordsByTarget.forEach((records, targetID) => {
      const md: Metadata = {
        filename,
        aircraftID: targetID,
      }
      recordsMap.value.set(md, records)
    })
  }

  function removeFile(filename: string) {
    const index = files.value.findIndex((file) => file.filename === filename)
    if (index !== -1) {
      files.value.splice(index, 1)
    }

    deleteByFilename(filename)
  }

  function deleteByFilename(filename: string) {
    const keysToDelete = []
    for (const md of recordsMap.value.keys()) {
      if (md.filename === filename) {
        keysToDelete.push(md)
      }
    }

    keysToDelete.forEach((md) => recordsMap.value.delete(md))
  }

  return {
    recordsMap,
    files,
    addFile,
    removeFile,
  }
})
