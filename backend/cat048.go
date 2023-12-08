package main

import (
	"encoding/binary"
	"errors"
	"fmt"
)

type DataRecord048 struct {
	// For visualization
	HasCoords bool
	Coords GPSCoords
	// I048/010
	Has010 bool
	SystemAreaCode uint8
	SystemIDCode uint8
	// I048/140
	Has140 bool
	SecondsSinceMidnight float32 // s
	// I048/020 (Without Second Extension)
	Has020 bool
	TargetReportType uint8
	TargetReportSimulated bool
	TargetReportRDPChain uint8 // 1 or 2
	TargetReportSPI bool
	TargetReportRAB bool
	TargetReportTest bool
	TargetReportXRange bool
	TargetReportXPulse bool
	TargetReportMilitaryEmergency bool
	TargetReportMilitaryID bool
	TargetReportFoeFri uint8
	// I048/040
	Has040 bool
	Rho float32 // º
	Theta float32 // º
	// I048/070
	Has070 bool
	Mode3AValidated bool
	Mode3AGarbled bool
	Mode3ACode uint16
	// I048/090
	Has090 bool
	FlightLevelValidated bool
	FlightLevelGarbled bool
	FlightLevel float32
	IsFLCorrected bool
	FlightLevelCorrected float32
	// I048/130
	Has130 bool
	RadarPlotFields uint8
	RadarPlotSRL float32 // nose
	RadarPlotSRR float32 // nose
	RadarPlotSAM float32 // dBm
	RadarPlotPRL float32 // nose
	RadarPlotPAM float32 // dBm
	RadarPlotRPD float32 // dBm
	RadarPlotAPD float32 // dBm
	//I048/220
	Has220 bool
	AircraftAddress string
	//I048/240
	Has240 bool
	AircraftID string
	// I048/250 5 optional fields, 5 optional fields
	Has250 bool
	BDS []string
	BDSFields uint16
	MCPFCUSelectedAltitude float32 // ft
	FMSSelectedAltitude float32 // ft
	BarometricPressureSetting float32 // mb
	MCPFCUMode uint8 // Enum
	TargetAltitudeSource uint8 // Enum
	Roll float32 // º
	TrueTrack float32 // º
	GroundSpeed float32 // kt
	TrackRate float32 // º/s
	TAS float32 // kt
	MagneticHeading float32 // º
	IAS float32 // kt
	MACH float32
	BarometricAltitudeRate float32 // ft/min
	InertialVerticalVelocity float32 // ft/min
	//I048/161
	Has161 bool
	TrackNumber uint16
	//I048/042
	Has042 bool
	CartesianX float32
	CartesianY float32
	//I048/200
	Has200 bool
	CalculatedGroundSpeed float32
	CalculatedHeading float32
	//I048/170
	Has170 bool
	TargetStatusCNF bool
	TargetStatusRAD uint8
	TargetStatusDOU bool
	TargetStatusMAH bool
	TargetStatusCDM uint8
	TargetStatusTRE bool
	TargetStatusGHO bool
	TargetStatusSUP bool
	TargetStatusTCC bool
	// I048/110
	Has110 bool
	Height3D float32
	// I048/230
	Has230 bool
	CapabilityCOM uint8
	FlightStatus uint8
	CapabilitySI bool // SI or II
	CapabilityMSSC bool
	CapabilityARC bool
	CapabilityAIC bool
	BDS1A uint8
	BDS1B uint8
}

var lastRadar *Radar

