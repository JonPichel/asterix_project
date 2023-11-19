import { COM } from './ccf';
import { DataRecord, TableColumn } from '../model';
import { GarbledtoString, ValidatedtoString } from './code';
import * as TargetReport from './target-report'
import * as CCF from './ccf'
import * as BDS from './bds'

export class DataRecord048 implements DataRecord {
  category = 48;

  // I048/010
  sac?: number;
  sic?: number;
  // I048/140
  secondsSinceMidnight?: number;
  // I048/020 (TODO: parse Second Extension)
  targetReportType?: TargetReport.TYP;
  targetReportSimulated?: boolean;
  targetReportRDPChain?: boolean;
  targetReportSPI?: boolean;
  targetReportRAB?: boolean;
  targetReportTest?: boolean;
  targetReportExtendedRange?: boolean;
  targetReportXPulse?: boolean;
  targetReportMilitaryEmergency?: boolean;
  targetReportMilitaryIdentification?: boolean;
  targetReportFoeFri?: TargetReport.FOEFRI;
  // I048/040
  rho?: number;
  theta?: number;
  // I048/070
  mode3AValidated?: boolean;
  mode3AGarbled?: boolean;
  mode3ACode?: number; //SE SALTA UN VALOR SI PONEMOS QUE SE VEAN 15 D1
  // I048/090
  flightLevelValidated?: boolean;
  flightLevelGarbled?: boolean;
  flightLevel?: number;
  correctedFlightLevel?:number;
  // I048/130
  radarPlotSRL?: number;
  radarPlotSRR?: number;
  radarPlotSAM?: number;
  radarPlotPRL?: number;
  radarPlotPAM?: number;
  radarPlotRPD?: number;
  radarPlotAPD?: number;
  //I048/220
  aircraftaddress?: string; 
  //I048/240
  aircraftid?: string;
  // I048/250 
  bds?: string[];
  bds40MCPFCUSelectedAltitude?: number;
  bds40FMSSelectedAltitude?: number;
  bds40BarometricPressureSetting?: number;
  bds40MCPFCUMode?: BDS.MCPFCUMode;
  bds40TargetAltSource?: BDS.TargetAltSource;
  bds50Roll?: number;
  bds50TrueTrack?: number;
  bds50GS?: number;
  bds50TrackRate?: number;
  bds50TAS?: number;
  bds60MagneticHeading?: number;
  bds60IAS?: number;
  bds60MACH?: number;
  bds60BarometricAltitudeRate?: number;
  bds60InertialVerticalVelocity?: number;
  //I048/161
  tracknumber?:number;
  //I048/042
  Xcomponent?:number;
  Ycomponent?:number;
  //I048/200
  calculatedgroundspeed?: number;
  calculatedheading?:number;
  //I048/170
  targetcnf?: boolean;
  targetrad?: TargetReport.Typsensor;
  targetdou?: boolean;
  targetmah?: boolean;
  targetcdm?: TargetReport.typClimbingMode;
  tre?: boolean;
  gho?: boolean;
  sup?: boolean;
  tcc?: boolean;
  // I048/110
  h3D?: number;
  // I048/230
  ccfCOM?: CCF.COM;
  ccfSTAT?: CCF.STAT;
  ccfSI?: boolean;
  ccfMSSC?: boolean;
  ccfARC?: boolean;
  ccfAIC?: boolean;
  ccfB1A?: number;
  ccfB1B?: number;
  

