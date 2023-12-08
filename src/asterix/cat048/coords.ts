import { GPSCoords, RadarPosition, getRadarCoords } from "src/coords"
import DataRecord048 from "./record"

export function gpsCoords(record: DataRecord048): GPSCoords | null {
  if (
    [record.sac, record.sic, record.rho, record.theta, record.flightLevel].some(
      (value) => {
        return value === undefined || value === null
      }
    )
    // Modo 3A 7777
  ) {
    return null
  }

  let radarCoords: GPSCoords
  try {
    radarCoords = getRadarCoords(record.sac!, record.sic!)
  } catch (e) {
    return null
  }

  const radar = new RadarPosition(radarCoords)
  return radar.polarToGPS({
    rho: record.rho! * 1852,
    theta: (record.theta! * Math.PI) / 180,
    z: record.flightLevel! * 100 * 0.3048,
  })
}