func New048(buf []byte) (DataRecord048, error) {
	resultFX := checkFX(buf)
	dataFieldsBuf := buf[resultFX.fieldLen:]

	r := DataRecord048{}

	fieldStart := 0
	for _, FRN := range resultFX.positions {
		var size int
		var err error
		switch(FRN) {
		case 1:
			size, err = r.parse010(dataFieldsBuf[fieldStart:])
		case 2:
			size, err = r.parse140(dataFieldsBuf[fieldStart:])
		case 3:
			size, err = r.parse020(dataFieldsBuf[fieldStart:])
		case 4:
			size, err = r.parse040(dataFieldsBuf[fieldStart:])
		case 5:
			size, err = r.parse070(dataFieldsBuf[fieldStart:])
		case 6:
			size, err = r.parse090(dataFieldsBuf[fieldStart:])
		case 7:
			size, err = r.parse130(dataFieldsBuf[fieldStart:])
		case 8:
			size, err = r.parse220(dataFieldsBuf[fieldStart:])
		case 9:
			size, err = r.parse240(dataFieldsBuf[fieldStart:])
		case 10:
			size, err = r.parse250(dataFieldsBuf[fieldStart:])
		case 11:
			size, err = r.parse161(dataFieldsBuf[fieldStart:])
		case 12:
			size, err = r.parse042(dataFieldsBuf[fieldStart:])
		case 13:
			size, err = r.parse200(dataFieldsBuf[fieldStart:])
		case 14:
			size, err = r.parse170(dataFieldsBuf[fieldStart:])
		case 19:
			size, err = r.parse110(dataFieldsBuf[fieldStart:])
		case 21:
			size, err = r.parse230(dataFieldsBuf[fieldStart:])
		case 27:
		case 28:
			// FIELDS WE WILL IMPLEMENT
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
		default:
			return DataRecord048{}, errors.New("malformed category 48 data record")
		}

		if err != nil {
			return r, err
		}
		fieldStart += size
	}


	// Correct Flight Level
	// Has FlightLevel (Has090)
	// Has BarometricPressureSetting (Has250 & BDSField[2])
	if r.Has090 && r.Has250 && (r.BDSFields & (1 << 2) != 0) {
		if r.FlightLevel * 100 <= 6000 {
			r.FlightLevelCorrected = (r.FlightLevel + (r.BarometricPressureSetting - 1013.25) * 30 / 100)
			r.IsFLCorrected = true
		}
	}

	// Compute GPS coords
	if r.Has010 && r.Has040 && r.Has090 {
		if lastRadar == nil || lastRadar.SAC != r.SystemAreaCode || lastRadar.SIC != r.SystemIDCode {
			radar, err := NewRadar(r.SystemAreaCode, r.SystemIDCode)
			if err != nil {
				return r, nil
			}
			lastRadar = radar
		}

		var fl float64
		if r.IsFLCorrected {
			fl = float64(r.FlightLevelCorrected)
		} else {
			fl = float64(r.FlightLevel)
		}

		gpsCoords := lastRadar.SlantToGPS(SlantCoords{
			Rho: r.Rho * 1852,
			Theta: r.Theta,
			Alt: fl * 100 * 0.3048,
		})

		r.Coords = gpsCoords
		r.HasCoords = true
	}

	return r, nil
}

func (r *DataRecord048) parse010(buf []byte) (int, error) {
	r.SystemAreaCode = buf[0]
	r.SystemIDCode = buf[1]

	r.Has010 = true
	return 2, nil
}

func (r *DataRecord048) parse140(buf []byte) (int, error) {
	r.SecondsSinceMidnight = float32(binary.BigEndian.Uint32([]byte{0x00, buf[0], buf[1], buf[2]})) / 128

	r.Has140 = true
	return 3, nil
}

func (r *DataRecord048) parse020(buf []byte) (int, error) {
 	resultFX := checkFX(buf)

	r.TargetReportType = buf[0] >> 5
	r.TargetReportSimulated = ((buf[0] >> 4) & 0b1) == 1
	r.TargetReportRDPChain = ((buf[0] >> 3) & 0b1) + 1
	r.TargetReportSPI = ((buf[0] >> 2) & 0b1) == 1
	r.TargetReportRAB = ((buf[0] >> 1) & 0b1) == 1

	if resultFX.fieldLen > 1 {
		r.TargetReportTest = ((buf[1] >> 7) & 0b1) == 1
		r.TargetReportXRange = ((buf[1] >> 6) & 0b1) == 1
		r.TargetReportXPulse = ((buf[1] >> 5) & 0b1) == 1
		r.TargetReportMilitaryEmergency = ((buf[1] >> 4) & 0b1) == 1
		r.TargetReportMilitaryID = ((buf[1] >> 3) & 0b1) == 1
		r.TargetReportFoeFri = (buf[1] >> 1) & 0b11
	}

	r.Has020 = true
	return resultFX.fieldLen, nil
}

