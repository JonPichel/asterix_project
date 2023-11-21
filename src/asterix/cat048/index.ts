import DataRecord048 from "./record"
import { AsterixCategory, TableColumn } from ".."
import { fromBinary } from "./binary"
import * as TargetReport from "../utils/target-report"
import * as CCF from "../utils/ccf"
import * as Code from "../utils/code"
import { secondsSinceMidnightToString } from "../utils/time"

const Category048: AsterixCategory = {
  fromBinary,
  tableColumns(): TableColumn[] {
    return [
      { name: "sac", label: "SAC", field: "sac" },
      { name: "sic", label: "SIC", field: "sic" },
      {
        name: "time",
        label: "Time",
        field: (row: DataRecord048) =>
          secondsSinceMidnightToString(row.secondsSinceMidnight),
      },
      {
        name: "trtyp",
        label: "TR Type",
        field: (row: DataRecord048) =>
          TargetReport.TYPtoString(row.targetReportType),
      },
      {
        name: "trsim",
        label: "TR Simulated",
        field: (row: DataRecord048) =>
          TargetReport.SIMtoString(row.targetReportSimulated),
      },
      {
        name: "trrdp",
        label: "TR RDP",
        field: (row: DataRecord048) =>
          TargetReport.RDPtoString(row.targetReportRDPChain),
      },
      {
        name: "trspi",
        label: "TR SPI",
        field: (row: DataRecord048) =>
          TargetReport.SPItoString(row.targetReportSPI),
      },
      {
        name: "trrab",
        label: "TR RAB",
        field: (row: DataRecord048) =>
          TargetReport.RABtoString(row.targetReportRAB),
      },
      {
        name: "trerr",
        label: "TR Extended Range",
        field: (row: DataRecord048) =>
          TargetReport.ERRtoString(row.targetReportExtendedRange),
      },
      {
        name: "trxpp",
        label: "TR X-Pulse",
        field: (row: DataRecord048) =>
          TargetReport.XPPtoString(row.targetReportXPulse),
      },
      {
        name: "trme",
        label: "TR Mil. Emergency",
        field: (row: DataRecord048) =>
          TargetReport.MEtoString(row.targetReportMilitaryEmergency),
      },
      {
        name: "trmi",
        label: "TR Mil. ID",
        field: (row: DataRecord048) =>
          TargetReport.MItoString(row.targetReportMilitaryIdentification),
      },
      {
        name: "trfoefri",
        label: "TR FOE/FRI",
        field: (row: DataRecord048) =>
          TargetReport.FOEFRItoString(row.targetReportFoeFri),
      },
      { name: "rho", label: "RHO (nm)", field: "rho" },
      { name: "theta", label: "THETA (º)", field: "theta" },
      {
        name: "mode3av",
        label: "Mode3A V",
        field: (row: DataRecord048) =>
          Code.ValidatedtoString(row.mode3AValidated),
      },
      {
        name: "mode3ag",
        label: "Mode3A G",
        field: (row: DataRecord048) => Code.GarbledtoString(row.mode3AGarbled),
      },
      {
        name: "mode3ac",
        label: "Mode3A Code",
        field: (row: DataRecord048) => row.mode3ACode?.toString(8) ?? "",
      },

      {
        name: "flv",
        label: "Flight Level V",
        field: (row: DataRecord048) =>
          Code.ValidatedtoString(row.flightLevelValidated),
      },
      {
        name: "flg",
        label: "Flight Level G",
        field: (row: DataRecord048) =>
          Code.GarbledtoString(row.flightLevelGarbled),
      },
      { name: "fl", label: "Flight Level", field: "flightLevel" },
      {
        name: "aircraftaddress",
        label: "Aircraft Address",
        field: "aircraftaddress",
      },
      { name: "tracknumber", label: "Track Number", field: "tracknumber" },
      {
        name: "cnf",
        label: "Confirmed vs Tentative track",
        field: (row: DataRecord048) =>
          TargetReport.ConfirmedTentavitoString(row.targetcnf),
      },
      {
        name: "rad",
        label: "Type of sensors maintaining track",
        field: (row: DataRecord048) =>
          TargetReport.TypsensortoString(row.targetrad),
      },
      {
        name: "dou",
        label: "Signal level of confidence n plot to track",
        field: (row: DataRecord048) =>
          TargetReport.SignalsLevelsConfidencetoString(row.targetdou),
      },
      {
        name: "mah",
        label: "Manoeuvre detection in Horizontal Sense",
        field: (row: DataRecord048) =>
          TargetReport.ManoeuvreDetectiontoString(row.targetmah),
      },
      {
        name: "cdm",
        label: "Climbing descending Mode",
        field: (row: DataRecord048) =>
          TargetReport.ClimbingDescendingtoString(row.targetcdm),
      },
      {
        name: "tre",
        label: "Signal for end of track",
        field: (row: DataRecord048) => TargetReport.TREtoString(row.tre),
      },
      {
        name: "gho",
        label: "Ghost vs true target",
        field: (row: DataRecord048) => TargetReport.GHOtoString(row.gho),
      },
      {
        name: "sup",
        label: "SUP",
        field: (row: DataRecord048) => TargetReport.SUPtoString(row.sup),
      },
      {
        name: "tcc",
        label: "Type of plot coordinate transformation mechanism",
        field: (row: DataRecord048) => TargetReport.TCCtoString(row.tcc),
      },
      { name: "Xcomponent", label: "X-Component", field: "Xcomponent" },
      { name: "Ycomponent", label: "Y-Component", field: "Ycomponent" },
      { name: "aircraftid", label: "Aircraft ID", field: "aircraftid" },
      { name: "h3D", label: "3D height", field: "h3D" },
      {
        name: "COM",
        label: "Transponder communications capability",
        field: (row: DataRecord048) => CCF.COMtoString(row.ccfCOM),
      },
      {
        name: "STAT",
        label: "Flight status",
        field: (row: DataRecord048) => CCF.STATtoString(row.ccfSTAT),
      },
      {
        name: "SI",
        label: "SI-II Transponder Capability",
        field: (row: DataRecord048) => CCF.SItoString(row.ccfSI),
      },
      {
        name: "MSSC",
        label: "Mode-S Specific Service Capability",
        field: (row: DataRecord048) => CCF.MSSCtoString(row.ccfMSSC),
      },
      {
        name: "ARC",
        label: "Altitude Reporting Capability",
        field: (row: DataRecord048) => CCF.ARCtoString(row.ccfARC),
      },
      {
        name: "AIC",
        label: "Aircraft identification Capability",
        field: (row: DataRecord048) => CCF.AICtoString(row.ccfAIC),
      },
    ]
  },
}

export default Category048
