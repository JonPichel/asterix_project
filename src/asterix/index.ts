import { GPSCoords } from "src/coords"
import Category048 from "./cat048"

export const AsterixCategories = new Map([[48, Category048]])

export interface DataRecord {
  category: number
  aircraftID?: string
  timestamp?: number
  gpsCoords?: GPSCoords
}

export type TableColumn = {
  name: string
  label: string
  field: string | ((row: DataRecord) => string)
}

export interface AsterixCategory {
  fromBinary(buf: Uint8Array): DataRecord
  // toKML(...records: T[]): string
  // toCSV(...records: T[]): string
  tableColumns(): TableColumn[]
  // mapPopup(record: T): string
}