func (r *DataRecord048) parse040(buf []byte) (int, error) {
	aux := binary.BigEndian.Uint32([]byte{0, 0, buf[0], buf[1]})
	r.Rho = float32(aux) / 256 // nm
	aux = binary.BigEndian.Uint32([]byte{0, 0, buf[2], buf[3]})
	r.Theta = float32(aux) * 360 / 65536 // º

	r.Has040 = true
	return 4, nil
}

func (r *DataRecord048) parse070(buf []byte) (int, error) {
	r.Mode3AValidated = ((buf[0] >> 7) & 0b1) == 0
	r.Mode3AGarbled = ((buf[0] >> 6) & 0b1) == 1

	if (((buf[0] >> 5) & 0b1) == 0) {
		// Code derived from the reply of the transponder
		aux := uint64(binary.BigEndian.Uint16([]byte{buf[0] & 0b1111, buf[1]}))
		r.Mode3ACode = uint16(octalToDecimal(aux, 4))
	}
	// Else code is not present so we don't set it

	r.Has070 = true
	return 2, nil
}

func (r *DataRecord048) parse090(buf []byte) (int, error) {
	r.FlightLevelValidated = ((buf[0] >> 7) & 0b1) == 0
	r.FlightLevelGarbled = ((buf[0] >> 6) & 0b1) == 1
	aux := uint64(binary.BigEndian.Uint16([]byte{buf[0] & 0b111111, buf[1]}))
	r.FlightLevel = float32(twosComplement(aux, 14)) * 0.25 // FL

	r.Has090 = true
	return 2, nil
}

func (r *DataRecord048) parse130(buf []byte) (int, error) {
	resultFX := checkFX(buf)
	if (resultFX.fieldLen != 1) {
		return 0, errors.New("bad length")
	}

	fieldStart := 1
	r.RadarPlotFields = 0
	for _, SFN := range resultFX.positions {
		switch (SFN) {
		case 1:
			r.RadarPlotSRL = (float32(buf[fieldStart]) * 360) / 8192
		case 2:
			r.RadarPlotSRR = float32(buf[fieldStart])
		case 3:
			r.RadarPlotSAM = float32(twosComplement(uint64(buf[fieldStart]), 8))
		case 4:
			r.RadarPlotPRL = float32((float32(buf[fieldStart]) * 360) / 8192)
		case 5:
			r.RadarPlotPAM = float32(twosComplement(uint64(buf[fieldStart]), 8))
		case 6:
			r.RadarPlotRPD = float32(buf[fieldStart]) / 256
		case 7:
			r.RadarPlotAPD = (float32(buf[fieldStart]) * 360) / 16384
		default:
			return 0, errors.New("malformed category 48 data record")
		}
		fieldStart++
		r.RadarPlotFields |= 1 << (SFN - 1)
	}

	r.Has130 = true
	return resultFX.fieldLen + (fieldStart - 1), nil
}

func (r *DataRecord048) parse220(buf []byte) (int, error) {
	r.AircraftAddress = fmt.Sprintf("%06X", binary.BigEndian.Uint32([]byte{0, buf[0], buf[1], buf[2]}))

	r.Has220 = true
	return 3, nil
}

func (r *DataRecord048) parse240(buf []byte) (int, error) {
	r.AircraftID = parseID(buf)

	r.Has240 = true
	return 6, nil
}

func (r *DataRecord048) parse161(buf []byte) (int, error) {
	r.TrackNumber = binary.BigEndian.Uint16([]byte{buf[0], buf[1]})

	r.Has161 = true
	return 2, nil
}

