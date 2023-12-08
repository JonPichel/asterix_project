const { decodeBuffer } = require("../src/asterix/binary")
const { parentPort } = require("worker_threads")

/*
type DecodeFilesMessage = {
  filename: string
  content: ArrayBuffer
}[]

type FileDecodedMessage = {
  filename: string
  records: any[]
}
*/

parentPort?.on("message", (files) => {
  console.log("message received on worker")
  files.forEach((file) => {
    const filename = file.filename
    const records = decodeBuffer(file.content)
    parentPort?.postMessage({
      filename,
      records,
    })
  })
})
