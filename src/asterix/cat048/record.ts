import { DataRecord } from ".."

import * as TargetReport from "../utils/target-report"
import * as CCF from "../utils/ccf"
import * as BDS from "../utils/bds"

export interface DataRecord048 extends DataRecord {
  // I048/010
  sac?: number
  sic?: number
  // I048/140
  secondsSinceMidnight?: number
  // I048/020 (TODO: parse Second Extension)
  targetReportType?: TargetReport.TYP
  targetReportSimulated?: boolean
  targetReportRDPChain?: boolean
  targetReportSPI?: boolean
  targetReportRAB?: boolean
  targetReportTest?: boolean
  targetReportExtendedRange?: boolean
  targetReportXPulse?: boolean
  targetReportMilitaryEmergency?: boolean
  targetReportMilitaryIdentification?: boolean
  targetReportFoeFri?: TargetReport.FOEFRI
  // I048/040
  rho?: number
  theta?: number
  // I048/080
  mode3AValidated?: boolean
  mode3AGarbled?: boolean
  mode3ACode?: number
  // I048/090
  flightLevelValidated?: boolean
  flightLevelGarbled?: boolean
  flightLevel?: number
  correctedFlightLevel?: number
  // I048/130
  radarPlotSRL?: number
  radarPlotSRR?: number
  radarPlotSAM?: number
  radarPlotPRL?: number
  radarPlotPAM?: number
  radarPlotRPD?: number
  radarPlotAPD?: number
  //I048/220
  aircraftaddress?: string
  //I048/240
  aircraftid?: string
  // I048/250
  bds?: string[]
  bds40MCPFCUSelectedAltitude?: number
  bds40FMSSelectedAltitude?: number
  bds40BarometricPressureSetting?: number
  bds40MCPFCUMode?: BDS.MCPFCUMode
  bds40TargetAltSource?: BDS.TargetAltSource
  bds50Roll?: number
  bds50TrueTrack?: number
  bds50GS?: number
  bds50TrackRate?: number
  bds50TAS?: number
  bds60MagneticHeading?: number
  bds60IAS?: number
  bds60MACH?: number
  bds60BarometricAltitudeRate?: number
  bds60InertialVerticalVelocity?: number
  //I048/161
  tracknumber?: number
  //I048/042
  Xcomponent?: number
  Ycomponent?: number
  //I048/200
  calculatedgroundspeed?: number
  calculatedheading?: number
  //I048/170
  targetcnf?: boolean
  targetrad?: TargetReport.Typsensor
  targetdou?: boolean
  targetmah?: boolean
  targetcdm?: TargetReport.typClimbingMode
  tre?: boolean
  gho?: boolean
  sup?: boolean
  tcc?: boolean
  // I048/110
  h3D?: number
  // I048/230
  ccfCOM?: CCF.COM
  ccfSTAT?: CCF.STAT
  ccfSI?: boolean
  ccfMSSC?: boolean
  ccfARC?: boolean
  ccfAIC?: boolean
  ccfB1A?: number
  ccfB1B?: number
}

export default DataRecord048