func (r *DataRecord048) parse250(buf []byte) (int, error) {
	n := int(buf[0])
	bds := make([]string, 0)

	r.BDSFields = 0
	for i := 0; i < n; i++ {
		data := buf[1 + 8 * i: 1 + 8 * (i + 1) - 1]
		bds1 := buf[1 + 8 * (i + 1) - 1] >> 4
		bds2 := buf[1 + 8 * (i + 1) - 1] & 0b1111

		bds = append(bds, fmt.Sprintf("%d.%d", bds1, bds2))
		if bds2 == 0 {
			switch (bds1) {
			case 4:
				if (data[0] >> 7) & 0b1 == 1 {
					// XAAAAAAA BBBBBXXX
					// 0AAAA AAA00000
					//       000BBBBB
					// 0AAAA AAABBBBB
					r.MCPFCUSelectedAltitude = float32((int(data[0] & 0b01111111) << 5) | int(data[1] >> 3)) * 16 // ft
					r.BDSFields |= 1 << 0
				}
				if (data[1] >> 2) & 0b1 == 1 {
					// XXXXXXAA BBBBBBBB CCXXXXXX
					// 00 0000AA00 00000000
					//          BB BBBBBB00
					//             000000CC
					// 00 0000AABB BBBBBBCC
					r.FMSSelectedAltitude = float32((int(data[1] & 0b11) << 10) | (int(data[2]) << 2) | int(data[3] >> 6)) * 16 // ft
					r.BDSFields |= 1 << 1
				}
				if (data[3] >> 5) & 0b1 == 1 {
					// XXXAAAAA BBBBBBB0
					// 000AAAAA A0000000
					//          0BBBBBBB
					// 000AAAAA ABBBBBBB
					r.BarometricPressureSetting = float32((int(data[3] & 0b11111) << 7) | int(data[4] >> 1)) * 0.1 + 800 // mb
					r.BDSFields |= 1 << 2
				}
				if data[5] & 0b1 == 1 {
					r.MCPFCUMode = data[6] >> 5
					r.BDSFields |= 1 << 3
				}
				if (data[6] >> 2) & 0b1 == 1 {
					r.TargetAltitudeSource = data[6] & 0b11
					r.BDSFields |= 1 << 4
				}
			case 5:
				if (data[0] >> 7) & 0b1 == 1 {
					if (data[0] >> 6) & 0b1 == 1 {
						// Negative sign
						r.Roll = -(90 - float32((int(data[0] & 0b111111) << 3) | int(data[0] >> 5)) * 45 / 256) // º
					} else {
						// Positive sign
						r.Roll = float32((int(data[0] & 0b111111) << 3) | int(data[0] >> 5)) * 45 / 256 // º
					}

					r.BDSFields |= 1 << 5
				}
				if (data[1] >> 4) & 0b1 == 1 {
					// XXXXXAAA BBBBBBBX
					// AAA0000000 0BBBBBBB
					// AAA0000000
					//   0BBBBBBB
					if (data[1] >> 3) & 0b1 == 1 {
						// Negative sign
						r.TrueTrack = -(180 - float32((int(data[1] & 0b111) << 7) | int(data[2] >> 1)) * 90 / 512) // º
					} else {
						// Positive sign
						r.TrueTrack = float32((int(data[1] & 0b111) << 7) | int(data[2] >> 1)) * 90 / 512 // º
					}

					r.BDSFields |= 1 << 6
				}
				if data[2] & 0b1 == 1 {
					r.GroundSpeed = float32((int(data[3]) << 2) | int(data[4] >> 6)) * 2 // kt
					r.BDSFields |= 1 << 7
				}
				if (data[4] >> 5) & 0b1 == 1 {
					if (data[4] >> 4) & 0b1 == 1 {
						// Negative sign
						r.TrackRate = -(16 - float32((int(data[4] & 0b1111) << 5) | int(data[5] >> 3)) * 8 / 256) // º/s
					} else {
						// Positive sign
						r.TrackRate = float32((int(data[4] & 0b1111) << 5) | int(data[5] >> 3)) * 8 / 256 // º/s
					}

					r.BDSFields |= 1 << 8
				}
				if (data[5] >> 2) & 0b1 == 1 {
					r.TAS = float32(binary.BigEndian.Uint16([]byte{data[5] & 0b11, data[6]})) * 2 // kt
					r.BDSFields |= 1 << 9
				}
			case 6:
				if (data[0] >> 7) & 0b1 == 1 {
					if (data[0] >> 6) & 0b1 == 1 {
						// Negative sign
						r.MagneticHeading = -(180 - float32((int(data[0] & 0b111111) << 4) | int(data[1] >> 4)) * 90 / 512) // º
					} else {
						// Positive sign
						r.MagneticHeading = float32((int(data[0] & 0b111111) << 4) | int(data[1] >> 4)) * 90 / 512 // º
					}

					r.BDSFields |= 1 << 10
				}
				if (data[1] >> 3) & 0b1 == 1 {
					r.IAS = float32((int(data[1] & 0b111) << 7) | int(data[2] >> 1)) // kt
					r.BDSFields |= 1 << 11
				}
				if data[2] & 0b1 == 1 {
					r.MACH = float32((int(data[3]) << 2) | int(data[4] >> 6)) * 2.048 / 512
					r.BDSFields |= 1 << 12
				}
				if (data[4] >> 5) & 0b1 == 1 {
					if (data[4] >> 4) & 0b1 == 1 {
						// Negative sign
						r.BarometricAltitudeRate = -(16384 - float32((int(data[4] & 0b1111) << 5) | int(data[5] >> 3)) * 8192 / 256) // ft/min
					} else {
						// Positive sign
						r.BarometricAltitudeRate = float32((int(data[4] & 0b1111) << 5) | int(data[5] >> 3)) * 8192 / 256 // ft/min
					}

					r.BDSFields |= 1 << 13
				}
				if (data[5] >> 2) & 0b1 == 1 {
					if (data[5] >> 1) & 0b1 == 1 {
						// Negative sign
						r.InertialVerticalVelocity = -(16384 - float32((int(data[5] & 0b1) << 8) | int(data[6])) * 8192 / 256) // ft/min
					} else {
						// Positive sign
						r.InertialVerticalVelocity = float32((int(data[5] & 0b1) << 8) | int(data[6])) * 8192 / 256 // ft/min
					}

					r.BDSFields |= 1 << 14
				}
			}
		}
	}

	r.BDS = bds
	r.Has250 = true
	return 1 + 8 * n, nil
}

