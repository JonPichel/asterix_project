import { y } from 'app/dist/electron/UnPackaged/assets/index.053df2f5';
import { DataRecord, TableColumn } from '../model';
import { checkFX, octalToDecimal } from '../util';
import { GarbledtoString, ValidatedtoString } from './code';
import * as TargetReport from './target-report'

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
  // I048/080
  mode3AValidated?: boolean;
  mode3AGarbled?: boolean;
  mode3ACode?: number;
  // I048/090
  flightLevelValidated?: boolean;
  flightLevelGarbled?: boolean;
  flightLevel?: number;

  columns(): TableColumn[] {
    return [
      { name: "sac", label: "SAC", field: "sac" },
      { name: "sic", label: "SIC", field: "sic" },
      { name: "time", label: "Time", field: (row: DataRecord) =>  (row as DataRecord048).time()},
      { name: "trtyp", label: "TR Type", field: (row: DataRecord) =>  TargetReport.TYPtoString((row as DataRecord048).targetReportType)},
      { name: "trsim", label: "TR Simulated", field: (row: DataRecord) =>  TargetReport.SIMtoString((row as DataRecord048).targetReportSimulated)},
      { name: "trrdp", label: "TR RDP", field: (row: DataRecord) =>  TargetReport.RDPtoString((row as DataRecord048).targetReportRDPChain)},
      { name: "trspi", label: "TR SPI", field: (row: DataRecord) =>  TargetReport.SPItoString((row as DataRecord048).targetReportSPI)},
      { name: "trrab", label: "TR RAB", field: (row: DataRecord) =>  TargetReport.RABtoString((row as DataRecord048).targetReportRAB)},
      { name: "trerr", label: "TR Extended Range", field: (row: DataRecord) =>  TargetReport.ERRtoString((row as DataRecord048).targetReportExtendedRange)},
      { name: "trxpp", label: "TR X-Pulse", field: (row: DataRecord) =>  TargetReport.XPPtoString((row as DataRecord048).targetReportXPulse)},
      { name: "trme", label: "TR Mil. Emergency", field: (row: DataRecord) =>  TargetReport.MEtoString((row as DataRecord048).targetReportMilitaryEmergency)},
      { name: "trmi", label: "TR Mil. ID", field: (row: DataRecord) =>  TargetReport.MItoString((row as DataRecord048).targetReportMilitaryIdentification)},
      { name: "trfoefri", label: "TR FOE/FRI", field: (row: DataRecord) =>  TargetReport.FOEFRItoString((row as DataRecord048).targetReportFoeFri)},
      { name: "rho", label: "RHO (nm)", field: "rho" },
      { name: "theta", label: "THETA (º)", field: "theta" },
      { name: "mode3av", label: "Mode3A V", field: (row: DataRecord) => ValidatedtoString((row as DataRecord048).mode3AValidated) },
      { name: "mode3ag", label: "Mode3A G", field: (row: DataRecord) => GarbledtoString((row as DataRecord048).mode3AGarbled) },
      { name: "mode3ac", label: "Mode3A Code", field: (row: DataRecord) => (row as DataRecord048).mode3ACode?.toString(8) ?? '' },
      { name: "flv", label: "Flight Level V", field: (row: DataRecord) => ValidatedtoString((row as DataRecord048).flightLevelValidated) },
      { name: "flg", label: "Flight Level G", field: (row: DataRecord) => GarbledtoString((row as DataRecord048).flightLevelGarbled) },
      { name: "fl", label: "Flight Level", field: "flightLevel" },
    ]
  }

  time() {
    if (!this.secondsSinceMidnight) {
      return ''
    }

    const date = new Date()

    date.setHours(0, 0, 0, 0) // Set to midnight
    date.setSeconds(this.secondsSinceMidnight)

    // Format the time as HH:MM:SS
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }
}