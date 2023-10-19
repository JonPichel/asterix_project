import { checkFX, octalToDecimal, twosComplement } from "../util"
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
          fieldStart += parse130(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 8:
          fieldStart += parse220(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 9:
          fieldStart += parse240(record, dataFieldsBuffer.slice(fieldStart))
        break
        case 10:
          fieldStart += parse250(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 11:
          fieldStart += parse161(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 12:
          fieldStart += parse042(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 13:
          fieldStart += parse200(record, dataFieldsBuffer.slice(fieldStart))
          break
        case 14:
          fieldStart += parse170(record, dataFieldsBuffer.slice(fieldStart))
          break
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

function parse130(record: DataRecord048, buffer: Uint8Array): number {
  const resultFX = checkFX(buffer)
  if (resultFX.fieldLength !== 1) {
    throw Error("Bad length")
  }

  let fieldStart = 1
  for (const subfrn of resultFX.positions) {
    switch (subfrn) {
      case 1:
        record.radarPlotSRL = buffer[fieldStart] * 360 / 8192
        fieldStart++
        break
      case 2:
        record.radarPlotSRR = buffer[fieldStart]
        fieldStart++
        break
      case 3:
        record.radarPlotSAM = twosComplement(buffer[fieldStart], 8)
        fieldStart++
        break
      case 4:
        record.radarPlotPRL = buffer[fieldStart] * 360 / 8192
        fieldStart++
        break
      case 5:
        record.radarPlotPAM = twosComplement(buffer[fieldStart], 8)
        fieldStart++
        break
      case 6:
        record.radarPlotRPD = buffer[fieldStart] / 256
        fieldStart++
        break
      case 7:
        record.radarPlotAPD = buffer[fieldStart] * 360 / 16384
        fieldStart++
        break
      default:
        throw Error('Malformed category 48 data record')
    }
  }

  return resultFX.fieldLength + (fieldStart - 1)
}

//DUDA da solo numeros y deberesa dar combinacion de letras y numeros
function parse220(record: DataRecord048, buffer: Uint8Array): number {
  record.aircraftaddress= ((buffer[0] << 16) | (buffer[1] << 8) | buffer[2])
  return 3

}
function parse240(record: DataRecord048,buffer: Uint8Array): number {
  const bufferString = new TextDecoder('utf-8').decode(buffer)
  // DUDA: symbol table equal to base64?
  record.aircraftid = btoa(bufferString)
  return 6

}

function parse161(record: DataRecord048, buffer: Uint8Array): number {
  record.tracknumber = ((buffer[0] & 0b1111) << 8 | buffer[1])
  return 2

}

function parse250(record: DataRecord048, buffer: Uint8Array): number {
  const n = buffer[0]
  const bds = []
  for (let i = 0; i < n; i++) {
    const data = buffer.slice(1 + 8 * n, 1 + 8 * (n + 1) - 1)
    const bds1 = buffer[1 + 8*n - 1] >> 4
    const bds2 = buffer[1 + 8*n - 1] & 0b1111
    bds.push(buffer[1 + 8*n - 1])
    if (bds2 == 0) {
      if (bds1 == 4) {
        if ((data[0] >> 7 & 0b1) === 1) {
          // XAAAAAAA BBBBBXXX
          // 0AAAA AAA00000
          //       000BBBBB
          // 0AAAA AAABBBBB
          record.bds40MCPFCUSelectedAltitude = (((data[0] & 0b01111111) << 5) | (data[1] >> 3)) * 16 // ft
        }
        if ((data[1] >> 2 & 0b1) === 1) {
          // XXXXXXAA BBBBBBBB CCXXXXXX
          // 00 0000AA00 00000000
          //          BB BBBBBB00
          //             000000CC
          // 00 0000AABB BBBBBBCC
          record.bds40FMSSelectedAltitude = ((data[1] & 0b11) << 10) | (data[2] << 2) | (data[3] >> 6) * 16 // ft
        }
        if ((data[3] >> 5 & 0b1) === 1) {
          // XXXAAAAA BBBBBBB0
          // 000AAAAA A0000000
          //          0BBBBBBB
          // 000AAAAA ABBBBBBB
          record.bds40BarometricPressureSetting = (((data[3] & 0b11111) << 7) | (data[4] >> 1)) * 0.1 // mb
        }
        if ((data[5] & 0b1) === 1) {
          record.bds40MCPFCUMode = data[6] >> 5
        }
        if ((data[6] >> 2 & 0b1) === 1) {
          record.bds40TargetAltSource = data[6] & 0b11
        }
      } else if (bds1 == 5) {
        if ((data[0] >> 7 & 0b1) === 1) {
          const sign = (data[0] >> 6 & 0b1) === 1 ? -1 : 1
          record.bds50Roll = sign * (((data[0] & 0b111111) << 3) | (data[1] >> 5)) * 45 / 256 // º
        }
        if ((data[1] >> 4 & 0b1) === 1) {
          const sign = (data[1] >> 3 & 0b1) === 1 ? -1 : 1
          record.bds50TrueTrack =  sign * (((data[1] & 0b111) << 7) | (data[2] >> 1)) * 90 / 512 // º
        }
        if ((data[2] & 0b1) === 1) {
          record.bds50GS = ((data[3] << 2) | (data[4] >> 6)) * 1024 / 512 // kt
        }
        if ((data[4] >> 5 & 0b1) === 1) {
          const sign = (data[4] >> 4 & 0b1) === 1 ? -1 : 1
          record.bds50TrackRate = sign * (((data[4] & 0b1111) << 5) | (data[5] >> 3)) * 8 / 256 // º/s
        }
        if ((data[5] >> 2 & 0b1) === 1) {
          record.bds50TAS = (((data[5] & 0b11) << 8) | data[6]) * 2 // kt
        }
      } else if (bds1 == 6) {
        if ((data[0] >> 7 & 0b1) === 1) {
          const sign = (data[0] >> 6 & 0b1) === 1 ? -1 : 1
          record.bds60MagneticHeading = sign * (((data[0] & 0b111111) << 4) | (data[1] >> 4)) * 90 / 512 // º
        }
        if ((data[1] >> 3 & 0b1) === 1) {
          record.bds60IAS =  ((data[1] & 0b111) << 7) | (data[2] >> 1) // kt
        }
        if ((data[2] & 0b1) === 1) {
          record.bds60MACH = ((data[3] << 2) | (data[4] >> 6)) * 2.048 / 512 // MACH
        }
        if ((data[4] >> 5 & 0b1) === 1) {
          const sign = (data[4] >> 4 & 0b1) === 1 ? -1 : 1
          record.bds60BarometricAltitudeRate = sign * (((data[4] & 0b1111) << 5) | (data[5] >> 3)) * 8192 / 256 // ft/min
        }
        if ((data[5] >> 2 & 0b1) === 1) {
          const sign = (data[5] >> 1 & 0b1) === 1 ? -1 : 1
          record.bds60InertialVerticalVelocity = sign * (((data[5] & 0b1) << 8) | data[6]) * 8192 / 256 // ft/min
        }
      }
    }
  }

  record.bds = bds
  return 1 + 8 * n
}
function parse042(record: DataRecord048, buffer: Uint8Array): number {
  record.Xcomponent = twosComplement(buffer[0] << 8 | buffer[1],16)* 1 / 128
  record.Ycomponent = twosComplement(buffer[2] << 8 | buffer[3],16)* 1 / 128
  return 4
}
function parse200(record: DataRecord048, buffer: Uint8Array): number{
  record.calculatedgroundspeed = buffer[0] << 8 | buffer[1]* 0.22
  record.calculatedheading = buffer[2] << 8 | buffer[3]* (360/65536)
  return 4

}
//DUDA: da peor algunos campos girados
function parse170(record: DataRecord048, buffer: Uint8Array): number {
  const resultFX = checkFX(buffer)

  record.targetcnf = (buffer[0] >> 7 & 0b1) == 1
  record.targetrad = (buffer[0] >> 6) & 0b11
  record.targetdou = (buffer[0] >> 4 & 0b1) == 1
  record.targetmah = (buffer[0] >> 3 & 0b1) == 1
  record.targetcdm = (buffer[0] >> 2) & 0b11
  
  if (resultFX.fieldLength > 1) {
    record.tre = (buffer[1] >> 7 & 0b1) == 1
    record.gho = (buffer[1] >> 6 & 0b1) == 1
    record.sup = (buffer[1] >> 5 & 0b1) == 1
    record.tcc = (buffer[1] >> 4 & 0b1) == 1
    
  }

  return resultFX.fieldLength

}