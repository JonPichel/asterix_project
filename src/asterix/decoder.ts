import Cat048Decoder from './cat048/decoder'
import { DataRecord } from './model'

export function decodeBuffer(buffer: ArrayBuffer): DataRecord[] {
  const bytes = new Uint8Array(buffer)

  let i = 0
  const dataRecords: DataRecord[] = []
  while (i < bytes.length) {
    const category = bytes[i];
    const length = (bytes[i+1] << 8) | bytes[i+2]
    const dataRecord = bytes.slice(i+3, i+length)

    switch (category) {
      case 48:
        try {
          const record = Cat048Decoder.decode(dataRecord)
          dataRecords.push(record)
        } catch (error) {
          console.log(error)
        }
        break
      default:
        console.log('Data record not implemented')
        break
    } 
    i += length
  }

  return dataRecords
}