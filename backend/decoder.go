package main

import "log"

func recordsFilter(records []DataRecord048) []DataRecord048 {
	var filteredRecords []DataRecord048

	for _, record := range records {

		var add bool = false

		if record.Mode3ACode == 0o7777 || record.TargetReportType == 2 || record.TargetStatusRAD == 1{
			add = true
		}

		if add == false {
			filteredRecords = append(filteredRecords, record)
		}
	}

	return filteredRecords
}

func DecodeFile(buf []byte) []DataRecord048 {
	records := make([]DataRecord048, 0)
	stop := false
	for i := 0; i < len(buf) && !stop; {
		CAT := buf[i]
		LEN := (int(buf[i + 1]) << 8) | int(buf[i + 2])
		data := buf[i + 3:i + LEN]

		switch CAT {
		case 48:
			r, err := New048(len(records), data)
			if err != nil {
				continue
			}

			records = append(records, r)
		default:
			log.Printf("Data Record Category not implemented: %d", CAT)
			stop = true
		}

		i += LEN
	}
	records = recordsFilter(records)

	return records
}