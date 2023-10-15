import { defineStore } from "pinia";
import { AsterixFile } from "src/asterix/model";
import { ref } from "vue";

export const useFileStore = defineStore('file', () => {
  const files = ref<AsterixFile[]>([])

  function addFile(newFile: AsterixFile) {
    const fileIndex = files.value.findIndex(file => file.filename === newFile.filename)

    if (fileIndex !== -1) {
      files.value[fileIndex].dataRecords = newFile.dataRecords
    } else {
      files.value.push(newFile)
    }
  }

  function deleteFiles(filenames: string[]) {
    filenames.forEach(filename => {
      const fileIndex = files.value.findIndex(file => file.filename == filename)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }
    })
  }

  return {
    files,
    addFile,
    deleteFiles
  }
})