func (r *DataRecord048) parse042(buf []byte) (int, error) {
	aux := binary.BigEndian.Uint64([]byte{0, 0, buf[0], buf[1]})
	r.CartesianX = float32(twosComplement(aux, 16)) / 128
	aux = binary.BigEndian.Uint64([]byte{0, 0, buf[2], buf[3]})
	r.CartesianY = float32(twosComplement(aux, 16)) / 128

	r.Has042 = true
	return 4, nil
}

func (r *DataRecord048) parse200(buf []byte) (int, error) {
	r.CalculatedGroundSpeed = float32((int(buf[0]) << 8) | int(buf[1])) * 0.22
	r.CalculatedHeading = float32((int(buf[2]) << 8) | int(buf[3])) * 360 / 65536

	r.Has200 = true
	return 4, nil
}

// TODO: da peor algunos campos girados
func (r *DataRecord048) parse170(buf []byte) (int, error) {
	resultFX := checkFX(buf)


	r.TargetStatusCNF = (buf[0] >> 7) & 0b1 == 1
	r.TargetStatusRAD = (buf[0] >> 6) & 0b11
	r.TargetStatusDOU = (buf[0] >> 4) & 0b1 == 1
	r.TargetStatusMAH = (buf[0] >> 3) & 0b1 == 1
	r.TargetStatusCDM = (buf[0] >> 1) & 0b11

	if resultFX.fieldLen > 1 {
		r.TargetStatusTRE = (buf[1] >> 7) & 0b1 == 1
		r.TargetStatusGHO = (buf[1] >> 6) & 0b1 == 1
		r.TargetStatusSUP = (buf[1] >> 5) & 0b1 == 1
		r.TargetStatusTCC = (buf[1] >> 4) & 0b1 == 1
	}

	r.Has170 = true
	return resultFX.fieldLen, nil
}

func (r *DataRecord048) parse110(buf []byte) (int, error) {
	aux := binary.BigEndian.Uint64([]byte{0, 0, buf[0], buf[1]})
	r.Height3D = float32(twosComplement(aux, 14)) * 25

	return 2, nil
}

func (r *DataRecord048) parse230(buf []byte) (int, error) {
	r.CapabilityCOM = buf[0] >> 5
	r.FlightStatus = (buf[0] >> 2) & 0b111
	r.CapabilitySI = (buf[0] >> 1) & 0b1 == 1
	r.CapabilityMSSC = buf[1] >> 7 == 1
	r.CapabilityARC = (buf[1] >> 6) & 0b1 == 1
	r.CapabilityAIC = (buf[1] >> 5) & 0b1 == 1
	r.BDS1A = (buf[1] >> 4) & 0b1
	r.BDS1B = buf[1] & 0b1111

	r.Has230 = true
	return 2, nil
}