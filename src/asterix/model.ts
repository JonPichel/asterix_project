export interface AsterixFile {
  filename: string;
  dataRecords: DataRecord[];
}

export type TableColumn = {name: string; label: string; field: string | ((row: DataRecord) => string)}

export interface DataRecord {
  category: number;
}