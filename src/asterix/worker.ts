import { DataRecord } from "."
import { decodeBuffer } from "./binary"

export type DecodeFilesMessage = File[]

export type FileDecodedMessage = {
  filename: string
  records: DataRecord[]
}

addEventListener("message", (e) => {
  const files = e.data as DecodeFilesMessage

  files.forEach((file) => {
    const filename = file.name
    console.log("add start", new Date())
    file.arrayBuffer().then((content) => {
      const records = decodeBuffer(content)
      postMessage({
        filename,
        records,
      } as FileDecodedMessage)
    })
  })
})
