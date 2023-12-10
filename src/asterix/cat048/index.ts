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
      { name: "SIC", label: "SAC", field: "SAC" },
      { name: "SIC", label: "SIC", field: "SIC" },
      {
        name: "Timestamp",
        label: "Timestamp",
        field: "Timestamp",
        sortable: true,
      },
      { name: "Lat", label: "Latitude", field: "Lat" },
      { name: "Lon", label: "Longitude", field: "Lon" },
      { name: "Alt", label: "Altitude", field: "Alt" },
      {
        name: "TargetReportType",
        label: "TargetReportType",
        field: "TargetReportType",
      },
      {
        name: "TargetReportSimulated",
        label: "TargetReportSimulated",
        field: "TargetReportSimulated",
      },
      {
        name: "TargetReportRDPChain",
        label: "TargetReportRDPChain",
        field: "TargetReportRDPChain",
      },
      {
        name: "TargetReportSPI",
        label: "TargetReportSPI",
        field: "TargetReportSPI",
      },
      {
        name: "TargetReportRAB",
        label: "TargetReportRAB",
        field: "TargetReportRAB",
      },
      {
        name: "TargetReportTest",
        label: "TargetReportTest",
        field: "TargetReportTest",
      },
      {
        name: "TargetReportXRange",
        label: "TargetReportXRange",
        field: "TargetReportXRange",
      },
      {
        name: "TargetReportXPulse",
        label: "TargetReportXPulse",
        field: "TargetReportXPulse",
      },
      {
        name: "TargetReportMilitaryEmergency",
        label: "TargetReportMilitaryEmergency",
        field: "TargetReportMilitaryEmergency",
      },
      {
        name: "TargetReportMilitaryID",
        label: "TargetReportMilitaryID",
        field: "TargetReportMilitaryID",
      },
      {
        name: "TargetReportFoeFri",
        label: "TargetReportFoeFri",
        field: "TargetReportFoeFri",
      },
      { name: "Rho", label: "Rho", field: "Rho" },
      { name: "Theta", label: "Theta", field: "Theta" },
      {
        name: "Mode3AValidated",
        label: "Mode3AValidated",
        field: "Mode3AValidated",
      },
      { name: "Mode3AGarbled", label: "Mode3AGarbled", field: "Mode3AGarbled" },
      { name: "Mode3ACode", label: "Mode3ACode", field: "Mode3ACode" },
      {
        name: "FlightLevelValidated",
        label: "FlightLevelValidated",
        field: "FlightLevelValidated",
      },
      {
        name: "FlightLevelGarbled",
        label: "FlightLevelGarbled",
        field: "FlightLevelGarbled",
      },
      { name: "FlightLevel", label: "FlightLevel", field: "FlightLevel" },
      {
        name: "FlightLevelCorrected",
        label: "FlightLevelCorrected",
        field: "FlightLevelCorrected",
      },
      { name: "RadarPlotSRL", label: "RadarPlotSRL", field: "RadarPlotSRL" },
      { name: "RadarPlotSRR", label: "RadarPlotSRR", field: "RadarPlotSRR" },
      { name: "RadarPlotSAM", label: "RadarPlotSAM", field: "RadarPlotSAM" },
      { name: "RadarPlotPRL", label: "RadarPlotPRL", field: "RadarPlotPRL" },
      { name: "RadarPlotPAM", label: "RadarPlotPAM", field: "RadarPlotPAM" },
      { name: "RadarPlotRPD", label: "RadarPlotRPD", field: "RadarPlotRPD" },
      { name: "RadarPlotAPD", label: "RadarPlotAPD", field: "RadarPlotAPD" },
      {
        name: "AircraftAddress",
        label: "AircraftAddress",
        field: "AircraftAddress",
      },
      { name: "AircraftID", label: "AircraftID", field: "AircraftID" },
      { name: "BDS", label: "BDS", field: "BDS" },
      {
        name: "MCPFCUSelectedAltitude",
        label: "MCPFCUSelectedAltitude",
        field: "MCPFCUSelectedAltitude",
      },
      {
        name: "FMSSelectedAltitude",
        label: "FMSSelectedAltitude",
        field: "FMSSelectedAltitude",
      },
      {
        name: "BarometricPressureSetting",
        label: "BarometricPressureSetting",
        field: "BarometricPressureSetting",
      },
      { name: "MCPFCUMode", label: "MCPFCUMode", field: "MCPFCUMode" },
      {
        name: "TargetAltitudeSource",
        label: "TargetAltitudeSource",
        field: "TargetAltitudeSource",
      },
      { name: "Roll", label: "Roll", field: "Roll" },
      { name: "TrueTrack", label: "TrueTrack", field: "TrueTrack" },
      { name: "GroundSpeed", label: "GroundSpeed", field: "GroundSpeed" },
      { name: "TrackRate", label: "TrackRate", field: "TrackRate" },
      { name: "TAS", label: "TAS", field: "TAS" },
      {
        name: "MagneticHeading",
        label: "MagneticHeading",
        field: "MagneticHeading",
      },
      { name: "IAS", label: "IAS", field: "IAS" },
      { name: "MACH", label: "MACH", field: "MACH" },
      {
        name: "BarometricAltitudeRate",
        label: "BarometricAltitudeRate",
        field: "BarometricAltitudeRate",
      },
      {
        name: "InertialVerticalVelocity",
        label: "InertialVerticalVelocity",
        field: "InertialVerticalVelocity",
      },
      { name: "TrackNumber", label: "TrackNumber", field: "TrackNumber" },
      { name: "CartesianX", label: "CartesianX", field: "CartesianX" },
      { name: "CartesianY", label: "CartesianY", field: "CartesianY" },
      {
        name: "CalculatedGroundSpeed",
        label: "CalculatedGroundSpeed",
        field: "CalculatedGroundSpeed",
      },
      {
        name: "CalculatedHeading",
        label: "CalculatedHeading",
        field: "CalculatedHeading",
      },
      {
        name: "TargetStatusCNF",
        label: "TargetStatusCNF",
        field: "TargetStatusCNF",
      },
      {
        name: "TargetStatusRAD",
        label: "TargetStatusRAD",
        field: "TargetStatusRAD",
      },
      {
        name: "TargetStatusDOU",
        label: "TargetStatusDOU",
        field: "TargetStatusDOU",
      },
      {
        name: "TargetStatusMAH",
        label: "TargetStatusMAH",
        field: "TargetStatusMAH",
      },
      {
        name: "TargetStatusCDM",
        label: "TargetStatusCDM",
        field: "TargetStatusCDM",
      },
      {
        name: "TargetStatusTRE",
        label: "TargetStatusTRE",
        field: "TargetStatusTRE",
      },
      {
        name: "TargetStatusGHO",
        label: "TargetStatusGHO",
        field: "TargetStatusGHO",
      },
      {
        name: "TargetStatusSUP",
        label: "TargetStatusSUP",
        field: "TargetStatusSUP",
      },
      {
        name: "TargetStatusTCC",
        label: "TargetStatusTCC",
        field: "TargetStatusTCC",
      },
      { name: "Height3D", label: "Height3D", field: "Height3D" },
      { name: "CapabilityCOM", label: "CapabilityCOM", field: "CapabilityCOM" },
      { name: "FlightStatus", label: "FlightStatus", field: "FlightStatus" },
      { name: "CapabilitySI", label: "CapabilitySI", field: "CapabilitySI" },
      {
        name: "CapabilityMSSC",
        label: "CapabilityMSSC",
        field: "CapabilityMSSC",
      },
      { name: "CapabilityARC", label: "CapabilityARC", field: "CapabilityARC" },
      { name: "CapabilityAIC", label: "CapabilityAIC", field: "CapabilityAIC" },
      { name: "BDS1A", label: "BDS1A", field: "BDS1A" },
      { name: "BDS1B", label: "BDS1B", field: "BDS1B" },
    ]
  },
}

export default Category048
