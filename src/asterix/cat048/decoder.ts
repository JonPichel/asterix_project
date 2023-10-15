import { checkFX, octalToDecimal } from "../util"
import { DataRecord048 } from "./cat048"

const Cat048Decoder = {
  decode(buffer: Uint8Array): DataRecord048 {
    // Check FSPEC to know which data fields are present
    const resultFX = checkFX(buffer)

    const dataFieldsBuffer = buffer.slice(resultFX.fieldLength)

    const record: DataRecord048 = new DataRecord048()

    let fieldStart = 0
    for (const frn of resultFX.positions) {
      switch (frn) {
        case 1:
          fieldStart += parse010(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 2:
          fieldStart += parse140(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 3:
          fieldStart += parse020(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 4:
          fieldStart += parse040(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 5:
          fieldStart += parse070(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 6:
          fieldStart += parse090(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 19:
        case 21:
        case 27:
        case 28:
          // FIELDS WE WILL IMPLEMENT
          break
        case 15:
        case 16:
        case 17:
        case 18:
        case 20:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
          // FIELDS WE WON'T IMPLEMENT (silently ignore)
          break
        default:
          throw Error('Malformed category 48 data record')
      }
    }

    return record
  }
}

export default Cat048Decoder

function parse010(record: DataRecord048, buffer: Uint8Array): number {
  record.sac = buffer[0]
  record.sic = buffer[1]
  return 2
}

function parse140(record: DataRecord048, buffer: Uint8Array): number {
  record.secondsSinceMidnight = ((buffer[0] << 16) | (buffer[1] << 8) | buffer[2]) * 1 / 128
  return 3
}

function parse020(record: DataRecord048, buffer: Uint8Array): number {
  const resultFX = checkFX(buffer)

  record.targetReportType = buffer[0] >> 5
  record.targetReportSimulated = (buffer[0] >> 4 & 0b1) == 1
  record.targetReportRDPChain = (buffer[0] >> 3 & 0b1) == 1
  record.targetReportSPI = (buffer[0] >> 2 & 0b1) == 1
  record.targetReportRAB = (buffer[0] >> 1 & 0b1) == 1

  if (resultFX.fieldLength > 1) {
    record.targetReportTest = (buffer[1] >> 7 & 0b1) == 1
    record.targetReportExtendedRange = (buffer[1] >> 6 & 0b1) == 1
    record.targetReportXPulse = (buffer[1] >> 5 & 0b1) == 1
    record.targetReportMilitaryEmergency = (buffer[1] >> 4 & 0b1) == 1
    record.targetReportMilitaryIdentification = (buffer[1] >> 3 & 0b1) == 1
    record.targetReportFoeFri = (buffer[1] >> 1) & 0b11
  }

  return resultFX.fieldLength
}

function parse040(record: DataRecord048, buffer: Uint8Array): number {
  record.rho = ((buffer[0] << 8) | buffer[1]) * 1 / 256 // nautical miles
  record.theta = ((buffer[2] << 8) | buffer[3]) * 360 / 65536 // degrees

  return 4
}

function parse070(record: DataRecord048, buffer: Uint8Array): number {
  record.mode3AValidated = (buffer[0] >> 7 & 0b1) == 0
  record.mode3AGarbled = (buffer[0] >> 6 & 0b1) == 1
  if ((buffer[0] >> 5 & 0b1) == 0) {
    // Code derived from the reply of the transponder
    record.mode3ACode = octalToDecimal(((buffer[0] & 0b1111) << 8) | buffer[1], 4)
  }
  // Else code is not present so we don't set it

  return 2
}

function parse090(record: DataRecord048, buffer: Uint8Array): number {
  record.flightLevelValidated = (buffer[0] >> 7 & 0b1) == 0
  record.flightLevelGarbled = (buffer[0] >> 6 & 0b1) == 1
  record.flightLevel = (((buffer[0] & 0b111111) << 8) | buffer[1]) * 0.25 // FL

  return 2
}