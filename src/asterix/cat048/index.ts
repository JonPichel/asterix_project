import DataRecord048 from "./record"
import { AsterixCategory, TableColumn } from ".."
import { fromBinary } from "./binary"
import * as TargetReport from "../utils/target-report"
import * as CCF from "../utils/ccf"
import * as Code from "../utils/code"
import { secondsSinceMidnightToString } from "../utils/time"
import * as BDS from "../utils/bds"

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
        sortable: true,
        sort: (a: string, b: string, rowA: any, rowB: any) => {
          return rowA.secondsSinceMidnight - rowB.secondsSinceMidnight
        },
      },
      { name: "latitude", label: "Latitude", field: (row: DataRecord048) => row.gpsCoords?.lat.toFixed(6).toString() || "N/A"},
      {
        name: "longitude",
        label: "Longitude",
        field: (row: DataRecord048) => row.gpsCoords?.lon.toFixed(6).toString() || "N/A",
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
        sortable: true,
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
        field: (row: DataRecord048) => row.mode3ACode?.toString(8).padStart(4, "0") ?? "N/A",
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
        name: "correctedfl",
        label: "Corrected Flight Level",
        field: "correctedFlightLevel",
      },
      {
        name: "radarPlotSRL",
        label: "Plot SRL",
        field: (row: DataRecord048) => row.radarPlotSRL?.toFixed(3).toString() || "N/A"
      },
      {
        name: "radarPlotSRR",
        label: "Plot SRR",
        field: (row: DataRecord048) => row.radarPlotSRR?.toString() || "N/A"
      },
      {
        name: "radarPlotSAM",
        label: "Plot SAM",
        field: (row: DataRecord048) => row.radarPlotSAM?.toString() + " dBm" || "N/A"
      },
      {
        name: "radarPlotPRL",
        label: "Plot PRL",
        field: (row: DataRecord048) => row.radarPlotPRL?.toFixed(3).toString() || "N/A"
      },
      {
        name: "radarPlotPAM",
        label: "Plot PAM",
        field: (row: DataRecord048) => row.radarPlotPAM?.toString() + " dBm"  || "N/A"
      },
      {
        name: "radarPlotRPD",
        label: "Plot RPD",
        field: (row: DataRecord048) => row.radarPlotRPD?.toFixed(3).toString() + " dBm" || "N/A"
      },
      {
        name: "radarPlotAPD",
        label: "Plot APD",
        field: (row: DataRecord048) => row.radarPlotAPD?.toFixed(3).toString() + " dBm" || "N/A"
      },
      {
        name: "aircraftid",
        label: "Aircraft ID",
        field: "aircraftaddress",
      },
      {
        name: "aircraftid",
        label: "Aircraft ID",
        field: "aircraftID",
        sortable: true,
      },
      {
        name: "bds",
        label: "BDS",
        field: (row: DataRecord048) => row.bds?.join(" ") ?? "",
      },
      {
        name: "MCPFCUSelected Altitude",
        label: "MCP/FCU Selected Altitude",
        field: "bds40MCPFCUSelectedAltitude",
      },
      {
        name: "FMS Selected Altitude",
        label: "FMS Selected Altitude",
        field: "bds40FMSSelectedAltitude",
      },
      {
        name: "BarometricPressureSetting",
        label: "Barometric Pressure Setting",
        field: "bds40BarometricPressureSetting",
      },
      {
        name: "MCPFCU Mode",
        label: "MCP/FCU Mode",
        field: (row: DataRecord048) =>
          BDS.MCPFCUModetoString(row.bds40MCPFCUMode),
      },
      {
        name: "TargetAltSource",
        label: "TargetAltSource",
        field: (row: DataRecord048) =>
          BDS.TargetAltSourcetoString(row.bds40TargetAltSource),
      },
      { name: "Roll Angle", label: "Roll Angle", field: "bds50Roll" },
      {
        name: "True Track Angle",
        label: "True Track Angle",
        field: "bds50TrueTrack",
      },
      { name: "Ground Speed", label: "Ground Speed", field: "bds50GS" },
      {
        name: "Track Angle Rate",
        label: "Track Angle Rate",
        field: "bds50TrackRate",
      },
      { name: "True Air Speed", label: "True Air Speed", field: "bds50TAS" },
      {
        name: "Magnetic Heading",
        label: "Magnetic Heading",
        field: "bds60MagneticHeading",
      },
      { name: "IAS", label: "IAS", field: "bds60IAS" },
      { name: "MACH", label: "MACH", field: "bds60MACH" },
      {
        name: "Barometric Altitude Rate",
        label: "Barometric Altitude Rate",
        field: "bds60BarometricAltitudeRate",
      },
      {
        name: "InertialVerticalVelocity",
        label: "InertialVerticalVelocity",
        field: "bds60InertialVerticalVelocity",
      },
      { name: "tracknumber", label: "Track Number", field: "tracknumber" },
      {
        name: "Xcomponent",
        label: "X Component",
        field: (row: DataRecord048) => row.Xcomponent?.toString() || "N/A"
      },
      {
        name: "Ycomponent",
        label: "Y Component",
        field: (row: DataRecord048) => row.Ycomponent?.toString() || "N/A"
      },
      { name: "calculatedgroundspeed", label: "Ground Speed kt", field: "calculatedgroundspeed" },
      { name: "calculatedheading", label: "Heading", field: "calculatedheading" },
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
        field: (row: DataRecord048) => TargetReport.TREtoString(row.tre).toString()|| "N/A"
      },
      {
        name: "gho",
        label: "Ghost vs true target",
        field: (row: DataRecord048) => TargetReport.GHOtoString(row.gho).toString()|| "N/A"
      },
      {
        name: "sup",
        label: "SUP",
        field: (row: DataRecord048) => TargetReport.SUPtoString(row.sup).toString()|| "N/A"
      },
      {
        name: "tcc",
        label: "Type of plot coordinate transformation mechanism",
        field: (row: DataRecord048) => TargetReport.TCCtoString(row.tcc).toString()|| "N/A"
      },
      { name: "h3D", label: "3D height", field: (row: DataRecord048) => row.h3D?.toString() || "N/A" },
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
      {
        name: "ccfB1A",
        label: "B1A",
        field: "ccfB1A",
      },
      {
        name: "ccfB1B",
        label: "B1B",
        field: "ccfB1B",
      },
    ]
  },
}

export default Category048
