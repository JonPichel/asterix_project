package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func csvHandler(c *gin.Context) {
	filename := c.Param("filename")

	if !strings.HasSuffix(filename, ".ast") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file extension. Only .ast files are allowed."})
		return
	}

	if isFileSaved(filename) == -1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File not loaded"})
		return
	}

	csvPath := filepath.Join(CSV_DIR, strings.TrimSuffix(filename, ".ast")) + ".csv"
	file, err := os.Create(csvPath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	if err := writeCSV(file, recordsLoaded); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error writing csv file"})
		return
	}
}

func writeCSV(w io.Writer, records []DataRecord048) error {
	csvWriter := csv.NewWriter(w)
	csvWriter.Comma = ';'

	header := []string{
		"SAC",
		"SIC",
		"Timestamp",
		"Lat",
		"Lon",
		"Alt",
		"TargetReportType",
		"TargetReportSimulated",
		"TargetReportRDPChain",
		"TargetReportSPI",
		"TargetReportRAB",
		"TargetReportTest",
		"TargetReportXRange",
		"TargetReportXPulse",
		"TargetReportMilitaryEmergency",
		"TargetReportMilitaryID",
		"TargetReportFoeFri",
		"Rho",
		"Theta",
		"Mode3AValidated",
		"Mode3AGarbled",
		"Mode3ACode",
		"FlightLevelValidated",
		"FlightLevelGarbled",
		"FlightLevel",
		"FlightLevelCorrected",
		"RadarPlotSRL",
		"RadarPlotSRR",
		"RadarPlotSAM",
		"RadarPlotPRL",
		"RadarPlotPAM",
		"RadarPlotRPD",
		"RadarPlotAPD",
		"AircraftAddress",
		"AircraftID",
		"BDS",
		"MCPFCUSelectedAltitude",
		"FMSSelectedAltitude",
		"BarometricPressureSetting",
		"MCPFCUMode",
		"TargetAltitudeSource",
		"Roll",
		"TrueTrack",
		"GroundSpeed",
		"TrackRate",
		"TAS",
		"MagneticHeading",
		"IAS",
		"MACH",
		"BarometricAltitudeRate",
		"InertialVerticalVelocity",
		"TrackNumber",
		"CartesianX",
		"CartesianY",
		"CalculatedGroundSpeed",
		"CalculatedHeading",
		"TargetStatusCNF",
		"TargetStatusRAD",
		"TargetStatusDOU",
		"TargetStatusMAH",
		"TargetStatusCDM",
		"TargetStatusTRE",
		"TargetStatusGHO",
		"TargetStatusSUP",
		"TargetStatusTCC",
		"Height3D",
		"CapabilityCOM",
		"FlightStatus",
		"CapabilitySI",
		"CapabilityMSSC",
		"CapabilityARC",
		"CapabilityAIC",
		"BDS1A",
		"BDS1B",
	}

	if err := csvWriter.Write(header); err != nil {
		return err
	}

	for _, r := range records {
		row := make([]string, len(header))

		for i := 0; i < len(header); i++ {
			row[i] = "N/A"
		}
		
		if r.Has010 {
			row[0] = strconv.FormatUint(uint64(r.SystemAreaCode), 10)
			row[1] = strconv.FormatUint(uint64(r.SystemIDCode), 10)
		}

		if r.Has140 {
			duration := time.Duration(r.SecondsSinceMidnight*1000 * float32(time.Millisecond))
			midnight := time.Date(0, 1, 1, 0, 0, 0, 0, time.UTC)
			resultTime := midnight.Add(duration)
			timestamp := resultTime.Format("15:04:05.000")
			row[2] = timestamp
		}

		if r.HasCoords {
			row[3] = strconv.FormatFloat(r.Coords.Lat, 'f', 6, 64)
			row[4] = strconv.FormatFloat(r.Coords.Lon, 'f', 6, 64)
			row[5] = strconv.FormatFloat(r.Coords.Alt, 'f', 1, 64)
		}

		if r.Has020 {
			row[6] = r.TargetReportTypeStr()
			row[7] = r.TargetReportSimulatedStr()
			row[8] = r.TargetReportRDPChainStr()
			row[9] = r.TargetReportSPIStr()
			row[10] = r.TargetReportRABStr()
		}

		if r.Has0202 {
			row[11] = r.TargetReportTestStr()
			row[12] = r.TargetReportXRangeStr()
			row[13] = r.TargetReportXPulseStr()
			row[14] = r.TargetReportMilitaryEmergencyStr()
			row[15] = r.TargetReportMilitaryIDStr()
			row[16] = r.TargetReportFoeFriStr()
		}

		if r.Has040 {
			row[17] = strconv.FormatFloat(float64(r.Rho), 'f', 4, 32)
			row[18] = strconv.FormatFloat(float64(r.Theta), 'f', 4, 32)
		}

		if r.Has070 {
			row[19] = YesNoStr(r.Mode3AValidated)
			if r.Mode3AGarbled {
				row[20] = "Garbled"
			} else {
				row[20] = "Default"
			}
			row[21] = strconv.FormatUint(uint64(r.Mode3ACode), 8)
		}

		if r.Has090 {
			row[22] = YesNoStr(r.FlightLevelValidated)
			if r.FlightLevelGarbled {
				row[23] = "Garbled"
			} else {
				row[23] = "Default"
			}
			row[24] = strconv.FormatFloat(float64(r.FlightLevel), 'f', 2, 32)

			if r.IsFLCorrected {
				row[25] = strconv.FormatFloat(float64(r.FlightLevelCorrected), 'f', 4, 32)
			}
		}

		if r.Has130 {
			if r.RadarPlotFields & (1 << 0) != 0 {
				row[26] = strconv.FormatFloat(float64(r.RadarPlotSRL), 'f', 3, 32)
			}
			if r.RadarPlotFields & (1 << 1) != 0 {
				row[27] = strconv.FormatFloat(float64(r.RadarPlotSRR), 'f', 3, 32)
			}
			if r.RadarPlotFields & (1 << 2) != 0 {
				row[28] = fmt.Sprintf("%.2f dBm", r.RadarPlotSAM)
			}
			if r.RadarPlotFields & (1 << 3) != 0 {
				row[29] = strconv.FormatFloat(float64(r.RadarPlotPRL), 'f', 3, 32)
			}
			if r.RadarPlotFields & (1 << 4) != 0 {
				row[30] = fmt.Sprintf("%.2f dBm", r.RadarPlotPAM)
			}
			if r.RadarPlotFields & (1 << 5) != 0 {
				row[31] = fmt.Sprintf("%.3f dBm", r.RadarPlotRPD)
			}
			if r.RadarPlotFields & (1 << 6) != 0 {
				row[32] = fmt.Sprintf("%.3f dBm", r.RadarPlotAPD)
			}
		}

		if r.Has220 {
			row[33] = r.AircraftAddress
		}

		if r.Has240 {
			row[34] = r.AircraftID
		}

		if r.Has250 {
			row[35] = strings.Join(r.BDS, "|")
			// BDS4.0
			if r.BDSFields & (1 << 0) != 0 {
				row[36] = strconv.FormatFloat(float64(r.MCPFCUSelectedAltitude), 'f', 2, 32)
			}
			if r.BDSFields & (1 << 1) != 0 {
				row[37] = strconv.FormatFloat(float64(r.FMSSelectedAltitude), 'f', 2, 32)
			}
			if r.BDSFields & (1 << 2) != 0 {
				row[38] = strconv.FormatFloat(float64(r.BarometricPressureSetting), 'f', 2, 32)
			}
			if r.BDSFields & (1 << 3) != 0 {
				row[39] = r.MCPFCUModeStr()
			}
			if r.BDSFields & (1 << 4) != 0 {
				row[40] = r.TargetAltitudeSourceStr()
			}
			// BDS5.0
			if r.BDSFields & (1 << 5) != 0 {
				row[41] = strconv.FormatFloat(float64(r.Roll), 'f', 3, 32)
			}
			if r.BDSFields & (1 << 6) != 0 {
				row[42] = strconv.FormatFloat(float64(r.TrueTrack), 'f', 3, 32)
			}
			if r.BDSFields & (1 << 7) != 0 {
				row[43] = strconv.FormatFloat(float64(r.GroundSpeed), 'f', 2, 32)
			}
			if r.BDSFields & (1 << 8) != 0 {
				row[44] = strconv.FormatFloat(float64(r.TrackRate), 'f', 2, 32)
			}
			if r.BDSFields & (1 << 9) != 0 {
				row[45] = strconv.FormatFloat(float64(r.TAS), 'f', 2, 32)
			}
			// BDS6.0
			if r.BDSFields & (1 << 10) != 0 {
				row[46] = strconv.FormatFloat(float64(r.MagneticHeading), 'f', 3, 32)
			}
			if r.BDSFields & (1 << 11) != 0 {
				row[47] = strconv.FormatFloat(float64(r.IAS), 'f', 2, 32)
			}
			if r.BDSFields & (1 << 12) != 0 {
				row[48] = strconv.FormatFloat(float64(r.MACH), 'f', 3, 32)
			}
			if r.BDSFields & (1 << 13) != 0 {
				row[49] = strconv.FormatFloat(float64(r.BarometricAltitudeRate), 'f', 2, 32)
			}
			if r.BDSFields & (1 << 14) != 0 {
				row[50] = strconv.FormatFloat(float64(r.InertialVerticalVelocity), 'f', 2, 32)
			}
		}

		if r.Has161 {
			row[51] = fmt.Sprintf("%04d", r.TrackNumber)
		}

		if r.Has042 {
			row[52] = strconv.FormatFloat(float64(r.CartesianX), 'f', 2, 32)
			row[53] = strconv.FormatFloat(float64(r.CartesianY), 'f', 2, 32)
		}

		if r.Has200 {
			row[54] = strconv.FormatFloat(float64(r.CalculatedGroundSpeed), 'f', 2, 32)
			row[55] = strconv.FormatFloat(float64(r.CalculatedHeading), 'f', 4, 32)
		}

		if r.Has170 {
			row[56] = r.TargetStatusCNFStr()
			row[57] = r.TargetStatusRADStr()
			row[58] = r.TargetStatusDOUStr()
			row[59] = YesNoStr(r.TargetStatusMAH)
			row[60] = r.TargetStatusCDMStr()
		}

		if r.Has170170{
			row[61] = r.TargetStatusTREStr()
			row[62] = r.TargetStatusGHOStr()
			row[63] = YesNoStr(r.TargetStatusSUP)
			row[64] = r.TargetStatustTCCStr()
		}

		if r.Has110 {
			row[65] = strconv.FormatFloat(float64(r.Height3D), 'f', 2, 32)
		}

		if r.Has230 {
			row[66] = r.CapabilityCOMStr()
			row[67] = r.FlightStatusStr()
			row[68] = r.CapabilitySIStr()
			row[69] = YesNoStr(r.CapabilityMSSC)
			row[70] = r.CapabilityARCStr()
			row[71] = YesNoStr(r.CapabilityAIC)
			row[72] = strconv.FormatUint(uint64(r.BDS1A), 10)
			row[73] = fmt.Sprintf("%04b", r.BDS1B)
		}

		if err := csvWriter.Write(row); err != nil {
			return err
		}
	}
	
	return nil
}