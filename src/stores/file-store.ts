import { defineStore } from "pinia"
import { ref } from "vue"

export type LoadedFile = {
  filename: string
  count: number
}

export const useFileStore = defineStore("files", () => {
  const loadedFiles = ref<LoadedFile[]>([])
  const selectedFile = ref<LoadedFile | null>(null)

  function getFiles() {
    fetch("http://localhost:5757/list", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        loadedFiles.value = data.savedFiles
      })
  }

  return {
    loadedFiles,
    selectedFile,
    getFiles,
  }
})
