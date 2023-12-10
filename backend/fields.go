package main

import "fmt"

func (r DataRecord048) TargetReportTypeStr() string {
	switch r.TargetReportType {
	case 0:
		return "No detection"
	case 1:
		return "Single PSR detection"
	case 2:
		return "Single SSR detection"
	case 3:
		return "SSR + PSR detection"
	case 4:
		return "Single ModeS All-Call"
	case 5:
		return "Single ModeS Roll-Call"
	case 6:
		return "ModeS All-Call + PSR"
	case 7:
		return "ModeS Roll-Call + PSR"
	}
	return ""
} 

func (r DataRecord048) TargetReportSimulatedStr() string {
	if r.TargetReportSimulated {
		return "Simulated"
	} else {
		return "Actual"
	}
}

func (r DataRecord048) TargetReportRDPChainStr() string {
	return fmt.Sprintf("Chain %d", r.TargetReportRDPChain)
}

func (r DataRecord048) TargetReportSPIStr() string {
	if r.TargetReportSPI {
		return "SPI"
	} else {
		return "Absence of SPI"
	}
}

func (r DataRecord048) TargetReportRABStr() string {
	if r.TargetReportRAB {
		return "Field monitor"
	} else {
		return "Aircraft transponder"
	}
}

func (r DataRecord048) TargetReportTestStr() string {
	if r.TargetReportTest {
		return "Test"
	} else {
		return "Real"
	}
}

func (r DataRecord048) TargetReportXRangeStr() string {
	if r.TargetReportXRange {
		return "Yes"
	} else {
		return "No"
	}
}

func (r DataRecord048) TargetReportXPulseStr() string {
	if r.TargetReportXPulse {
		return "Yes"
	} else {
		return "No"
	}
}

func (r DataRecord048) TargetReportMilitaryEmergencyStr() string {
	if r.TargetReportMilitaryEmergency {
		return "Yes"
	} else {
		return "No"
	}
}

func (r DataRecord048) TargetReportMilitaryIDStr() string {
	if r.TargetReportMilitaryID {
		return "Yes"
	} else {
		return "No"
	}
}

func (r DataRecord048) TargetReportFoeFriStr() string {
	switch r.TargetReportFoeFri {
	case 0:
		return "No Mode 4 interrogation"
	case 1:
		return "Friendly target"
	case 2:
		return "Unknown target"
	case 3:
		return "No reply"
	}
	return ""
} 

func YesNoStr(v bool) string {
	if v {
		return "Yes"
	} else {
		return "No"
	}
}

func (r DataRecord048) MCPFCUModeStr() string {
	switch r.MCPFCUMode {
    case 0:
      return "None"
	case 1:
      return "Approach"
    case 2:
      return "AltHold"
	case 3:
      return "AltHold|Approach"
    case 4:
      return "VNAV"
	case 5:
      return "VNAV|Approach"
    case 6:
      return "VNAV|AltHold"
	case 7:
      return "VNAV|AltHold|Approach"
	}
	return ""
} 

func (r DataRecord048) TargetAltitudeSourceStr() string {
	switch r.TargetAltitudeSource {
	case 0:
		return "Unknown"
	case 1:
		return "Aircraft altitude"
	case 2:
		return "FCU/MCP selected altitude"
	case 3:
		return "FMS selected altitude"
	}
	return ""
}

func (r DataRecord048) TargetStatusCNFStr() string {
	if r.TargetStatusCNF {
		return "Tentative"
	} else {
		return "Confirmed"
	}
}

func (r DataRecord048) TargetStatusRADStr() string {
	switch r.TargetStatusRAD {
	case 0:
		return "Combined"
	case 1:
		return "PSR"
	case 2:
		return "SSR/Mode S"
	case 3:
		return "Invalid"
	}
	return ""
}

func (r DataRecord048) TargetStatusDOUStr() string {
	if r.TargetStatusDOU {
		return "Low conf."
	} else {
		return "Normal conf."
	}
}

func (r DataRecord048) TargetStatusCDMStr() string {
	switch r.TargetStatusCDM {
	case 0:
      return "Maintaining"
    case 1:
      return "Climbing"
	case 2:
      return "Descending"
    case 3:
      return "Unknown"
	}
	return ""
}

func (r DataRecord048) TargetStatusTREStr() string {
	if r.TargetStatusTRE {
		return "End of track"
	} else {
		return "Track still alive"
	}
}

func (r DataRecord048) TargetStatusGHOStr() string {
	if r.TargetStatusGHO {
		return "Ghost"
	} else {
		return "True"
	}
}

func (r DataRecord048) TargetStatustTCCStr() string {
	if r.TargetStatusTCC {
		return "Reference"
	} else {
		return "Radar"
	}
}

func (r DataRecord048) CapabilityCOMStr() string {
	switch r.CapabilityCOM {
	case 0:
      return "No comms"
    case 1:
      return "Comm. A+B"
	case 2:
      return "Comm. A+B|UL ELM"
    case 3:
      return "Comm. A+B|UL+DL ELM"
	case 4:
      return "Level 5"
    default:
		return "Not assigned"
	}
}

func (r DataRecord048) FlightStatusStr() string {
	switch r.FlightStatus {
	case 0:
		return "!Alert|!SPI|Airborne"
	case 1:
		return "!Alert|!SPI|Ground"
	case 2:
		return "Alert|!SPI|Airborne"
	case 3:
		return "Alert|!SPI|Ground"
	case 4:
		return "Alert|SPI|Airborne or Ground"
	case 5:
		return "!Alert|SPI|Airborne or Ground"
	case 6:
		return "Not assigned"
	case 7:
		return "Unknown"
	}
	return ""
}

func (r DataRecord048) CapabilitySIStr() string {
	if r.CapabilitySI {
		return "SI"
	} else {
		return "II"
	}
}

func (r DataRecord048) CapabilityARCStr() string {
	if r.CapabilityARC {
		return "25 ft"
	} else {
		return "100 ft"
	}
}
