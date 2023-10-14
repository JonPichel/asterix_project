
function decodeFile(buffer: ArrayBuffer): DataRecord048[] {
  const bytes = new Uint8Array(buffer)

  let i = 0;
  const dataRecords = []
  while (i < bytes.length) {
    const category = bytes[i];
    const length = (bytes[i+1] << 8) | bytes[i+2]
    const dataRecord = bytes.slice(i+3, i+length)

    switch (category) {
      case 0x48:
        dataRecords.push(parseCat048(dataRecord))
        break
      default:
        console.log("Unknown category")
        break
    } 
    i += length
  }

  return dataRecords
}

type TargetReportType = 'no detection'
                      | 'single PSR detection'
                      | 'single SSR detection'
                      | 'SSR + PSR detection'
                      | 'Single ModeS All-Call'
                      | 'Single ModeS Roll-Call'
                      | 'ModeS All-Call + PSR'
                      | 'ModeS Roll-Call + PSR'

type TargetReportRAB = 'aircraft transponder' | 'fixed transponder'

type TargetReportFoeFri = 'no mode' | 'friendly' | 'unknown' | 'no reply'

interface DataRecord048 {
  // I048/010
  sac: number;
  sic: number;
  // I048/140
  secondsSinceMidnight: number;
  // I048/020 (TODO: parse Second Extension)
  targetReportType: TargetReportType;
  targetReportSimulated: boolean;
  targetReportRDPChain: number;
  targetReportSPI: boolean;
  targetReportRAB: TargetReportRAB;
  targetReportTest: boolean;
  targetReportExtendedRange: boolean;
  targetReportXPulse: boolean;
  targetReportMilitaryEmergency: boolean;
  targetReportMilitaryIdentification: boolean;
  targetReportFoeFri: TargetReportFoeFri;
  // I048/040
  rho: number;
  theta: number;
  // I048/080
  mode3AValidated: boolean;
  mode3AGarbled: boolean;
  mode3ACode: number;
  // I048/090
  flightLevelValidated: boolean;
  flightLevelGarbled: boolean;
  flightLevel: number;
}

const cat048Parsers = new Map([
  [1, parseI048010],
  [2, parseI048140],
  [3, parseI048020],
  [4, parseI048040],
  [5, parseI048070],
  [6, parseI048090],
])

function parseCat048(dataRecordBuffer: Uint8Array): DataRecord048 {
  // Check FSPEC to know which data fields are present
  const resultFX = checkFX(dataRecordBuffer)

  const dataFieldsBuffer = dataRecordBuffer.slice(resultFX.fieldLength)

  // Iterate over the present fields using the parser associated to each position in the FSPEC
  let i = 0
  const dataRecord = {} as DataRecord048
  resultFX.positions.forEach((frn) => {
    const parser = cat048Parsers.get(frn)
    if (parser === undefined) {
      console.log("Not implemented")
      return
    }
    i += parser(dataFieldsBuffer.slice(i), dataRecord)
  })

  return dataRecord
}


function parseI048010(buffer: Uint8Array, dataRecord: DataRecord048): number {
  dataRecord.sac = buffer[0]
  dataRecord.sic = buffer[1]
  return 2
}

function parseI048140(buffer: Uint8Array, dataRecord: DataRecord048): number {
  dataRecord.secondsSinceMidnight = ((buffer[0] << 16) | (buffer[1] << 8) | buffer[2]) * 1 / 128
  return 3
}

function parseI048020(buffer: Uint8Array, dataRecord: DataRecord048): number {
  const resultFX = checkFX(buffer)

  const types: TargetReportType[] = [
    'no detection',
    'single PSR detection',
    'single SSR detection',
    'SSR + PSR detection',
    'Single ModeS All-Call',
    'Single ModeS Roll-Call',
    'ModeS All-Call + PSR',
    'ModeS Roll-Call + PSR'
  ]
  dataRecord.targetReportType = types[buffer[0] >> 5]!
  dataRecord.targetReportSimulated = (buffer[0] >> 4 & 0b1) != 0
  dataRecord.targetReportRDPChain = (buffer[0] >> 3 & 0b1) == 0 ? 1 : 2
  dataRecord.targetReportSPI = (buffer[0] >> 2 & 0b1) != 0
  dataRecord.targetReportRAB = (buffer[0] >> 1 & 0b1) == 0 ? 'aircraft transponder' : 'fixed transponder'

  if (resultFX.fieldLength > 1) {
    dataRecord.targetReportTest = (buffer[1] >> 7 & 0b1) != 0
    dataRecord.targetReportExtendedRange = (buffer[1] >> 6 & 0b1) != 0
    dataRecord.targetReportXPulse = (buffer[1] >> 5 & 0b1) != 0
    dataRecord.targetReportMilitaryEmergency = (buffer[1] >> 4 & 0b1) != 0
    dataRecord.targetReportMilitaryIdentification = (buffer[1] >> 3 & 0b1) != 0
    const foeFris: TargetReportFoeFri[] = [
      'no mode',
      'friendly',
      'unknown',
      'no reply'
    ]
    dataRecord.targetReportFoeFri = foeFris[(buffer[1] >> 1) & 0b11]!
  }

  // TODO: second extension

  return resultFX.fieldLength
}

function parseI048040(buffer: Uint8Array, dataRecord: DataRecord048): number {
  dataRecord.rho = ((buffer[0] << 8) | buffer[1]) * 1 / 256 // nautical miles
  dataRecord.theta = ((buffer[2] << 8) | buffer[3]) * 0.0055 // degrees

  return 4
}

function parseI048070(buffer: Uint8Array, dataRecord: DataRecord048): number {
  dataRecord.mode3AValidated = (buffer[0] >> 7 & 0b1) == 0
  dataRecord.mode3AGarbled = (buffer[0] >> 6 & 0b1) != 0
  if ((buffer[0] >> 5 & 0b1) == 0) {
    // Code derived from the reply of the transponder
    dataRecord.mode3ACode = octalToDecimal(((buffer[0] & 0b1111) << 8) | buffer[1], 4)
  }
  // Else code is not present so we don't set it

  return 2
}

function parseI048090(buffer: Uint8Array, dataRecord: DataRecord048): number {
  dataRecord.flightLevelValidated = (buffer[0] >> 7 & 0b1) == 0
  dataRecord.flightLevelGarbled = (buffer[0] >> 6 & 0b1) != 0
  dataRecord.flightLevel = (((buffer[0] & 0b111111) << 8) | buffer[1]) * 0.25 // flight level

  return 2
}