  columns(): TableColumn[] {
    return [
      { name: 'sac', label: 'SAC', field: 'sac' },
      { name: 'sic', label: 'SIC', field: 'sic' },
      { name: 'time', label: 'Time', field: (row: DataRecord) =>  (row as DataRecord048).time()},
      { name: 'trtyp', label: 'TR Type', field: (row: DataRecord) =>  TargetReport.TYPtoString((row as DataRecord048).targetReportType)},
      { name: 'trsim', label: 'TR Simulated', field: (row: DataRecord) =>  TargetReport.SIMtoString((row as DataRecord048).targetReportSimulated)},
      { name: 'trrdp', label: 'TR RDP', field: (row: DataRecord) =>  TargetReport.RDPtoString((row as DataRecord048).targetReportRDPChain)},
      { name: 'trspi', label: 'TR SPI', field: (row: DataRecord) =>  TargetReport.SPItoString((row as DataRecord048).targetReportSPI)},
      { name: 'trrab', label: 'TR RAB', field: (row: DataRecord) =>  TargetReport.RABtoString((row as DataRecord048).targetReportRAB)},
      { name: 'trerr', label: 'TR Extended Range', field: (row: DataRecord) =>  TargetReport.ERRtoString((row as DataRecord048).targetReportExtendedRange)},
      { name: 'trxpp', label: 'TR X-Pulse', field: (row: DataRecord) =>  TargetReport.XPPtoString((row as DataRecord048).targetReportXPulse)},
      { name: 'trme', label: 'TR Mil. Emergency', field: (row: DataRecord) =>  TargetReport.MEtoString((row as DataRecord048).targetReportMilitaryEmergency)},
      { name: 'trmi', label: 'TR Mil. ID', field: (row: DataRecord) =>  TargetReport.MItoString((row as DataRecord048).targetReportMilitaryIdentification)},
      { name: 'trfoefri', label: 'TR FOE/FRI', field: (row: DataRecord) =>  TargetReport.FOEFRItoString((row as DataRecord048).targetReportFoeFri)},
      { name: 'rho', label: 'RHO (nm)', field: 'rho' },
      { name: 'theta', label: 'THETA (º)', field: 'theta' },
      { name: 'mode3av', label: 'Mode3A V', field: (row: DataRecord) => ValidatedtoString((row as DataRecord048).mode3AValidated) },
      { name: 'mode3ag', label: 'Mode3A G', field: (row: DataRecord) => GarbledtoString((row as DataRecord048).mode3AGarbled) },
      { name: 'mode3ac', label: 'Mode3A Code', field: (row: DataRecord) => (row as DataRecord048).mode3ACode?.toString(8).padStart(4, '0') ?? '' },
      { name: 'flv', label: 'Flight Level V', field: (row: DataRecord) => ValidatedtoString((row as DataRecord048).flightLevelValidated) },
      { name: 'flg', label: 'Flight Level G', field: (row: DataRecord) => GarbledtoString((row as DataRecord048).flightLevelGarbled) },
      { name: 'fl', label: 'Flight Level', field: 'flightLevel' },
      { name: 'Correctedfl', label: 'Corrected Flight Level', field: 'correctedFlightLevel' },
      { name: 'aircraftaddress', label:'Aircraft Address', field:'aircraftaddress'},
      { name: 'bds', label: 'BDS', field: 'bds'},
      { name: 'MCPFCUSelected Altitude', label: 'MCP/FCU Selected Altitude', field: 'bds40MCPFCUSelectedAltitude'},
      { name: 'FMS Selected Altitude', label: 'FMS Selected Altitude', field: 'bds40FMSSelectedAltitude'},
      { name: 'BarometricPressureSetting', label: 'Barometric Pressure Setting', field: 'bds40BarometricPressureSetting'},
      { name: 'MCPFCU Mode', label: 'MCP/FCU Mode', field: (row: DataRecord) =>  BDS.MCPFCUModetoString((row as DataRecord048).bds40MCPFCUMode)},
      { name: 'TargetAltSource', label: 'TargetAltSource', field: (row: DataRecord) =>  BDS.TargetAltSourcetoString((row as DataRecord048).bds40TargetAltSource)},
      { name: 'Roll Angle', label: 'Roll Angle', field: 'bds50Roll'},
      { name: 'True Track Angle', label: 'True Track Angle', field: 'bds50TrueTrack'},
      { name: 'Ground Speed', label: 'Ground Speed', field: 'bds50GS'},
      { name: 'Track Angle Rate', label: 'Track Angle Rate', field: 'bds50TrackRate'},
      { name: 'True Air Speed', label: 'True Air Speed', field: 'bds50TAS'},
      { name: 'Magnetic Heading', label: 'Magnetic Heading', field: 'bds60MagneticHeading'},
      { name: 'IAS', label: 'IAS', field: 'bds60IAS'},
      { name: 'MACH', label: 'MACH', field: 'bds60MACH'},
      { name: 'Barometric Altitude Rate', label: 'Barometric Altitude Rate', field: 'bds60BarometricAltitudeRate'},
      { name: 'InertialVerticalVelocity', label: 'InertialVerticalVelocity', field: 'bds60InertialVerticalVelocity'},
      { name: 'tracknumber', label:'Track Number', field:'tracknumber'},
      { name: 'cnf', label: 'Confirmed vs Tentative track', field: (row: DataRecord) =>  TargetReport.ConfirmedTentavitoString((row as DataRecord048).targetcnf)},
      { name: 'rad', label: 'Type of sensors maintaining track', field: (row: DataRecord) =>  TargetReport.TypsensortoString((row as DataRecord048).targetrad)},
      { name: 'dou', label: 'Signal level of confidence n plot to track', field: (row: DataRecord) =>  TargetReport.SignalsLevelsConfidencetoString((row as DataRecord048).targetdou)},
      { name: 'mah', label: 'Manoeuvre detection in Horizontal Sense', field: (row: DataRecord) =>  TargetReport.ManoeuvreDetectiontoString((row as DataRecord048).targetmah)},
      { name: 'cdm', label: 'Climbing descending Mode', field: (row: DataRecord) =>  TargetReport.ClimbingDescendingtoString((row as DataRecord048).targetcdm)},
      { name: 'tre', label: 'Signal for end of track', field: (row: DataRecord) =>  TargetReport.TREtoString((row as DataRecord048).tre)},
      { name: 'gho', label: 'Ghost vs true target', field: (row: DataRecord) =>  TargetReport.GHOtoString((row as DataRecord048).gho)},
      { name: 'sup', label: 'SUP', field: (row: DataRecord) =>  TargetReport.SUPtoString((row as DataRecord048).sup)},
      { name: 'tcc', label: 'Type of plot coordinate transformation mechanism', field: (row: DataRecord) =>  TargetReport.TCCtoString((row as DataRecord048).tcc)},
      { name: 'Xcomponent', label: 'X-Component', field: 'Xcomponent'},
      { name: 'Ycomponent', label: 'Y-Component', field: 'Ycomponent'},
      { name: 'aircraftid', label: 'Aircraft ID', field: 'aircraftid' },
      { name: 'h3D', label: '3D height', field: 'h3D' },
      { name: 'COM', label: 'Transponder communications capability', field:  (row: DataRecord) =>  CCF.COMtoString((row as DataRecord048).ccfCOM) },
      { name: 'STAT', label: 'Flight status', field:  (row: DataRecord) =>  CCF.STATtoString((row as DataRecord048).ccfSTAT) },
      { name: 'SI', label: 'SI-II Transponder Capability', field:  (row: DataRecord) =>  CCF.SItoString((row as DataRecord048).ccfSI) },
      { name: 'MSSC', label: 'Mode-S Specific Service Capability', field:  (row: DataRecord) =>  CCF.MSSCtoString((row as DataRecord048).ccfMSSC) },
      { name: 'ARC', label: 'Altitude Reporting Capability', field:  (row: DataRecord) =>  CCF.ARCtoString((row as DataRecord048).ccfARC) },
      { name: 'AIC', label: 'Aircraft identification Capability', field:  (row: DataRecord) =>  CCF.AICtoString((row as DataRecord048).ccfAIC) },
    ]
  }

  time() {
    if (!this.secondsSinceMidnight) {
      return ''
    }

    const date = new Date()

    date.setHours(0, 0, 0, 0) // Set to midnight
    date.setSeconds(this.secondsSinceMidnight)
    date.setMilliseconds((this.secondsSinceMidnight - Math.trunc(this.secondsSinceMidnight))*1000) // Set the milliseconds

    // Format the time as HH:MM:SS:MMM
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const ms = date.getMilliseconds().toString().padStart(3, '0') // Format the milliseconds
 
    return `${hours}:${minutes}:${seconds}:${ms}`
  }
  
}